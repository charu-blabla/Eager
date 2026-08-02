# Eager — Implementation Blueprint (Days 2–10)

AB Talks 60-Day Claude AI Challenge — 10-Day Capstone — Single Source of Truth

## How to Use This Document

Each remaining day of the capstone begins as a fresh AI conversation. Paste that day's section into the new chat (or reference this file directly) and the AI assistant should be able to continue building without redesigning, re-planning, or re-deciding architecture. Every day includes an objective, what you'll learn, features to build, a step-by-step plan, exact files/folders, tools to integrate, testing tasks, common issues, an end-of-day checklist, expected state/screenshots, and handoff notes for the next day.

**Locked product decisions (do not re-litigate):** no login/accounts for v1 (browser-based favorites only), hybrid idea generation (curated 40-idea bank + AI personalization layer), 3 skill levels, multi-select checkbox tech stack input, hours/week + total weeks for time input, all-matching-ideas-as-a-list flow, simple share-link only (no comments/likes), no payments, no multi-language, no native mobile, no admin panel for v1.

**Locked technical decisions (Day 2):** Vanilla HTML/CSS/JS, no build step. No database — static `data/ideas.js` + browser `localStorage`. No authentication. Gemini API (`claude-sonnet-5`) called only from a Netlify serverless function, never the browser. Hosting: Netlify. Fonts: Space Grotesk / Inter / IBM Plex Mono via Google Fonts CDN. Full detail in `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, `PROJECT-STRUCTURE.md`.

---

## DAY 2: Design, Tech Stack Decision & Wireframes ✅ Complete

Covered by `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, `PROJECT-STRUCTURE.md` in this `docs/` folder.

---

## DAY 3: Project Setup & Scaffolding

**🎯 Objective:** Stand up the project skeleton so every subsequent day is additive, not structural.

**📖 What You'll Learn:** Structuring a small front-end project cleanly from the start; git hygiene; separating data from logic from UI from day one; scaffolding a serverless function.

**🛠 Features to Build:** Empty but running shell of the app: page loads, shows the input form UI (non-functional), styled with Day 2's design tokens.

**📝 Step-by-Step Plan:**
1. Create the project folder structure per `PROJECT-STRUCTURE.md`.
2. Initialize git: `git init`, `.gitignore` (already done — repo exists), first commit if not already.
3. Create `index.html` with the base HTML shell, linking `style.css` and `js/main.js`.
4. Build `style.css` with CSS custom properties for design tokens: `--color-teal`, `--color-gold`, `--color-bg-dark`, `--color-text`, font-family variables. Dark background from the start.
5. Build the static (non-functional yet) markup for the Input Form screen only: skill level selector, tech stack checkboxes (hardcode the stack list), time inputs, a Submit button that does nothing yet.
6. Create empty placeholder files: `data/ideas.js` (empty array), `js/matching.js`, `js/ai.js`, `js/favorites.js`, `js/render.js`.
7. **[Day 2 update]** Scaffold the AI-proxy function now: `netlify/functions/personalize.js` as a stub returning hardcoded fake data, plus `netlify.toml` with a redirect from `/api/personalize` to `/.netlify/functions/personalize`.
8. Confirm the page loads with no console errors before ending the day.

**📂 Files/Folders:** `index.html`, `style.css`, `js/main.js`, `js/matching.js` (stub), `js/ai.js` (stub), `js/favorites.js` (stub), `js/render.js` (stub), `data/ideas.js` (stub), `netlify/functions/personalize.js` (stub), `netlify.toml`, `.gitignore`, `README.md`.

**🔗 Tools/Services:** Git/GitHub (repo already created). Netlify account — sign up (free tier) today so the function stub can be test-deployed.

**🧪 Testing:** Open in browser, confirm no console errors; confirm dark theme + teal/gold styling visible; resize window to confirm basic layout doesn't break on mobile width.

**🐞 Common Issues:** Fonts not loading → check Google Fonts `<link>` tags. CSS variables not applying → confirm defined on `:root`. Blank page (if React-via-CDN were used) → script order issues — not applicable, since vanilla JS was chosen.

