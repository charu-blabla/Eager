# Eager — Project Log

A running record of daily progress for the AB Talks 60-Day Claude AI Challenge — 10-Day Capstone.

---

## Day 1 — Requirements & Product Discovery

**Focus:** Problem discovery, target user definition, scope-setting, PRD.

- Discovered and locked the project: **Eager**, an AI-personalized project idea generator for students
- Defined target user (portfolio-building students), core problem (decision paralysis on what to build), and success criteria (live deployed link by Day 10)
- Locked key product decisions: hybrid idea generation (40-idea curated bank + AI personalization), no login/accounts for v1, browser-based favorites, simple share-link only
- Explicitly scoped out: payments, multi-language, native mobile, community features beyond share, admin panel
- **Deliverables:** PRD, Implementation Blueprint (Days 2–10), Pitch Deck

---

## Day 2 — System Design

**Focus:** Technical architecture, no code written.

- Set up GitHub repository (`github.com/charu-blabla/Eager`), cloned locally
- Finalized tech stack: Vanilla JS (no build step), no database (static data file + `localStorage`), no auth, Anthropic API via a Netlify serverless function proxy, Netlify hosting
- **Key decision:** moved the AI-proxy serverless function setup from Day 9 to Day 3, so Day 6 builds against a real endpoint from the start instead of rewiring under deployment pressure
- Designed full system architecture with Mermaid diagrams (component diagram, matching data flow, AI request lifecycle)
- Designed data schema: idea bank (`ideas.js`) structure, `localStorage` favorites structure, validated against every FR in the PRD
- Designed the single API contract: `POST /api/personalize` — request/response shapes, validation rules, error cases
- Designed the complete UI/user flow: 4 screens (Input Form, Idea List, Idea Detail, Favorites), low-fi wireframes, navigation model
- Designed the full project folder structure with responsibility mapping
- Updated the Implementation Blueprint (Days 3, 6, 9) to reflect the proxy-timing change
- **Deliverables:** `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, `PROJECT-STRUCTURE.md`, updated `IMPLEMENTATION-BLUEPRINT.md`
- **Lesson learned:** Git on Windows — case-sensitivity mismatches during a merge (`Api.md` vs `API.md`) can silently duplicate/shadow files; `git mv` through a temp name is the reliable fix. Also configured `git config --global core.editor "code --wait"` to avoid Vim confusion on future merge commits.

---

## Day 3 — Project Setup & Foundation

**Focus:** Development environment, project scaffolding, working "Hello World."

- Installed and verified full dev environment: Node.js 24 LTS, npm, Netlify CLI, Anthropic API key
- Built the complete project foundation: HTML shell, CSS design tokens, all JS module stubs, `netlify.toml`, `package.json`
- **Verified the Netlify serverless function end-to-end locally** — the AI-proxy scaffold moved from Day 9 (per Day 2's decision) is now proven working, 6 days ahead of deployment
- Confirmed `.env` correctly protected by `.gitignore`
- Ran the app locally via `netlify dev` — static site and function both verified working
- Decided branching strategy: direct commits to `main` (appropriate for a solo, time-boxed capstone)
- **Security incident:** an API key was briefly exposed via a screenshot sent through WhatsApp during setup — caught immediately, revoked, and replaced. Lesson documented in `ENVIRONMENT.md`.
- **Deliverables:** `SETUP.md`, `ENVIRONMENT.md`, `DAY3-SUMMARY.md`, updated `PROJECT-STRUCTURE.md`
- **Lesson learned:** always verify a manual step actually completed rather than assuming — several Day 3 detours (Node PATH, PowerShell execution policy, Git case-sensitivity, API key exposure) were all caught by checking screenshots rather than assuming success.

---

## Day 4 — Curated Idea Bank

**Focus:** Content — populating the core product asset.

- Created `data/stacks.js` — the fixed 12-option stack list (JavaScript, TypeScript, Python, Java, C++, HTML/CSS, React, Node.js, Flutter, Kotlin, Swift, SQL), shared source of truth for idea tags and Day 5's checkboxes
- Wrote all 40 curated ideas into `data/ideas.js` — 10 each across Web, Mobile, AI, DSA
- Verified programmatically: 40 total, 10/domain, zero duplicate IDs, zero invalid stack tags, clean 3-4-3 difficulty spread in every domain
- No architecture changes — pure content work on top of Day 2's locked schema

---

## Day 5 — Matching Engine & Idea List UI

**Focus:** First user-facing functionality — the input form actually does something.

- Built `js/matching.js`: filters the 40-idea bank by skill level, stack overlap, and time fit, with progressive fallback (loosens time first, then stack, then skill level last) when there are zero exact matches
- Verified matching logic with 3 automated test scenarios (exact match, single-level fallback, double-cascade fallback) before touching any UI
- Built the real Input Form (skill level, 12 stack checkboxes from `stacks.js`, hours/week + total weeks) and the Idea List screen (matched cards with domain tag, title, hook, time estimate), wired end-to-end in `main.js`
- **Mid-day design detour:** user brought a full high-fidelity "Precision Workshop" mockup from Google Stitch requesting a visual overhaul. Flagged the difference between pure styling (safe) and real new scope (light theme swap, nav bar, expanded skill categories, viability scores, progress tracking, accounts) — all but light theme were declined to protect v1.0 scope
- **Approved scope change:** switched from dark-first to light-first theme (PRD updated to reflect this — still a single, polished, non-toggleable theme, just a different palette than originally locked Day 2)
- Applied a genuine visual polish pass: pill-shaped buttons, card-style toggle inputs with checkmark badges, refined shadows/spacing — all pure CSS/markup, zero functional changes
- Zero API calls, zero cost — today's work is 100% client-side per the Day 2 architecture decision

---

## Day 6 — AI Personalization Layer & Live Deployment

**Focus:** Real AI integration, idea detail view, required footer, and — ahead of the original Day 9 schedule — full public deployment.

- Built the real personalization function, idea detail screen (Features, Folder Structure, Learning Roadmap, Resume Description with Copy), loading state, and error/retry state
- Added the required footer: "Built with Claude as part of the AB Talks 60-Day Claude AI Challenge"
- **Provider switch:** the Anthropic Console account had $0 usable credit with no working free-tier path — switched the AI provider to Google Gemini's free tier (Google AI Studio, no card required) instead of introducing a paid service
- **Real debugging marathon getting Gemini working** — six distinct issues, each fixed by reading the actual error instead of guessing:
  1. Wrong auth method — Google's new `AQ.`-format keys need an `x-goog-api-key` header, not the old `?key=` query parameter
  2. `gemini-2.5-flash` had just been retired for new users (404)
  3. `gemini-flash-latest` resolved to a newer model with "thinking" on by default, causing slow responses and truncated JSON output
  4. `gemini-2.0-flash` turned out to have zero free-tier quota on this account (429, `limit: 0`)
  5. Landed on `gemini-3.5-flash-lite` — purpose-built for fast, low-latency, simple tasks like this one — with `thinkingLevel: "minimal"` set explicitly
  6. Tuned the prompt itself to be more concise (shorter phrases, capped roadmap entries) to stay comfortably under Netlify's free-tier ~10s function timeout
- **Deployed to production today** (moved up from Day 9, with explicit approval, since the live demo — minus Favorites/Share, which land Day 7 — was worth having early): connected the GitHub repo to Netlify, set `GEMINI_API_KEY` as a production environment variable, fixed a "private site" visibility setting, verified the live app in an incognito window
- Live at **https://eager-capstone.netlify.app**
- Updated all docs (`ARCHITECTURE.md`, `API.md`, `ENVIRONMENT.md`, `SETUP.md`, `IMPLEMENTATION-BLUEPRINT.md`) to reflect the Gemini switch and final model choice

---

## Day 7 — Favorites, Share & UX Polish

**Focus:** Completing the last two v1.0 features (Favorites, Share) plus a full design/UX refinement pass.

- Built `js/favorites.js`: real `localStorage` logic (get/add/remove/isFavorited), with an upsert pattern so a favorite's cached brief can be upgraded from a placeholder to a real AI-generated one later
- Star button added to every idea card and the detail screen — instant toggle, persists across refresh
- **Favorites view** built: shows saved ideas with cached briefs, empty state when nothing's saved, reachable from a new persistent top nav bar on every screen
- **Share** built: copies a `?idea=<id>` link to the clipboard with a toast confirmation; opening that link auto-loads the idea, using cached data when available or personalizing fresh otherwise
- **Real bug caught during testing:** favoriting an idea straight from the list (before it had ever been personalized) saved only a placeholder — opening it from Favorites showed empty Features/Folder Structure/Roadmap sections. Fixed by having Favorites auto-generate and cache the real brief the first time an incomplete favorite is opened, and by making `addFavorite` upsert instead of skip duplicates
- **Design/UX polish pass** (senior-review-style, bundled into the same file changes): persistent top nav across all screens, color-coded domain tags per category, empty states, toast notifications, visible keyboard focus rings, ARIA labels/roles throughout, small responsive fixes for narrow screens
- Redeployed to the live site — all v1.0 features (FR-1 through FR-13) are now functionally complete and live

---

## Day 8 — Testing, Security Hardening & Production Readiness

**Focus:** Senior-level QA pass — security, XSS, edge cases, accessibility, performance. No new features.

- **Security (High severity, fixed):** the public `/api/personalize` endpoint trusted whatever idea content the client sent, meaning anyone could bypass the real idea bank entirely and use the free Gemini quota as an open text-generation proxy. Fixed by having the server look up ideas by ID from its own trusted copy of `data/ideas.js`, ignoring all other client-submitted idea fields
- Server-side bounds added for `hoursPerWeek`/`totalWeeks` and stack-name validation — previously only enforced via HTML attributes, meaningless to anyone calling the endpoint directly
- Converted the Netlify function to ES modules (`package.json` `"type": "module"`) so it could cleanly import the real `data/ideas.js`/`stacks.js` instead of duplicating data
- **XSS defense:** all dynamic text — including AI-generated content, which isn't 100% predictable — now escaped before insertion into the DOM
- **Race condition fix:** rapid double-clicking an idea card previously could fire two concurrent AI requests; now guarded
- Friendlier offline/network error messaging, distinct from generic server errors
- Full manual form validation (previously only the stack checkbox was validated; skill level and time bounds now show their own clear errors too)
- Small production-readiness cleanup: defined the previously-undefined `--color-gold` CSS variable, added a favicon (was causing a silent 404), added the missing `fonts.gstatic.com` preconnect
- Full end-to-end walkthrough completed and documented in the new `TESTING.md`
- Redeployed live with all fixes verified on the production URL

---

## Day 9 — *(not yet started)*
