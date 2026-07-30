# Eager — Project Structure

Status: Day 3 foundation complete — structure below reflects what actually exists in the repo now, not just the plan.

```
Eager/
├── index.html                 # ✅ Built Day 3 — single HTML shell, all screens render into it
├── style.css                  # ✅ Built Day 3 — design tokens + base styles (screen-specific styles added Days 5-7)
├── netlify.toml                # ✅ Built Day 3 — routes /api/personalize to the function
├── package.json                # ✅ Built Day 3 — project metadata + dev script
├── .env                        # ✅ Created Day 3 (local only, never committed) — holds ANTHROPIC_API_KEY
├── .env.example                 # ✅ Built Day 3 — committed template, no real key
├── .gitignore
├── LICENSE
├── README.md                  # Still placeholder — finalized Day 10
│
├── js/
│   ├── main.js                 # ✅ Built Day 3 (Hello World) — full routing wired Days 5-7
│   ├── matching.js              # ✅ Stub Day 3 — filtering logic implemented Day 5
│   ├── ai.js                    # ✅ Stub Day 3 — real fetch() to /api/personalize implemented Day 6
│   ├── favorites.js             # ✅ Stub Day 3 — localStorage logic implemented Day 7
│   └── render.js                # ✅ Stub Day 3 — screen rendering implemented Days 3/5/6/7
│
├── data/
│   └── ideas.js                 # ✅ Stub Day 3 (empty array) — 40 curated ideas added Day 4
│
├── netlify/
│   └── functions/
│       └── personalize.js       # ✅ Built Day 3 — working stub returning fake data, verified locally; real Anthropic call added Day 6
│
├── docs/                        # ✅ Day 2 design docs + Day 3 setup docs, all committed
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   ├── PROJECT-STRUCTURE.md     # (this file)
│   ├── PROJECT-LOG.md
│   ├── SETUP.md                 # ✅ New Day 3
│   ├── ENVIRONMENT.md           # ✅ New Day 3
│   ├── DAY3-SUMMARY.md          # ✅ New Day 3
│   ├── PRD.md
│   ├── IMPLEMENTATION-BLUEPRINT.md
│   └── PITCH-DECK.md
│
└── TESTING.md                   # Not yet created — Day 8
```

## Folder Responsibilities

| Path | Responsible For | Built On |
|---|---|---|
| `index.html` / `style.css` | App shell and all visual styling, dark-first teal/gold theme | Day 3 |
| `js/main.js` | Top-level app state and screen switching — the only file that "knows about" all 4 screens | Day 3 (stub) → Day 5/6/7 (wired) |
| `js/matching.js` | Pure filtering logic, no DOM code | Day 5 |
| `js/ai.js` | All communication with `/api/personalize`, including loading/error handling | Day 6 |
| `js/favorites.js` | All `localStorage` reads/writes for favorites | Day 7 |
| `js/render.js` | All DOM creation/update functions, one per screen/component | Days 3, 5, 6, 7 (additive) |
| `data/ideas.js` | The entire idea bank content — the product's core asset | Day 4 |
| `netlify/functions/personalize.js` | The one server-side endpoint; owns the Anthropic API key via environment variable | Day 3 (scaffold) → Day 6 (full logic) |
| `netlify.toml` | Redirects `/api/personalize` → the actual function path, deploy settings | Day 3 |
| `docs/` | All design decisions from today, kept in the repo as the source of truth for future sessions | Day 2 |
| `TESTING.md` | Manual test checklist and bug log | Day 8 |

## Why This Structure

- **Flat and shallow** — no nested feature folders, because the app is small enough that one level of `js/`, `data/`, `netlify/functions/` is fully sufficient. Deeper nesting would be premature structure for a 4-screen app.
- **Logic separated by responsibility, not by screen** — `matching.js`, `ai.js`, `favorites.js` each own one concern end-to-end, so any future AI assistant picking up a fresh day only needs to open one file to understand that day's system.
- **No build step, no `src/`/`dist/` split** — consistent with the Day 2 vanilla-JS decision; what you write is what ships.
- **`docs/` lives in the repo, not outside it** — so this exact set of documents travels with the code and is the first thing any fresh session (yours or another AI's) should read before touching Day 3+.
