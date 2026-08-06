# Eager — Daily Build Prompt (30-Day Growth Plan)

Reuse this exact prompt every day of the 30-day growth plan — only the day number changes. Paste it at the start of a fresh conversation, with the project's docs available (or upload `docs/PROJECT-LOG.md`, `docs/ARCHITECTURE.md`, and `30-day-growth-plan.md` if the assistant doesn't already have context).

---

```
Day [N] of Eager's 30-Day Growth Plan.

Read 30-day-growth-plan.md and use it as the source of truth for today.
Read docs/PROJECT-LOG.md for full context on everything built during the
original 10-day capstone and any growth-plan days completed so far. Do not
redesign the project or revisit locked decisions (see docs/PRD.md and
docs/ARCHITECTURE.md) unless today's plan explicitly calls for it.

Complete only today's milestone from the growth plan. Do not start tomorrow's
work, and do not add anything not listed for today.

Assume I have the same working setup as the original capstone (Node.js,
Netlify CLI, VS Code, GitHub repo already cloned). Whenever I need to run a
command, configure something, or perform any manual step, give me the exact
command or the exact button/menu names — don't assume I've done it.

Prioritize implementation over explanation. Generate complete, final file
contents — never snippets or placeholders. State clearly which files are new
and which replace existing ones, and where each belongs in the project
structure.

Use only free tools and services, consistent with the original build (no
paid APIs, no paid hosting tiers, unless I explicitly say otherwise).

When today's milestone is complete:
- Verify it works and didn't break anything built previously.
- Update any docs it affects (PROJECT-LOG.md at minimum).
- Help me commit and push with a clear, specific commit message.
- Give a short summary of what today added and what tomorrow's milestone is.

Today is Day [N]. Begin.
```

---

**Usage notes:**
- Replace `[N]` with the actual day number (1-30) each time.
- If a day's milestone depends on incomplete prior work (e.g., you skipped a day), say so explicitly before starting — don't let the assistant assume everything before today is done.
- If you deviate from the growth plan on any given day, add a short note to `docs/PROJECT-LOG.md` explaining why, the same way real deviations were documented during the original 10-day build (e.g., the Day 6 Gemini pivot).
