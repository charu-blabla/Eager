[PROJECT-STRUCTURE.md](https://github.com/user-attachments/files/30489223/PROJECT-STRUCTURE.md)
# Eager — Project Structure

This is the complete folder structure for v1.0. Every folder below is used by a specific day in the Implementation Blueprint — nothing here is speculative.

```
Eager/
├── index.html                 # Single HTML shell — all 4 screens render into it
├── style.css                  # Design tokens + all screen styles
├── netlify.toml                # Netlify config: build settings, function routing
├── .gitignore
├── LICENSE
├── README.md                  # Project overview, live link, screenshots (finalized Day 10)
│
├── js/
│   ├── main.js                 # Entry point — app state, screen routing, wiring
│   ├── matching.js              # Client-side idea filtering (Day 5)
│   ├── ai.js                    # Calls /api/personalize, handles loading/error states (Day 6)
│   ├── favorites.js             # localStorage read/write (Day 7)
│   └── render.js                # DOM rendering for all 4 screens (Days 3, 5, 6, 7)
│
├── data/
│   └── ideas.js                 # 40 curated idea objects (Day 4) — see SCHEMA.md
│
├── netlify/
│   └── functions/
│       └── personalize.js       # Serverless proxy to Anthropic API (Day 3 scaffold, Day 6 build) — see API.md
│
├── docs/                        # This design documentation (Day 2)
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   ├── PROJECT-STRUCTURE.md
│   └── PROJECT-LOG.md           # Daily progress log, updated each day
│
└── TESTING.md                   # Test checklist + bug log (Day 8)
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
