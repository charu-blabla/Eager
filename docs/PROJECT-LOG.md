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

## Day 4 — *(not yet started)*
