# Eager — Testing & Release Readiness

Day 8 QA pass. Reviewed as a senior QA engineer / security reviewer / performance engineer would, before a public launch.

## End-to-End Flow Checklist

- [x] App loads with no console errors
- [x] Form validation: empty submission shows all 3 error messages (skill, stack, time) independently
- [x] Time bounds enforced (1-80 hrs/week, 1-52 weeks) — both client-side (HTML attributes) and **server-side** (Day 8 fix)
- [x] Valid submission → matched idea list renders correctly
- [x] Zero-match fallback triggers correctly and shows a note
- [x] Clicking an idea → loading state → real personalized detail screen
- [x] Rapid double-click on an idea card → only one request fires (Day 8 fix)
- [x] Star an idea from the list (before personalizing) → placeholder saved
- [x] Opening that placeholder favorite → auto-generates and caches the real brief (Day 7 fix, re-verified)
- [x] Star/unstar from the detail screen → persists correctly
- [x] Favorites view: empty state when nothing saved, populated view otherwise
- [x] Share button → copies link, toast confirms, link opens correctly in a fresh incognito session
- [x] Footer visible on every screen, including after screen transitions

## Security Review

| Issue Found | Severity | Fix |
|---|---|---|
| Public `/api/personalize` endpoint trusted client-submitted idea content (title, hook, description) with no server-side verification — usable as an open text-generation proxy against our free Gemini quota, bypassing the actual idea bank entirely | **High** | Server now looks up the real idea by ID from its own copy of `data/ideas.js`; all other client-submitted idea fields are ignored |
| `hoursPerWeek`/`totalWeeks` only bounded by HTML `min`/`max` (client-side only — meaningless to anyone calling the endpoint directly) | Medium | Server-side bounds added (1-80 hrs, 1-52 weeks) |
| `selectedStacks` accepted arbitrary strings, not validated against the real stack list | Low-Medium | Filtered against `data/stacks.js`; request rejected if none remain valid |
| AI-generated content inserted into the page via `innerHTML` with no escaping | Medium (XSS risk) | All dynamic text — including AI output — now passed through an `escapeHTML()` helper before insertion |
| `.env` handling, API key exposure | N/A — already correct | Confirmed key only ever lives in `.env` (git-ignored) and Netlify's environment variables dashboard; never in client-side code |

## Reliability & Edge Cases

| Case | Behavior |
|---|---|
| Network fully offline | Friendly "You appear to be offline" message instead of a raw fetch error |
| Gemini API returns an error | Friendly retry message, not a raw error dump |
| Gemini API times out (Netlify's ~10s function limit) | Friendly "That took too long" message with a working retry |
| AI response is malformed / not valid JSON | Same friendly upstream-error message, doesn't crash the UI |
| AI response missing some fields (e.g. no `stretch` goals) | Each section renders its own graceful empty state instead of showing "undefined" |
| Double-click / rapid repeated clicks on idea cards | Guarded — only one request in flight at a time |
| Corrupted/invalid `localStorage` data | `favorites.js` wraps all reads in try/catch, defaults to an empty array rather than crashing |

## Accessibility

- All icon-only buttons (star, share, copy) have `aria-label`s
- Toggle buttons (star) use `aria-pressed` to reflect state
- Error messages use `role="alert"`; loading/status text uses `role="status"`
- Visible focus rings added on all interactive elements for keyboard navigation
- Form uses real `<label>`/`<fieldset>`/`<legend>` elements throughout (not just placeholder text)

## Performance

- Google Fonts loaded with `display=swap` (no invisible-text flash) and preconnected to both `fonts.googleapis.com` and `fonts.gstatic.com`
- No unnecessary re-renders — each screen only re-renders on actual navigation, not on every state change
- Idea bank (40 entries) and matching logic are small enough that filtering is effectively instant, no debouncing needed

## Known Limitations (acceptable for v1.0, not bugs)

- Matching does not factor `hoursPerWeek` into the filter beyond collecting it (only `totalWeeks` vs. `estimatedWeeks` is compared) — an intentional simplification locked in on Day 5's blueprint section, not an oversight
- Shared links that aren't already favorited re-personalize using default inputs based on the idea's own difficulty/stack (the original sharer's specific inputs aren't part of the link) — acceptable per v1.0 scope
