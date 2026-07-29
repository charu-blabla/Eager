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

## Day 3 — *(not yet started)*