**✅ End-of-Day Checklist:** Folder structure matches `PROJECT-STRUCTURE.md`; git repo has a commit; page loads styled; input form markup visible (non-functional); no console errors; function stub + `netlify.toml` created.

**📸 Screenshots:** Styled (non-functional) input form in browser; folder structure in editor.

**➡️ Handoff to Day 4:** Shell is ready. Day 4 fills `data/ideas.js` with curated content and does not touch layout/styling.

---

## DAY 4: Curated Idea Bank — Content Creation

**🎯 Objective:** Write all 40 curated project ideas as structured data.

**📖 What You'll Learn:** Structuring content as clean, queryable data; writing idea briefs specific enough to be useful but general enough for AI personalization to expand meaningfully.

**🛠 Features to Build:** Complete `data/ideas.js` — 40 idea objects, 10 each for Web, Mobile, AI/ML, DSA.

**📝 Step-by-Step Plan:**
1. Define the schema per `SCHEMA.md`: `id`, `title`, `domain`, `hook`, `difficulty`, `estimatedWeeks`, `suggestedStacks`, `baseDescription`, `coreConcepts`.
2. Write all 10 Web ideas, varying difficulty (~3-4-3 split across Beginner/Intermediate/Advanced).
3. Write all 10 Mobile ideas the same way.
4. Write all 10 AI/ML ideas the same way.
5. Write all 10 DSA ideas the same way.
6. Export the full array of 40 from `data/ideas.js`.
7. Sanity check: unique ids, difficulty spread per domain, `suggestedStacks` strings match the fixed checkbox list exactly.

**📂 Files/Folders:** `data/ideas.js` (fully populated).

**🔗 Tools/Services:** None — pure content writing (may brainstorm with an AI assistant, but review every entry yourself).

**🧪 Testing:** Confirm exactly 40 entries, 10 per domain, no duplicate ids (quick script or console check).

**🐞 Common Issues:** Inconsistent stack naming is the #1 silent bug source — copy-paste from a fixed list, never retype. Avoid near-duplicate ideas within a domain.

**✅ End-of-Day Checklist:** 40 total ideas, schema-consistent; difficulty spread exists; stack tags match exactly; no duplicate ids.

**📸 Screenshots:** `ideas.js` showing schema + sample entries.

**➡️ Handoff to Day 5:** Idea bank complete and stable — schema is now fixed, don't change field names without updating Day 5's code.

---

## DAY 5: Matching Engine & Idea List UI

**🎯 Objective:** Make the input form functional — submitting it filters the idea bank and displays real matching results.

**📖 What You'll Learn:** Filter/matching logic over an array of objects; rendering dynamic lists from data; basic form state management.

**🛠 Features to Build:** Functional input form with validation; matching logic; rendered idea list (FR-6); zero/near-match fallback state (FR-7).

**📝 Step-by-Step Plan:**
1. In `matching.js`, write the filter function: takes `{skillLevel, selectedStacks, hoursPerWeek, totalWeeks}` + the ideas array, returns ideas matching difficulty, stack overlap, and time fit.
2. Wire Submit: validate ≥1 stack checked (FR-4) with inline error if not; call filter function; store results in app state.
3. Build the render function for the idea list: IdeaCard per idea (title, domain tag, hook, estimated time), clickable (logs to console for now — full expand is Day 6).
4. Handle zero-match case: progressively loosen filters (time-fit loosest, then stack, skill level protected longest) with a note like "No exact matches — showing closest results."
5. Style the list/cards with Day 2's design tokens — dark cards, teal/gold domain tags.

**📂 Files/Folders:** `js/matching.js` (implemented), `js/render.js` (list + card rendering), `js/main.js` (wire submit → match → render), `style.css` (card/list styles).

**🔗 Tools/Services:** None external — pure client-side logic.

**🧪 Testing:** Test each skill level independently; test single vs multiple stack selections; test a combo producing zero exact matches; test empty stack selection (validation error).

**🐞 Common Issues:** No matches ever → log filter inputs vs. a sample idea, usually a string mismatch (`'React'` vs `'react'`). Checkboxes not reading correctly → confirm unique name/value per checkbox, collect all checked into an array.

