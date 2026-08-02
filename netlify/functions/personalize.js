// netlify/functions/personalize.js
// The ONLY server-side code in this project. Holds GEMINI_API_KEY safely
// and proxies personalization requests, per ARCHITECTURE.md and API.md.
// Day 6: switched from Anthropic to Google Gemini's free API tier — the
// Anthropic Console account had $0 credit with no free-tier path available,
// while Gemini's free tier (Google AI Studio) needs only a Google account,
// no card, ~1,500 requests/day. This does NOT change the app's request/response
// contract (still POST /api/personalize -> same JSON shape per API.md) and
// does NOT change what "Built with Claude" in the footer refers to — that
// describes how the whole app was built during this challenge, not which
// vendor powers this one backend call. Uses gemini-flash-latest (an alias
// Google keeps pointed at the current default Flash model) instead of a
// pinned version, after gemini-2.5-flash was retired for new users.

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";
// Using the Flash-Lite model specifically: built for low-latency, simple
// tasks like structured extraction (exactly what this function does), with
// thinking_level defaulting to "minimal" — explicitly set below for clarity
// and to stay fast even if that default changes again later.
// Netlify's free-tier synchronous functions have a hard ~10s execution limit.
// We abort at 9.5s so we can return a clean 504 instead of Netlify force-killing the function.
const TIMEOUT_MS = 9500;

function validateRequest(idea, userInputs) {
  const errors = [];

  if (!idea || typeof idea.id !== "string" || !idea.id) {
    errors.push("idea.id is required");
  }
  if (!idea || typeof idea.title !== "string" || !idea.title) {
    errors.push("idea.title is required");
  }
  if (!idea || typeof idea.hook !== "string" || !idea.hook) {
    errors.push("idea.hook is required");
  }
  if (!idea || typeof idea.baseDescription !== "string" || !idea.baseDescription) {
    errors.push("idea.baseDescription is required");
  }
  if (!idea || !Array.isArray(idea.coreConcepts) || idea.coreConcepts.length === 0) {
    errors.push("idea.coreConcepts must be a non-empty array");
  }

  const validSkillLevels = ["Beginner", "Intermediate", "Advanced"];
  if (!userInputs || !validSkillLevels.includes(userInputs.skillLevel)) {
    errors.push("userInputs.skillLevel must be Beginner, Intermediate, or Advanced");
  }
  if (!userInputs || !Array.isArray(userInputs.selectedStacks) || userInputs.selectedStacks.length === 0) {
    errors.push("userInputs.selectedStacks must be a non-empty array");
  }
  if (!userInputs || typeof userInputs.hoursPerWeek !== "number" || userInputs.hoursPerWeek <= 0) {
    errors.push("userInputs.hoursPerWeek must be a positive number");
  }
  if (!userInputs || typeof userInputs.totalWeeks !== "number" || userInputs.totalWeeks <= 0) {
    errors.push("userInputs.totalWeeks must be a positive number");
  }

  return errors;
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

exports.handler = async (event) => {
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

  const { idea, userInputs } = payload;
  const errors = validateRequest(idea, userInputs);
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
