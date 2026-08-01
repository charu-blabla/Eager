# Eager — Product Requirements Document

**v1.0** | AB Talks 60-Day Claude AI Challenge — 10-Day Capstone
**Author:** Charu Malhotra | **Date:** Day 1 of Capstone

## 1. Overview

Eager is a web-based project idea generator built for students and self-taught developers who know they want to build something, but don't know what. Users specify their skill level, tech stack, and available time; Eager matches them against a curated bank of 40 hand-picked project ideas and expands the chosen idea into a personalized brief — complete with features, folder structure, a learning roadmap, and a resume-ready description.

Eager is not a raw AI idea generator. It combines a curated, quality-controlled idea bank with an AI personalization layer, so output is consistently high-quality while still feeling tailored to each user.

## 2. Problem Statement

Students learning to code — particularly those building a portfolio — routinely get stuck at the same point: deciding what to build next. This shows up as a mix of related frustrations:

- Time wasted deciding what to build instead of building
- Ideas that are mismatched to current skill level — too ambitious (leads to abandonment) or too easy (no growth, weak portfolio signal)
- Finished projects that don't read as portfolio- or resume-ready
- Uncertainty about how to structure a project once an idea is chosen (folders, roadmap, scope)

Existing options — asking ChatGPT/Claude directly, browsing GitHub "awesome project ideas" lists — are either too generic (raw AI output varies wildly in quality) or too static (lists aren't matched to the user's actual skill level, stack, or time budget).

## 3. Target Users

### Primary Persona: The Portfolio-Building Student

- Early-to-mid stage CS/self-taught student (like Charu herself)
- Comfortable with at least one language/stack, actively building a portfolio for internships/jobs
- Has limited, defined time windows (a weekend, a few weeks) and wants to spend them building, not deciding
- Values proof-of-work: live projects, clean GitHub repos, resume-ready descriptions

## 4. Goals & Success Metrics

### Product Goals

- Reduce the time between "I want to build something" and "I know exactly what, and I've started"
- Ensure every suggested idea matches the user's real skill level — not too hard, not too easy
- Make every output feel personalized, not generic, even though it's bank-based

### Day 10 Definition of Success

- **Eager is deployed at a live, public URL**
- The full flow works end-to-end: inputs → matched ideas → expanded personalized brief → favorite → revisit
- Charu can confidently post the live link on LinkedIn/ABTalks as proof-of-work

## 5. Scope

### 5.1 In Scope for v1.0

- Input flow: Skill Level (Beginner / Intermediate / Advanced), Tech Stack (multi-select checkboxes), Time Available (hours/week + total weeks)
- Curated idea bank: 40 ideas total — 10 each across Web, Mobile, AI/ML, and DSA
- Matching logic: filters the bank against user inputs, returns all matching ideas as a browsable list
- Idea expansion: clicking an idea generates an AI-personalized brief — tailored features, folder structure, learning roadmap, resume-ready description
- Favorites: star/unstar ideas, revisit them later (browser-based storage, no login)
- Share: generate a shareable link/button for any expanded idea
- Responsive, polished theme ("Precision Workshop" — Precision Violet on a light surface palette, switched from dark-first to light-first on Day 5)
- Deployed to a free, public hosting URL

### 5.2 Explicitly Out of Scope for v1.0 (Future / v2)

- Full user accounts / login / cross-device sync
- Payments or monetization
- Multi-language support
- Native mobile app (v1 is web-based/responsive only)
- Community features beyond a simple share link — no comments, likes, or public feeds
- Admin panel for editing the idea bank (bank is edited directly in code/data files for v1)

## 6. Core User Flow

1. User lands on Eager and sees the input form: Skill Level, Tech Stack, Time Available
2. User submits inputs
3. Eager filters the 40-idea bank and displays all matching ideas as a list (title + one-line hook + domain tag)
4. User clicks any idea to expand it
5. Eager calls the AI personalization layer, which tailors: feature list, folder structure, learning roadmap, and resume description to the user's specific inputs
6. User can star the idea to favorite it, or click Share to get a link
7. Favorited ideas are accessible from a "My Favorites" view, persisted in that browser

## 7. Feature Requirements

### 7.1 Input Collection

- **FR-1:** Skill level selector with exactly 3 options: Beginner, Intermediate, Advanced
- **FR-2:** Tech stack multi-select checkboxes covering common stacks across all 4 domains
- **FR-3:** Time availability captured as hours/week (numeric) + total weeks (numeric)
- **FR-4:** Form validates that at least one tech stack is selected before submission

### 7.2 Idea Matching & Browsing

- **FR-5:** On submit, system filters the 40-idea bank by skill level, selected stack(s), and estimated time-to-complete vs. available time
- **FR-6:** All matching ideas are displayed as a scrollable list, each showing: title, domain tag, one-line hook, estimated time
- **FR-7:** If zero ideas match, show the closest matches with a note on which filter was loosened

### 7.3 Idea Expansion (AI Personalization)

- **FR-8:** Clicking an idea sends the idea's base content + user's inputs to the AI layer
- **FR-9:** AI-personalized output includes: a tailored feature list (must-have vs stretch), a suggested folder/file structure, a week-by-week learning roadmap sized to the user's time budget, and a one-line resume-ready project description
- **FR-10:** A loading state is shown while the AI response streams/generates

### 7.4 Favorites

- **FR-11:** Star icon toggles favorite status on any idea (base or expanded)
- **FR-12:** Favorited ideas persist in browser storage and are viewable in a dedicated "Favorites" section without needing to re-run the match

### 7.5 Share

- **FR-13:** Share button generates a link that reopens the same idea in its expanded, personalized state

## 8. Non-Functional Requirements

- No login required for any v1.0 functionality
- No paid services or tools — hosting, storage, and APIs must use free tiers
- Works on both desktop and mobile browser widths
- AI personalization response should return within a few seconds under normal conditions, with a visible loading state
- Idea bank content is version-controlled in code/data files, not a database, for v1

## 9. Content Requirements — The Idea Bank

40 curated ideas total, evenly split:

| Domain | # Ideas | Notes |
|---|---|---|
| Web Development | 10 | HTML/CSS/JS, React and similar stacks |
| Mobile Development | 10 | Cross-platform and native-adjacent concepts |
| AI / Machine Learning | 10 | Beginner-to-advanced AI-assisted or ML projects |
| DSA / CS Fundamentals | 10 | Algorithmic and computer-science-grounded projects |

Each base idea in the bank includes: title, domain tag, one-line hook, difficulty level, estimated time range, and a short base description that the AI personalization layer expands on.

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| AI personalization output is inconsistent or low quality | Curated bank as the reliable base; AI only expands/tailors, never invents from scratch |
| Idea bank feels thin at only 40 ideas | Depth over breadth — AI personalization makes each idea feel unique per user |
| Scope creep from favorites/accounts | Browser-based storage only for v1; accounts explicitly deferred to v2 |
| Running out of time before Day 10 | Blueprint sequences core idea-matching first, polish last, per prioritization |

## 11. Future Scope (v2 and beyond)

- Full user accounts with cross-device sync
- Community features: public sharing feed, comments, likes
- Admin panel for non-technical idea bank editing
- Native mobile app
- Multi-language support
- Expanded idea bank size and additional domains

## 12. Timeline Reference

This PRD is paired with a day-by-day Implementation Blueprint (Days 2–10) that sequences design, setup, build, test, and deployment. Refer to that document as the single source of truth for daily execution.