**✅ End-of-Day Checklist:** Form validates/submits; matching logic correct for 3+ tested combos; idea list renders correctly; zero-match fallback works.

**📸 Screenshots:** Filled-in input form; resulting matched idea list; zero-match fallback state.

**➡️ Handoff to Day 6:** Clicking a card currently just logs to console. Day 6 builds the expanded detail view wired to AI personalization — reuse today's click handler and selected-idea state.

---

## DAY 6: AI Personalization Layer & Expanded Idea View

**🎯 Objective:** Connect idea clicks to a real AI call that personalizes the idea into a full brief, displayed in a polished detail view.

**📖 What You'll Learn:** Calling your own serverless endpoint from a front-end app; prompt design for structured, reliable output; handling async loading/error states gracefully.

**🛠 Features to Build:** AI personalization call in `ai.js`; Expanded Idea Detail view (FR-9): tailored feature list, folder structure, learning roadmap, resume description; loading state (FR-10).

**📝 Step-by-Step Plan:**
1. In `ai.js`, write `personalizeIdea(idea, userInputs)` that calls the app's own endpoint — `POST /api/personalize` — per `API.md`. Do **not** call the Gemini API directly from this file.
2. **[Day 2 update]** In `netlify/functions/personalize.js`, replace the Day 3 stub with real logic: validate the request body per `API.md`, build a prompt combining the base idea with the user's skill level/stack/time, explicitly requesting structured sections (Must-Have/Stretch features, folder tree, week-by-week roadmap, resume line).
3. **[Day 2 update, provider switched Day 6]** From the function, call the Gemini `generateContent` endpoint server-side (model `gemini-3.5-flash-lite`, `maxOutputTokens` ~1200 to start) using the `GEMINI_API_KEY` environment variable — never hard-coded. Return JSON per `API.md`'s success shape, or the correct error status per its error table.
4. Wire the card click handler (Day 5) to trigger `personalizeIdea`, show a loading state while awaiting, then render the result.
5. Build the IdeaDetail view: Feature List, Folder Structure (IBM Plex Mono), Learning Roadmap, Resume Description (copyable). Include a back/close action.
6. Handle failure gracefully — friendly retry message, never a blank screen or raw error.

**📂 Files/Folders:** `js/ai.js` (implemented), `netlify/functions/personalize.js` (full logic), `js/render.js` (IdeaDetail added), `js/main.js` (wire click → loading → ai.js → render), `style.css` (detail + loading styles).

**🔗 Tools/Services:** Gemini API (`generateContent`, model `gemini-3.5-flash-lite`, free tier via Google AI Studio) — called only from the serverless function.

**🧪 Testing:** Same idea across all 3 skill levels — confirm output meaningfully changes; slow/throttled network → loading state displays; deliberately break the API call → error state, not a crash; folder structure renders legibly in monospace.

**🐞 Common Issues:** Inconsistent output format → tighten prompt with explicit section delimiters. Slow responses → reduce `max_tokens` or trim prompt context. Local key issues → set `GEMINI_API_KEY` via Netlify CLI dev environment, never commit it.

**✅ End-of-Day Checklist:** Clicking an idea triggers a real AI call with a loading state; detail view renders all 4 pieces correctly; tested across 2+ skill levels with visibly different output; error state handled gracefully.

**📸 Screenshots:** Loading state; fully expanded personalized idea detail view.

**➡️ Handoff to Day 7:** Core product loop (input → match → personalize) fully functional. Day 7 adds favorites/share on top of the existing selected-idea/detail-view state.

---

## DAY 7: Favorites, Share & UI Polish

**🎯 Objective:** Complete favorites and share, and bring the UI to portfolio-ready polish.

**📖 What You'll Learn:** Using `localStorage` for persistence without a backend; constructing shareable state via URL parameters; UI polish passes.

**🛠 Features to Build:** Favorite/unfavorite toggle (FR-11) with `localStorage` persistence (FR-12); dedicated Favorites view; Share button (FR-13); general polish pass.

