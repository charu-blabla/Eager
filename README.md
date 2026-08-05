# Eager

**Know what to build, in one click.**

An AI-personalized project idea generator for students building their portfolio. Pick your skill level, tech stack, and time available — Eager matches you against a curated bank of 40 project ideas and generates a full personalized brief: tailored features, folder structure, learning roadmap, and a resume-ready description.

🔗 **Live app:** [eager-capstone.netlify.app](https://eager-capstone.netlify.app)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Built with Claude](https://img.shields.io/badge/built%20with-Claude-7C3AED)](https://claude.com)

---

## The Problem

Students learning to code routinely get stuck at the same point: deciding what to build next. Ideas are either too ambitious (get abandoned) or too easy (weak portfolio signal), and generic "awesome project ideas" lists aren't matched to anyone's actual skill level, stack, or time budget.

## The Solution

Eager isn't a raw AI idea generator, and it isn't a static list either — it's a hybrid:

- **A curated, quality-controlled bank of 40 ideas** (10 each across Web, Mobile, AI/ML, and DSA), hand-picked and difficulty-balanced
- **An AI personalization layer** on top, which tailors every matched idea's features, folder structure, learning roadmap, and resume description to *your* specific skill level, stack, and available time

That combination means the output is always reliable and specific — never generic, never wildly inconsistent.

## Features

- 🎯 **Smart matching** — filters the idea bank by skill level, tech stack, and time budget, with a graceful fallback if nothing matches exactly
- 🤖 **AI personalization** — every idea expands into a brief built for you, not a template
- 📁 **Folder structure** — a ready-to-use scaffold sized to your chosen stack
- 🗺️ **Learning roadmap** — a week-by-week plan that fits your actual available time
- 📝 **Resume description** — a one-line, resume-ready summary generated with the idea
- ⭐ **Favorites** — star any idea to revisit it later (saved in your browser, no account needed)
- 🔗 **Share** — copy a link to any personalized idea and send it to someone else

## Screenshots

> _Add screenshots here — see `docs/` for reference; drop image files into an `assets/` folder and link them below._
>
> ```md
> ![Skill selection screen](assets/screenshot-form.png)
> ![Matched ideas list](assets/screenshot-list.png)
> ![Personalized project brief](assets/screenshot-detail.png)
> ![Saved favorites](assets/screenshot-favorites.png)
> ```

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Vanilla HTML/CSS/JavaScript (ES modules, no build step, no framework) |
| Backend | One serverless function (Netlify Functions, ES modules) |
| AI | Google Gemini API (free tier) |
| Data | Static JS data file (idea bank) + browser `localStorage` (favorites) — no database |
| Hosting | Netlify (static hosting + serverless functions, free tier) |
| Fonts | Hanken Grotesk, Manrope, IBM Plex Mono (Google Fonts) |

No paid services anywhere in the stack — see [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) for details.

## Running Locally

Full step-by-step setup (Node.js, Netlify CLI, getting a free Gemini API key, environment variables) is documented in [`docs/SETUP.md`](docs/SETUP.md). Quick version:

```bash
git clone https://github.com/charu-blabla/Eager.git
cd Eager
npm install -g netlify-cli
# create a .env file with GEMINI_API_KEY=your-key-here (see .env.example)
netlify dev
```

Then open `http://localhost:8888`.

## Project Documentation

This project was built as a 10-day capstone with full documentation at every stage — useful if you want to see the actual design/planning process, not just the final code:

- [`docs/PRD.md`](docs/PRD.md) — Product Requirements Document
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture, with diagrams
- [`docs/SCHEMA.md`](docs/SCHEMA.md) — Data schema
- [`docs/API.md`](docs/API.md) — API contract for the one backend endpoint
- [`docs/IMPLEMENTATION-BLUEPRINT.md`](docs/IMPLEMENTATION-BLUEPRINT.md) — Day-by-day build plan
- [`docs/TESTING.md`](docs/TESTING.md) — QA and security review
- [`docs/PROJECT-LOG.md`](docs/PROJECT-LOG.md) — Daily build log, including real bugs found and fixed

## Known Limitations (v1.0)

- No user accounts — favorites are stored per-browser, not synced across devices
- No payments, no multi-language support, no native mobile app
- Community features are limited to a simple share link (no comments/likes/public feed)

See [`docs/PRD.md`](docs/PRD.md#future-scope-v2-and-beyond) for the full v2 roadmap.

## License

MIT — see [`LICENSE`](./LICENSE).

---

Built with Claude as part of the [AB Talks 60-Day Claude AI Challenge](https://github.com/charu-blabla/Eager).
