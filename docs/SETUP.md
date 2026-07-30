# Eager — Setup Guide

How to get Eager running on a fresh machine, start to finish. Written from Day 3's actual setup process.

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | 24.x LTS | Runs the Netlify CLI and lets the serverless function be tested locally |
| npm | Bundled with Node.js | Installs the Netlify CLI |
| Netlify CLI | Latest | Runs the static site + serverless function together locally (`netlify dev`), simulating production |
| Git | Any recent version | Version control, already required from Day 1 |
| A Netlify account | Free tier | Hosting target (connected Day 9) |
| An Anthropic API key | Free tier ($5 trial credit, no card required) | Powers the AI personalization layer |

## 1. Install Node.js

1. Download the **24.x LTS** installer from [nodejs.org](https://nodejs.org)
2. Run it with default options (skip the optional Chocolatey/build-tools checkbox — not needed for this project)
3. **Fully restart VS Code** (not just the terminal) after installing — Windows needs the restart to pick up the new PATH entry
4. Verify: `node --version` and `npm --version` should both print version numbers

### Windows-specific fix (if `npm` gives a script-execution error)

If you see `"running scripts is disabled on this system"`, run this once:
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Confirm it took effect with `Get-ExecutionPolicy -Scope CurrentUser` (should print `RemoteSigned`).

## 2. Install the Netlify CLI

```
npm install -g netlify-cli
```
Verify: `netlify --version`

## 3. Get an Anthropic API Key

1. Sign up / log in at [console.anthropic.com](https://console.anthropic.com)
2. Complete phone verification to claim the free $5 trial credit (no card required for this)
3. Go to **API Keys → Create Key**, name it, set an expiration, click **Add**
4. Copy the key immediately — it's shown once

> **Security note:** never paste an API key into chat apps, screenshots you'll share, or anywhere except a local `.env` file or the Netlify dashboard's environment variables screen.

## 4. Clone and Configure the Project

```
git clone https://github.com/charu-blabla/Eager.git
cd Eager
```

Create your local `.env` file (copy the format from `.env.example`, which is committed and safe — it holds no real key):
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

Confirm `.env` is protected — run `cat .gitignore` and confirm `.env` appears in the dotenv exclusion block.

## 5. Run It Locally

```
netlify dev
```

First run may prompt a browser login/authorization — approve it. If asked to link the directory to a Netlify site, choose **No** (not needed until Day 9).

Once you see `Local dev server ready: http://localhost:8888`, open that URL — you should see the Eager "Hello World" page. Also confirmed: a `GET` request to `http://localhost:8888/api/personalize` correctly returns a `405 method_not_allowed` (the function is live and validating request methods correctly — it only accepts `POST`).

## Common Issues

| Problem | Fix |
|---|---|
| `node`/`npm` not recognized | Fully restart VS Code (or reboot) after installing Node.js |
| npm script execution disabled | Run the `Set-ExecutionPolicy` command above |
| `.env` accidentally staged in git | Check `.gitignore` includes `.env` and `.env.*`; if already staged, run `git rm --cached .env` |
| `netlify dev` fails to find the function | Confirm `netlify.toml` has `functions = "netlify/functions"` and the file is at that exact path |
