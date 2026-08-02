# Eager — System Architecture

Status: Locked Day 2. Do not redesign without flagging a conflict with the PRD.

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS, ES modules, no build step | Simplest reliable path for a first dynamic app; no login/complex nested state to justify a framework |
| Backend | One serverless function only (`/netlify/functions/personalize.js`) | No accounts/auth needed (PRD §5.2); the only server-side need is hiding the Anthropic API key |
| Database | None — static `data/ideas.js` + browser `localStorage` | Idea bank is a version-controlled data file (PRD §9); favorites persist client-side only (PRD §5.1) |
| Authentication | None | Explicitly out of scope for v1.0 |
| AI Model/API | Google Gemini API (`gemini-2.5-flash`, free tier via Google AI Studio), called from the serverless function, never from the browser. **Switched from Anthropic Day 6** — the Anthropic Console account had $0 credit with no working free-tier path; Gemini's free tier needs only a Google account, no card. | Keeps the API key private in a publicly deployed static site; stays on a genuinely free tier |
| Hosting | Netlify | Free tier; static hosting + serverless functions on one platform, git-linked auto-deploy |
| Fonts | Google Fonts CDN — Hanken Grotesk (headings), Manrope (body), IBM Plex Mono (code/technical output) | Matches the "Precision Workshop" design system, zero install |
| Version control | Git + GitHub | Already set up (`github.com/charu-blabla/Eager`) |

**Environment variables:** `GEMINI_API_KEY` is set in the Netlify dashboard (Site settings → Environment variables), never committed to the repo. `.gitignore` already excludes `.env`.

## 2. Component Diagram

```mermaid
graph TD
    subgraph Browser["Browser (Client)"]
        UI[index.html + CSS]
        FORM[InputForm]
        LIST[IdeaList]
        DETAIL[IdeaDetail]
        FAV[FavoritesView]
        MATCH[matching.js]
        AICLIENT[ai.js]
        FAVJS[favorites.js]
        LS[(localStorage)]
        DATA[(data/ideas.js<br/>40 curated ideas)]
    end

    subgraph Netlify["Netlify (Hosting + Functions)"]
        STATIC[Static Site Host]
        FUNC["/netlify/functions/personalize.js"]
    end

    subgraph External["External Service"]
        ANTHROPIC["Anthropic API<br/>/v1/messages"]
    end

    UI --> FORM
    FORM -->|submit| MATCH
    MATCH -->|reads| DATA
    MATCH -->|matched ideas| LIST
    LIST -->|click idea| AICLIENT
    AICLIENT -->|POST /api/personalize| FUNC
    FUNC -->|server-side call, API key attached| ANTHROPIC
    ANTHROPIC -->|personalized brief| FUNC
    FUNC -->|JSON response| AICLIENT
    AICLIENT --> DETAIL
    DETAIL -->|star| FAVJS
    FAVJS <--> LS
    FAV -->|reads| LS
    STATIC -.serves.-> UI
```

## 3. Data Flow — Matching (No Network Call)

Idea matching is entirely client-side. This keeps FR-5/FR-6/FR-7 instant and free.

```mermaid
sequenceDiagram
    participant U as User
    participant F as InputForm
    participant M as matching.js
    participant D as data/ideas.js
    participant L as IdeaList

    U->>F: Select skill level, stack(s), time
    U->>F: Click Submit
    F->>F: Validate (>=1 stack selected)
    F->>M: filterIdeas(inputs, ideas)
    M->>D: read all 40 ideas
    M->>M: filter by difficulty, stack overlap, time fit
    alt matches found
        M->>L: return matched ideas
        L->>U: render idea cards
    else zero matches
        M->>M: progressively loosen filters (time > stack > skill)
        M->>L: return closest matches + note
        L->>U: render cards + "showing closest results"
    end
```

## 4. Request Lifecycle — AI Personalization

```mermaid
sequenceDiagram
    participant U as User
    participant D as IdeaDetail (client)
    participant AI as ai.js
    participant FN as Netlify Function
    participant API as Anthropic API

    U->>D: Click an idea card
    D->>D: Show loading state
    D->>AI: personalizeIdea(idea, userInputs)
    AI->>FN: POST /api/personalize<br/>{idea, skillLevel, stacks, hoursPerWeek, totalWeeks}
    FN->>FN: Validate request body
    alt valid request
        FN->>API: POST /v1/messages (server-side key)
        API-->>FN: structured brief (features, folders, roadmap, resume line)
        FN-->>AI: 200 OK + JSON brief
        AI->>D: render 4 sections
        D->>U: show personalized brief
    else invalid request
        FN-->>AI: 400 + error message
        AI->>D: show inline validation error
    else Anthropic API error/timeout
        FN-->>AI: 502/504 + friendly error
        AI->>D: show retry message
    end
```

## 5. External Services

| Service | Purpose | Notes |
|---|---|---|
| Anthropic API | Generates the personalized brief | Called only from the serverless function, never the browser |
| Netlify | Hosting + serverless functions + auto-deploy from GitHub | Free tier covers this project's traffic comfortably |
| GitHub | Source control, triggers Netlify deploys on push to `main` | Already set up |
| Google Fonts | Space Grotesk / Inter / IBM Plex Mono | Loaded via CDN `<link>` tag, no install |

## 6. Why No Database

The idea bank (40 entries) is small, fixed, and edited by Charu directly in code — a database would add setup, hosting, and query complexity with zero benefit at this scale (PRD §9, §5.2 — admin panel explicitly deferred to v2). Favorites are per-browser by design (PRD §5.1 — no accounts for v1), so `localStorage` is the correct persistence layer, not a database table.
