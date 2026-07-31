# Eager — Data Schema

No traditional database exists in v1.0 (see ARCHITECTURE.md §6). This document defines the two data structures the app relies on: the static idea bank and the browser-persisted favorites store.

## 1. Idea Bank — `data/ideas.js`

A static array of 40 objects, exported as the single source of idea content. Written once on Day 4, read-only at runtime.

### Schema

| Field | Type | Constraints |
|---|---|---|
| `id` | string | Unique across all 40 entries, e.g. `"web-01"`, `"mobile-07"`, `"ai-03"`, `"dsa-10"` |
| `title` | string | Non-empty, unique within its domain |
| `domain` | string | One of exactly: `"Web"`, `"Mobile"`, `"AI"`, `"DSA"` |
| `hook` | string | One sentence, ≤120 characters — shown on the IdeaCard |
| `difficulty` | string | One of exactly: `"Beginner"`, `"Intermediate"`, `"Advanced"` |
| `estimatedWeeks` | number | Positive integer — realistic solo build time at the stated difficulty |
| `suggestedStacks` | array of strings | Must match the fixed checkbox option list defined in `data/stacks.js` exactly (case-sensitive) |
| `baseDescription` | string | 2–4 sentences — input context for AI personalization, not shown raw to the user |
| `coreConcepts` | array of strings | 3–5 short skill/concept tags, e.g. `["REST APIs", "local storage", "form validation"]` |

### Example Entry

```js
{
  id: "web-04",
  title: "Habit Tracker Dashboard",
  domain: "Web",
  hook: "A visual habit tracker with streaks and weekly stats.",
  difficulty: "Intermediate",
  estimatedWeeks: 2,
  suggestedStacks: ["JavaScript", "HTML/CSS"],
  baseDescription: "A single-page app where users log daily habits and see streaks and a weekly completion chart. Focuses on state management and localStorage persistence without a backend.",
  coreConcepts: ["localStorage", "state management", "data visualization", "date logic"]
}
```

### Content Rules (from Blueprint Day 4)

- Exactly 10 entries per domain, 40 total
- Each domain has a spread across all 3 difficulty levels (roughly 3–4–3)
- `suggestedStacks` values are copy-pasted from one fixed list, never retyped, to avoid silent matching bugs

## 2. Favorites Store — `localStorage`

Single key, JSON-stringified array. No backend, no accounts (PRD §5.1/§7.4).

**Key:** `eager_favorites`

### Schema (per favorite entry)

| Field | Type | Notes |
|---|---|---|
| `ideaId` | string | References `ideas.js` → `id` |
| `favoritedAt` | string (ISO timestamp) | For potential future sorting |
| `personalizedSnapshot` | object | The AI-generated brief captured *at the time of favoriting* — `{ features, folderStructure, roadmap, resumeDescription }` — cached so reopening a favorite never needs a fresh AI call |

### Example

```json
[
  {
    "ideaId": "web-04",
    "favoritedAt": "2026-08-02T14:12:00.000Z",
    "personalizedSnapshot": {
      "features": { "mustHave": ["..."], "stretch": ["..."] },
      "folderStructure": "habit-tracker/\n  index.html\n  ...",
      "roadmap": [ { "week": 1, "focus": "..." } ],
      "resumeDescription": "Built a habit-tracking dashboard..."
    }
  }
]
```

### Access Functions (implemented Day 7, `js/favorites.js`)

- `getFavorites()` → parsed array (returns `[]` if key doesn't exist, wrapped in try/catch)
- `addFavorite(ideaId, personalizedSnapshot)` → appends and re-saves
- `removeFavorite(ideaId)` → filters out and re-saves
- `isFavorited(ideaId)` → boolean, used to set star icon state

## 3. Schema Validation Against PRD User Stories

| PRD Requirement | Supported By |
|---|---|
| FR-1–FR-4: Input collection | No stored schema needed — form state only, transient |
| FR-5–FR-7: Matching & browsing | `ideas.js` fields: `difficulty`, `suggestedStacks`, `estimatedWeeks` |
| FR-8–FR-10: AI personalization | `ideas.js` fields feed the prompt: `title`, `hook`, `baseDescription`, `coreConcepts` |
| FR-11–FR-12: Favorites persist | `eager_favorites` localStorage schema |
| FR-13: Share link | No new schema — idea `id` + minimal state encoded as a URL query parameter, resolved back against `ideas.js` on load |

Every functional requirement from the PRD maps to a field or store defined above — no gaps, no unused fields.
