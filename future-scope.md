# Eager — Future Scope

How this specific project could realistically evolve, grounded in what v1.0.0 actually is and what the PRD already deferred.

## 3 Months: Depth Without Breaking Scope Discipline

The instinct after a launch is always to add more. Eager's v1.0.0 discipline (declining viability scores, declining a nav-app redesign, declining expanded skill categories — all real Day 3/5 decisions) should carry forward.

- **Grow the idea bank from 40 to ~120** (30 per domain), maintaining the same difficulty-balance rules already encoded in the Day 4 content process — not a rewrite, just more of the same disciplined content work
- **Lightweight accounts** (email magic-link, no passwords) specifically to enable cross-device favorites — the single most-requested feature a v1.0 user would ask for, and the one already explicitly logged as v2 scope in the PRD
- **Resolve the matching engine's known limitation**: `hoursPerWeek` is currently collected but not used in filtering (only `totalWeeks` vs `estimatedWeeks` is compared) — add a real capacity calculation once there's usage data to know if it's worth the complexity
- **Share links carry real context**: currently a shared link re-personalizes using the idea's own defaults, not the original sharer's actual inputs — encode the sharer's inputs into the URL itself

## 6 Months: From Tool to Habit

- **Progress tracking on saved ideas** (not a "viability score" — actual milestone checkboxes tied to the AI-generated roadmap, so Favorites becomes a working project tracker, not just a bookmark list)
- **GitHub integration**: one-click "create this repo" using the generated folder structure, authenticated via GitHub OAuth
- **Admin-editable idea bank** — the PRD explicitly deferred this ("bank is edited directly in code for v1"); once the bank is large enough that direct code edits become painful, a lightweight admin panel (still no database — could stay file-based via a Git-backed CMS) becomes worth the cost
- **Native mobile wrapper** (Capacitor/PWA install) — v1.0.0 is already fully responsive, so this is packaging, not a rebuild

## 12 Months: Community Layer

- **Public sharing feed** — the PRD's most consistently deferred feature; only worth building once there's a real user base generating real personalized briefs worth sharing publicly
- **Multi-language support** for both the UI and AI-generated content — natural expansion once there's demand data showing which languages actually matter
- **Instructor/bootcamp mode**: a cohort of students working through the same set of ideas, with aggregate (anonymized) insight into which ideas and difficulty levels actually get finished — the first genuinely new product surface beyond what the original PRD scoped

## What Stays Constant

No matter which of the above gets built, three v1.0.0 decisions should hold: no ads, no paid tiers introduced without explicit reconsideration of the "no paid tools" principle that shaped this whole build, and no feature that requires accounts to even *try* the core matching-and-personalization loop — that zero-friction first experience is Eager's actual differentiator, and it's worth protecting.
