# Eager — Challenge Retrospective

A real account of Days 1-10, written by the AI pair programmer who was there for all of it. No generic milestones — this is what actually happened.

## The Timeline

**Day 1 — Discovery.** Started with genuinely nothing: no idea, just a slot on the calendar. Got there through a real interview, not a menu of options — skills, interests, the actual frustration behind the idea ("mix of all" four problems, ranked down to one priority order: right-difficulty matching first, scaffolding second, polish third, speed last). Landed on **Eager**: a hybrid curated-bank-plus-AI-personalization tool, deliberately *not* a raw AI generator, because a bank you can quality-control beats an AI you can't. Scope was cut hard from the start — no accounts, no payments, no native mobile, no community beyond a share link — before a single line of code existed.

**Day 2 — Architecture.** Tech stack chosen deliberately small: vanilla JS, no framework, no database, one serverless function. The most consequential decision of the whole build happened here almost as an aside: moving the AI-proxy serverless function from a Day 9 deployment afterthought to a Day 3 foundation piece. That one call quietly de-risked everything that came later.

**Day 3 — Foundation.** Real beginner friction, handled one blocker at a time: Node PATH issues, PowerShell execution policy, and a genuinely serious moment — an Anthropic API key accidentally exposed via a screenshot sent through WhatsApp during setup. Caught within minutes, revoked, regenerated. Small mistake, real lesson, and it stuck: API keys go in exactly one place from that point forward.

**Day 4 — Content.** Forty ideas, ten per domain, difficulty-balanced 3-4-3 in every category, verified programmatically (not just eyeballed) before moving on. Pure content day, zero architecture decisions revisited.

**Day 5 — First real UI, and a scope-protection test.** Built the matching engine and the first working screens. Then, mid-build, a fully-designed high-fidelity mockup arrived from Google Stitch — genuinely beautiful, and genuinely full of scope creep (viability scores, a multi-page nav app, account-implying profile UI). The response wasn't "yes" or "no" — it was separating what was pure styling (safe) from what was new product surface (declined), then approving exactly one real change: switching from the originally-locked dark theme to a light theme. Scope stayed intact; the app got measurably better-looking.

**Day 6 — The debugging gauntlet.** Wire up AI personalization — except the Anthropic account had $0 usable credit with no working free path. Pivoted to Google Gemini's free tier live, mid-session, and then hit six real, sequential failures: wrong auth header format for a brand-new key type, a deprecated model, a model with zero free quota, truncated JSON from a token limit, a timeout from a slower "thinking" model, and finally landing on the right model (`gemini-3.5-flash-lite`) with the right settings. None of these were logic bugs — every one was the external API surface shifting in real time. Deployed to production the same day, three days ahead of the original plan.

**Day 7 — Completing the feature set.** Favorites and Share, plus a real bug caught by actually using the product: starring an idea straight from the list (before it had ever been personalized) saved an empty placeholder. Fixed by having Favorites auto-generate and cache the real brief the first time an incomplete favorite gets opened — the kind of gap that only surfaces when you click through your own app like a genuine first-time user.

**Day 8 — Security.** No new features — a real senior-level review instead. Found and fixed a legitimate **High-severity issue**: the public personalization endpoint trusted whatever idea content the client sent, meaning it could've been used as an open, unrestricted AI text-generation proxy, completely bypassing the actual 40-idea product. Fixed by having the server look up ideas by ID from its own trusted data instead of trusting the client. Also closed an XSS gap and a double-click race condition.

**Day 9 — Release readiness.** SEO and social metadata (verified live via LinkedIn's actual Post Inspector, not just assumed correct), a rewritten README, a branded 404 page, and repo cleanup — the parts of a launch that don't show up in a demo but are the first thing a recruiter or real user actually sees.

**Day 10 — Ship it.** A visual redesign after direct, blunt feedback ("looks like Google Forms") — taken seriously and acted on without ego, because the feedback was correct. Final review, portfolio materials, and graduation.

## Major Technical Decisions & Pivots

1. **Curated bank + AI, not raw AI generation** (Day 1) — the single decision that shaped everything downstream
2. **AI-proxy moved from Day 9 to Day 3** (Day 2) — turned a deployment-day risk into a foundation-day non-event
3. **Anthropic → Gemini pivot** (Day 6) — done live, under real constraint (zero credit), not planned in advance
4. **Light theme over dark theme** (Day 5) — the one scope change approved out of an entire high-fidelity mockup, chosen deliberately
5. **Server-side idea validation** (Day 8) — closed a real security gap discovered through actual review, not assumed away

## Skills Demonstrated

Product discovery and scope negotiation · system architecture and technical decision-making · full-stack implementation (vanilla JS, serverless functions, REST API integration) · live debugging under real API/provider failure · security review and remediation (server-side validation, XSS defense) · UI/UX design critique and response · release engineering (SEO, metadata, deployment configuration) · technical writing (a full documentation set maintained accurately across 10 days, not written once and abandoned)

## Lessons Learned

- **The scariest bugs don't look like bugs.** The Day 8 security issue produced a perfectly normal-looking, fully-functional app. Nothing about using Eager suggested anything was wrong. That's exactly why a dedicated review pass — not just "does it work" — matters.
- **Feedback you don't want to hear is still worth acting on.** "It looks like Google Forms" was blunt and correct, and the response was a real redesign, not a defensive explanation of why it was fine already.
- **Scope discipline is a skill, not a personality trait.** Every day from Day 1 onward involved at least one moment of "this would be cool, but no" — and writing those decisions down (in the PRD, in the blueprint, in this log) is what made them stick instead of eroding one "just this once" at a time.
- **Production API integration is iterative by nature.** Six real failures in one sitting on Day 6 wasn't a sign of a bad plan — it was what actually happens when you integrate against a live, changing external system, and the only way through is reading the actual error and fixing the actual cause, one at a time.

## Final Summary

Eager shipped as a genuinely complete, secure, documented, production-deployed v1.0.0 — built solo, in 10 days, with real setbacks handled in the open rather than smoothed over. It started as an interview about frustration with decision paralysis, and ended as a tool that solves exactly that problem for someone else.

## A Note From Your AI Pair Programmer

Ten days ago you didn't have an idea. Today you have a live product with a security review, a real incident report, a documented pivot under pressure, and a redesign you asked for because you knew it wasn't good enough yet and said so plainly. That instinct — to keep pushing past "it works" toward "it's actually good" — showed up constantly, from declining the viability-score feature creep on Day 5 to catching the empty-favorites bug on Day 7 to calling out the flat design on Day 10. That's not a beginner instinct. That's a product-builder instinct, and it was yours the whole way through, not mine. I was just the pair. Well built.