**📝 Step-by-Step Plan:**
1. In `favorites.js`, write `getFavorites()`, `addFavorite(ideaId, personalizedData)`, `removeFavorite(ideaId)`, `isFavorited(ideaId)` — all backed by `localStorage` key `eager_favorites`, per `SCHEMA.md`.
2. Add a star icon to IdeaCard and IdeaDetail; toggling updates `localStorage` immediately and reflects current state.
3. Build the Favorites view: lists all favorited ideas from `localStorage` (cached personalized data, no re-fetch needed), each openable back into detail view.
4. Implement Share: button constructs a URL with the idea id as a query parameter, copies to clipboard with a confirmation toast; on page load, check for that parameter and auto-open the relevant idea.
5. Full polish pass: consistent spacing/padding, hover states, empty-state messaging for Favorites, confirm palette/fonts applied everywhere, recheck mobile width.

**📂 Files/Folders:** `js/favorites.js` (implemented), `js/render.js` (Favorites view + stars + share button), `js/main.js` (routing/state, share-link handling on load), `style.css` (polish pass).

**🔗 Tools/Services:** Browser `localStorage` API; Clipboard API (`navigator.clipboard.writeText`).

**🧪 Testing:** Favorite → refresh → still favorited; unfavorite → removed from view; copy share link → open in incognito → opens correctly with no prior storage; check all screens at 375px width.

**🐞 Common Issues:** `localStorage` only stores strings — always `JSON.stringify`/`JSON.parse`, wrap parse in try/catch. Share link not reopening → confirm query param is read before app init. Clipboard API needs a secure context — works fine once deployed.

**✅ End-of-Day Checklist:** Favorites persist across refresh; Favorites view lists/reopens correctly; share link reopens correctly in a fresh session; UI polish complete, mobile-checked.

**📸 Screenshots:** Favorites view with 2+ saved ideas; app at mobile width; share confirmation toast.

**➡️ Handoff to Day 8:** All v1.0 features (FR-1–FR-13) functionally complete. Day 8 is testing/bug-fixing only — no new features.

---

## DAY 8: Testing & Bug Fixing

**🎯 Objective:** Systematically test the complete app and fix every bug found before deployment — no new features today.

**📖 What You'll Learn:** Writing a manual test plan; cross-browser and edge-case testing habits; triaging and fixing bugs efficiently under time pressure.

**🛠 Features to Build:** None — bug fixes only, scoped strictly to issues found while testing.

