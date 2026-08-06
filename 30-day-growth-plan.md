# Eager — 30-Day Growth Plan

A realistic post-capstone roadmap, one achievable milestone per day, building toward the "3 months" tier of `future-scope.md`. Same stack (vanilla JS, Netlify Functions, Gemini API), same scope discipline that shaped v1.0.0.

## Week 1: Expand the Idea Bank (Days 1-7)
- **Day 1:** Audit v1.0.0's 40 ideas for gaps — which sub-topics within Web/Mobile/AI/DSA are underrepresented? Write a target list for 20 new ideas.
- **Day 2:** Write 10 new Web/Mobile ideas following the exact Day 4 schema and difficulty-spread rules.
- **Day 3:** Write 10 new AI/DSA ideas the same way.
- **Day 4:** Run the Day 4 sanity-check script against the expanded bank (unique ids, difficulty spread, valid stack tags) — fix anything it flags.
- **Day 5:** Manually test matching against the larger bank for at least 10 different input combinations — confirm nothing feels repetitive or mismatched.
- **Day 6:** Update `SCHEMA.md` and `PROJECT-STRUCTURE.md` to reflect the new bank size.
- **Day 7:** Deploy, smoke-test, commit — "60-idea bank" as a real, shippable increment.

## Week 2: Fix the Known Limitation + Share Links (Days 8-14)
- **Day 8:** Design the `hoursPerWeek` capacity calculation (documented as a known limitation in `TESTING.md`) — decide the actual formula.
- **Day 9:** Implement it in `matching.js`, write test cases for it like Day 5's original 3-scenario test.
- **Day 10:** Update `API.md`/`SCHEMA.md` to document the new matching behavior.
- **Day 11:** Design share links that encode the sharer's actual inputs (not just idea ID) — decide the URL parameter shape.
- **Day 12:** Implement it in `main.js`/`favorites.js`, test both fresh and already-favorited share scenarios.
- **Day 13:** Full regression pass — confirm Days 1-10's original features (favorites, matching, personalization) still work with both changes.
- **Day 14:** Deploy, update `PROJECT-LOG.md` with this week's entries, commit.

## Week 3: Lightweight Accounts (Days 15-21)
- **Day 15:** Research free-tier auth options (magic-link email, no passwords) — Netlify Identity, Supabase Auth, or similar; pick one that stays within "no paid tools."
- **Day 16:** Design the data model change: favorites move from pure `localStorage` to a synced store, but keep local-first behavior so the app still works offline/without an account.
- **Day 17:** Implement auth signup/login flow — new screen, following the existing 4-screen design language, not a redesign.
- **Day 18:** Migrate favorites read/write logic to check for an account and sync when present, fall back to `localStorage` when not.
- **Day 19:** Test both paths thoroughly: logged-out (original v1.0.0 behavior) and logged-in (new sync behavior) — neither should break the other.
- **Day 20:** Update `ARCHITECTURE.md`, `SCHEMA.md`, `API.md` for the new auth layer and data flow.
- **Day 21:** Deploy, full end-to-end test on production, commit.

## Week 4: Polish, Metrics, and a Real v1.1.0 (Days 22-30)
- **Day 22:** Add basic, privacy-respecting usage awareness (e.g., which domains get matched most often) — no third-party trackers, simplest possible approach.
- **Day 23:** Revisit the Day 10 redesign with 3 weeks of distance — what still looks unfinished now that the accounts feature exists?
- **Day 24:** Mobile-specific QA pass — the app has been responsive since Day 5/7, but dedicate a real session to it now that there's more surface area (auth screens).
- **Day 25:** Accessibility re-audit — Day 8 covered ARIA labels and focus rings; re-check with the new auth screens included.
- **Day 26:** Performance pass — confirm the larger idea bank and new auth calls haven't introduced any real slowdown.
- **Day 27:** Write a "what's new in v1.1.0" update to the README and a short LinkedIn post continuing the build-in-public thread from the original 10 days.
- **Day 28:** Full security review of the new auth/sync surface, matching the rigor of the original Day 8 review — this is new attack surface and deserves the same scrutiny.
- **Day 29:** Tag and release `v1.1.0` on GitHub, following the same process used for `v1.0.0`.
- **Day 30:** Reflect: update `challenge-retrospective.md` with a short "30 days later" addendum — what actually shipped vs. what this plan predicted, and why.
