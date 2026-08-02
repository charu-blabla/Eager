# Eager — Environment Configuration

## Environment Variables

| Variable | Where it's used | Where it's set | Committed to Git? |
|---|---|---|---|
| `GEMINI_API_KEY` | `netlify/functions/personalize.js` — authorizes calls to the Gemini API | Locally: `.env` file. In production: Netlify dashboard → Site settings → Environment variables (set on Day 9) | **Never** — excluded via `.gitignore` |

### `.env` vs `.env.example`

- **`.env`** — your real local file, holds your actual key, git-ignored, exists only on your machine
- **`.env.example`** — a committed template with a placeholder value, shows anyone (including a fresh AI session) what variables the project needs without exposing anything real

## Tools & Versions

| Tool | Version (as configured Day 3) | Purpose |
|---|---|---|
| Node.js | 24.x LTS | JavaScript runtime for local tooling (not for the app itself, which is plain browser JS) |
| npm | Bundled with Node.js | Package manager, used once to install the Netlify CLI |
| Netlify CLI | Latest via `npm install -g netlify-cli` | Runs `netlify dev` — static site + serverless function locally |
| Git | System install | Version control |

## Accounts

| Service | Purpose | Plan |
|---|---|---|
| GitHub | Source control, triggers Netlify deploys | Free |
| Netlify | Hosting + serverless functions | Free tier |
| Google AI Studio | API key issuance for the personalization layer (switched from Anthropic Day 6) | Free tier, no card |

## PowerShell Configuration (Windows-specific)

Execution policy set once to allow local scripts (like `npm`) to run:
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
This does **not** disable script security generally — it still blocks unsigned scripts downloaded from the internet, only allowing locally-created ones to execute.

## Security Notes

- The Gemini API key is never called from the browser — only from the Netlify Function (`netlify/functions/personalize.js`), per the Day 2 architecture decision (provider switched from Anthropic to Gemini on Day 6 due to a $0 credit balance)
- If a key is ever accidentally exposed (e.g., pasted somewhere outside `.env`), revoke it immediately at console.anthropic.com → API Keys, and generate a new one
- `.gitignore` covers `.env` and all `.env.*` variants, with an explicit exception for `.env.example`