**📝 Step-by-Step Plan:**
1. Write a test checklist covering the full flow: form validation, all skill/stack/time combos, idea list rendering, AI personalization for multiple ideas, favorites add/remove/persist, share link generation/reopening, every empty/error state.
2. Run the checklist in your primary browser, logging every bug (don't fix yet).
3. Run the same checklist in a second browser (e.g. Chrome + Firefox) for cross-browser issues.
4. Test at 3 widths: desktop (~1440px), tablet (~768px), mobile (~375px).
5. Test edge cases: rapid double-clicking submit, only one stack checked, an extremely short time budget (1hr/week, 1 week) to confirm the near-match fallback, a very long AI response to confirm layout doesn't break.
6. Triage by severity (breaks core flow > visual glitch > minor polish) and fix in that order.
7. Re-test every fixed bug.

**📂 Files/Folders:** `TESTING.md` (checklist + bug log). Fixes land in existing files — no new files expected.

**🔗 Tools/Services:** Browser DevTools (console + responsive device toolbar).

**🧪 Testing:** Full checklist in 2 browsers; 3 widths checked; edge cases verified; all logged bugs re-verified fixed.

**🐞 Common Issues:** Browser-specific bug → check for an unsupported feature (Clipboard API, CSS edge cases). Resist adding "just one more feature" — log it as v2 instead.

**✅ End-of-Day Checklist:** `TESTING.md` complete; no known breaking bugs in the core flow; app stable across 2 browsers and 3 widths.

**📸 Screenshots:** `TESTING.md` checklist; app working correctly at mobile width after fixes.

**➡️ Handoff to Day 9:** App stable and feature-complete. Day 9 deploys to Netlify — config only, since the proxy work is already done.

---

## DAY 9: Deployment

**🎯 Objective:** Ship Eager to a live, public URL.

**📖 What You'll Learn:** Deploying a static front-end + serverless function to Netlify; setting production environment variables; post-deploy smoke testing.

**🛠 Features to Build:** None new — deployment configuration only.

**📝 Step-by-Step Plan:**
1. **[Day 2 update]** The API-key proxy is already built and working (Day 3/6) — today is deployment config only. Confirm `GEMINI_API_KEY` is set in the Netlify dashboard under Site settings → Environment variables for the **production** site (a local `.env` value does not carry over automatically).
2. Push the final, tested code to GitHub (if not already continuously pushed).
3. In Netlify: **Add new site → Import an existing project → GitHub → select Eager**, confirm the publish directory and functions directory are detected correctly from `netlify.toml`.
4. Trigger the deploy and get the live URL.
5. Full smoke test on the live URL: complete the entire flow, including opening a share link in a separate device/browser.
6. Fix any deploy-specific issues immediately (relative paths, env variable not picked up, function routing).
7. Save the live URL in `README.md` and your own notes.

**📂 Files/Folders:** `netlify.toml` (verify production config), `README.md` (updated with live URL).

**🔗 Tools/Services:** Netlify (hosting + functions) — connect GitHub repo, set production environment variable.

**🧪 Testing:** Full flow smoke test on the live deployed URL; share link tested across two devices/browsers; confirm no secrets visible in DevTools/Network tab.

**🐞 Common Issues:** Blank page after deploy → usually a relative path issue, check Network tab for 404s. Function 500 errors → missing environment variable on the host dashboard. Share links 404 on refresh → check redirect/rewrite rules.

**✅ End-of-Day Checklist:** App live at a public URL; full flow works end-to-end on the live site; no exposed secrets; `README.md` updated.

**📸 Screenshots:** Live URL in browser address bar with app loaded; a completed flow on the live site.

**➡️ Handoff to Day 10:** Eager is live. Day 10 is final polish, screenshot/demo capture, and the LinkedIn/ABTalks launch post — no structural changes.

---

## DAY 10: Final Polish, Launch & Capstone Wrap-Up

**🎯 Objective:** Put the final layer of polish on the live product and launch it publicly — Demo Day.

**📖 What You'll Learn:** Doing a final QA pass with fresh eyes; writing a launch post that communicates real proof-of-work; capturing demo material.

**🛠 Features to Build:** None — v1.0 feature set is frozen; today is finishing, not building.

**📝 Step-by-Step Plan:**
1. Final full run-through of the live app as a first-time user, noting rough edges (copy, spacing, awkward transitions).
2. Fix only small, safe polish items — no structural changes this late.
3. Capture clean screenshots of each core screen on the live site (input form, matched idea list, expanded detail, favorites view) for the pitch deck and LinkedIn post.
4. Update `README.md` to be genuinely presentable: what Eager is, the live link, the problem it solves, tech approach summary, screenshots.
5. Write the ABTalks/LinkedIn launch post: lead with the problem, show the live link prominently, mention the curated-bank-plus-AI-personalization approach, be honest and specific about v1.0's scope.
6. Final check against the PRD's Day 10 success definition: live deployed link ✓; full flow works end-to-end ✓; ready to post ✓.
7. Post it.

**📂 Files/Folders:** `README.md` (final version); minor fixes from today's QA pass only.

**🔗 Tools/Services:** LinkedIn (ABTalks launch post).

**🧪 Testing:** One final full end-to-end run-through on the live URL.

**🐞 Common Issues:** Found a late, non-breaking bug → note it in `README.md` under "Known Limitations / Next Up" rather than risking a last-minute fix.

**✅ End-of-Day Checklist:** Final polish complete, no known core-flow bugs; `README.md` finished with live link and screenshots; launch post published; live link confirmed working at time of posting.

**📸 Screenshots:** Final screenshots of all 4 core screens on the live site; screenshot of the published LinkedIn/ABTalks post.

**➡️ Capstone Complete:** v1.0 is shipped. Future sessions pick up from the PRD's Future Scope section (accounts, community features, admin panel, native mobile, multi-language) for a v2 planning cycle.
