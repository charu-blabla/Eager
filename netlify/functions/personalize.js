// netlify/functions/personalize.js (ESM — see package.json "type": "module")
// The ONLY server-side code in this project. Holds GEMINI_API_KEY safely and
// proxies personalization requests, per ARCHITECTURE.md and API.md.
//
// Day 8 security hardening: this is a PUBLIC, unauthenticated endpoint.
// Previously it trusted whatever "idea" content the client sent (title, hook,
// description) — meaning anyone could POST arbitrary text directly to this
// endpoint and use the free Gemini quota as an open text-generation proxy,
// bypassing the actual 40-idea bank entirely. Fixed by looking up the idea by
// ID from our own trusted data/ideas.js instead of trusting client-submitted
// content, validating stack names against the known list, and bounding the
// numeric inputs (the HTML min/max attributes only protect the browser form,
// not someone hitting this endpoint directly).

import { ideas } from "../../data/ideas.js";
import { STACK_OPTIONS } from "../../data/stacks.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";
// Netlify's free-tier synchronous functions have a hard ~10s execution limit.
const TIMEOUT_MS = 9500;

const ideasById = Object.fromEntries(ideas.map((i) => [i.id, i]));
const VALID_SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const MAX_HOURS_PER_WEEK = 80;
const MAX_TOTAL_WEEKS = 52;

function validateAndResolveRequest(payload) {
  const errors = [];
  const { idea: clientIdea, userInputs } = payload || {};

  // Look up the REAL idea server-side — never trust client-submitted idea content.
  const ideaId = clientIdea && typeof clientIdea.id === "string" ? clientIdea.id : null;
  const idea = ideaId ? ideasById[ideaId] : null;
  if (!idea) {
    errors.push("idea.id must reference a known idea");
  }

  if (!userInputs || !VALID_SKILL_LEVELS.includes(userInputs.skillLevel)) {
    errors.push("userInputs.skillLevel must be Beginner, Intermediate, or Advanced");
  }

  let validStacks = [];
  if (!userInputs || !Array.isArray(userInputs.selectedStacks) || userInputs.selectedStacks.length === 0) {
    errors.push("userInputs.selectedStacks must be a non-empty array");
  } else {
    validStacks = userInputs.selectedStacks.filter((s) => STACK_OPTIONS.includes(s));
    if (validStacks.length === 0) {
      errors.push("userInputs.selectedStacks must contain at least one recognized stack");
    }
  }

  const hoursPerWeek = userInputs && Number(userInputs.hoursPerWeek);
  if (!hoursPerWeek || hoursPerWeek <= 0 || hoursPerWeek > MAX_HOURS_PER_WEEK) {
    errors.push(`userInputs.hoursPerWeek must be a number between 1 and ${MAX_HOURS_PER_WEEK}`);
  }

  const totalWeeks = userInputs && Number(userInputs.totalWeeks);
  if (!totalWeeks || totalWeeks <= 0 || totalWeeks > MAX_TOTAL_WEEKS) {
    errors.push(`userInputs.totalWeeks must be a number between 1 and ${MAX_TOTAL_WEEKS}`);
  }

  if (errors.length > 0) return { errors };

  return {
    errors: [],
    idea, // the trusted, server-side version
    userInputs: {
      skillLevel: userInputs.skillLevel,
      selectedStacks: validStacks,
      hoursPerWeek,
      totalWeeks,
    },
  };
}

function buildPrompt(idea, userInputs) {
  const { skillLevel, selectedStacks, hoursPerWeek, totalWeeks } = userInputs;
  const roadmapEntries = Math.min(totalWeeks, 5);

  return `You are helping a student plan a coding project. Given the project idea and the student's context below, generate a personalized project brief. Be concise — short phrases, not paragraphs.

PROJECT IDEA:
Title: ${idea.title}
Summary: ${idea.hook}
Details: ${idea.baseDescription}
Core concepts: ${idea.coreConcepts.join(", ")}

STUDENT CONTEXT:
Skill level: ${skillLevel}
Tech stack: ${selectedStacks.join(", ")}
Time available: ${hoursPerWeek} hrs/week for ${totalWeeks} week(s)

Respond with ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:

{
  "features": {
    "mustHave": ["short phrase", "short phrase", "short phrase"],
    "stretch": ["short phrase"]
  },
  "folderStructure": "a brief text tree using \\n for line breaks, max 8 lines, appropriate for ${selectedStacks.join(", ")}",
  "roadmap": [
    { "week": 1, "focus": "short phrase" }
  ],
  "resumeDescription": "one short sentence, resume-ready, past tense"
}

Rules (follow exactly, keep it short):
- mustHave: exactly 3 short phrases (5-8 words each), not sentences.
- stretch: exactly 1 short phrase.
- folderStructure: max 8 lines total.
- roadmap: exactly ${roadmapEntries} entries${totalWeeks > 5 ? ` (group the ${totalWeeks} weeks into ${roadmapEntries} phases, e.g. "week": "1-2")` : ""}, each focus under 10 words.
- resumeDescription: under 20 words.
- No extra commentary, no explanations — JSON only.`;
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "method_not_allowed" }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "validation_error", message: "Request body must be valid JSON." }),
    };
  }

  const { errors, idea, userInputs } = validateAndResolveRequest(payload);
  if (errors.length > 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "validation_error", message: errors.join("; ") }),
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "internal_error", message: "Server is not configured correctly." }),
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(idea, userInputs) }] }],
        generationConfig: {
          maxOutputTokens: 1200,
          thinkingConfig: { thinkingLevel: "minimal" },
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", response.status, errorBody);
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "upstream_error",
          message: "Personalization is temporarily unavailable. Try again.",
        }),
      };
    }

    const data = await response.json();
    const rawText =
      (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text) ||
      "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Gemini response was not valid JSON:", rawText);
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "upstream_error",
          message: "Personalization is temporarily unavailable. Try again.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("personalize.js caught error:", err.name, err.message);
    if (err.name === "AbortError") {
      return {
        statusCode: 504,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "timeout", message: "That took too long — try again." }),
      };
    }
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "internal_error" }),
    };
  }
};
