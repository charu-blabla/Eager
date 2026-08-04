# Eager — API Design

No implementation yet — this is the contract Day 6 builds against.

## Scope Note

Eager has exactly **one** server endpoint. Matching, favoriting, and sharing are all client-side operations against local data (`data/ideas.js`) and `localStorage` — they are not APIs and are intentionally excluded from this document (see SCHEMA.md).

---

## `POST /api/personalize`

Netlify Function at `netlify/functions/personalize.js`, publicly reachable at `/.netlify/functions/personalize` (aliased to `/api/personalize` via `netlify.toml` redirects for a cleaner client-side path).

### Purpose

Takes one base idea plus the user's inputs and returns an AI-personalized project brief: tailored feature list, folder structure, learning roadmap, and resume-ready description (PRD FR-8/FR-9).

### Authentication

None. This is a public, unauthenticated endpoint by design (no accounts in v1.0). The Gemini API key lives server-side as a Netlify environment variable and is never exposed to the client.

> Note for Day 8 (testing): because this endpoint is public and calls a paid-per-token API, basic abuse protection is worth a light touch — e.g. a simple per-IP request cap using Netlify's built-in rate limiting, or a minimum client-side debounce so double-clicks don't double-charge. Not a v1.0 blocker, but flagged here so it isn't forgotten.

### Request

```
POST /api/personalize
Content-Type: application/json
```

```json
{
  "idea": {
    "id": "web-04",
    "title": "Habit Tracker Dashboard",
    "hook": "A visual habit tracker with streaks and weekly stats.",
    "baseDescription": "A single-page app where users log daily habits...",
    "coreConcepts": ["localStorage", "state management", "data visualization"]
  },
  "userInputs": {
    "skillLevel": "Intermediate",
    "selectedStacks": ["JavaScript", "HTML/CSS"],
    "hoursPerWeek": 6,
    "totalWeeks": 2
  }
}
```

### Validation Rules

**[Updated Day 8 — security hardening]** The server no longer trusts client-submitted idea content. It looks up the real idea server-side using only `idea.id`, ignoring any other fields sent in the `idea` object (title, hook, etc. are accepted but discarded). This closes an abuse path where the public endpoint could otherwise be used as an unrestricted text-generation proxy with arbitrary prompt content.

| Field | Rule |
|---|---|
| `idea.id` | Required. Must match a real id from `data/ideas.js` — request is rejected with `400` if not found |
| `userInputs.skillLevel` | Required, must be exactly `"Beginner"`, `"Intermediate"`, or `"Advanced"` |
| `userInputs.selectedStacks` | Required, array with at least 1 entry. Entries not found in `data/stacks.js` are silently filtered out; request is rejected if none remain valid |
| `userInputs.hoursPerWeek` | Required, number between 1 and 80 (bounded server-side, not just via HTML `min`/`max`) |
| `userInputs.totalWeeks` | Required, number between 1 and 52 (bounded server-side, not just via HTML `min`/`max`) |

Any missing/invalid field → `400`, request is rejected before calling the Gemini API (protects API budget from malformed or abusive calls).

### Success Response — `200 OK`

```json
{
  "features": {
    "mustHave": ["User can log a habit as done for the day", "..."],
    "stretch": ["Weekly streak visualization", "..."]
  },
  "folderStructure": "habit-tracker/\n  index.html\n  style.css\n  js/\n    main.js\n    storage.js\n",
  "roadmap": [
    { "week": 1, "focus": "Core habit logging + localStorage persistence" },
    { "week": 2, "focus": "Streak calculation + weekly chart" }
  ],
  "resumeDescription": "Built a habit-tracking web app with localStorage persistence and streak visualization, using vanilla JavaScript."
}
```

### Error Cases

| Status | Condition | Response Body |
|---|---|---|
| `400` | Missing/invalid required field | `{ "error": "validation_error", "message": "<field>-specific message" }` |
| `405` | Wrong HTTP method (not POST) | `{ "error": "method_not_allowed" }` |
| `502` | Gemini API returned an error | `{ "error": "upstream_error", "message": "Personalization is temporarily unavailable. Try again." }` |
| `504` | Gemini API call timed out | `{ "error": "timeout", "message": "That took too long — try again." }` |
| `500` | Unexpected server error | `{ "error": "internal_error" }` |

Every error case maps to the friendly retry UI defined in the Blueprint's Day 6 plan — the client never shows a raw error object.
