# Bedtime Story Narrator

An AI-powered bedtime story app that continues your story opening with a voice narration — built with **Cloudflare Workers AI** and **ElevenLabs**.

## What it does

1. Pick a **genre** (Fantasy, Sci-Fi, Adventure, Mystery, Fable, Comedy, Fairy Tale, Thriller)
2. Select an **age group** (2-5, 5-12, 12-18, 18+) — the AI adjusts vocabulary and complexity accordingly
3. Write a **story opening** (a few lines to kick things off)
4. Choose a **narrator voice**
5. Hit Generate — the AI continues your story, ends with a moral, and **reads it aloud** with word-by-word text appearing on screen

Each genre has its own animated background scene — floating fireflies for Fantasy, rain and lightning for Thriller, rising embers for Adventure, and more. The homepage features a looping fantasy nature video.

## How it works

```
User input (genre + age + opening + voice)
    → Cloudflare Workers AI (Llama 3.1 8B) generates age-appropriate story
    → ElevenLabs Text-to-Speech API narrates the story
    → Frontend plays audio with synced word-by-word text reveal
```

**Story generation:** Cloudflare Workers AI runs Meta's Llama 3.1 8B Instruct model at the edge. The system prompt adapts based on the selected age group — simpler words and shorter stories for toddlers, richer vocabulary for adults. Every story ends with a moral.

**Voice narration:** ElevenLabs Multilingual v2 model converts the generated story to natural-sounding speech. Users choose from 5 preset narrator voices.

**Content safety:** The system prompt enforces strict content guidelines — no violence, gore, sexual content, or profanity regardless of age group selected.

## Tech stack

| Component | Technology |
|-----------|-----------|
| Compute | Cloudflare Workers |
| AI Model | Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`) |
| Voice | ElevenLabs Text-to-Speech API (Multilingual v2) |
| Frontend | Vanilla HTML/CSS/JS (served as static assets) |
| Deployment | Cloudflare Workers (single worker serves everything) |

No frameworks. No database. No external dependencies beyond the two hackathon platforms.

## Project structure

```
├── src/
│   └── index.ts           # Cloudflare Worker — API endpoint + AI + TTS
├── public/
│   ├── index.html          # Frontend — UI, animations, narration view
│   └── bg-video.mp4        # Homepage background video
├── wrangler.toml            # Worker config with AI binding
├── package.json
└── tsconfig.json
```

## Prerequisites

- **Node.js** (v18 or later) — [Download](https://nodejs.org/)
- **Cloudflare account** (free tier works) — [Sign up](https://dash.cloudflare.com/sign-up)
- **ElevenLabs API key** — [Sign up](https://elevenlabs.io/) and get your key from Profile > API Keys

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Log in to Cloudflare (required for Workers AI):

```bash
npx wrangler login
```

3. Create a `.dev.vars` file in the project root with your ElevenLabs API key:

```
ELEVENLABS_API_KEY=your_key_here
```

4. Start the dev server:

```bash
npx wrangler dev
```

5. Open http://localhost:8787 in your browser

> Workers AI calls run on Cloudflare's network even in local dev, so you must be logged in. The Cloudflare free tier covers Workers AI usage.

## Deploy to production

1. Set your ElevenLabs API key as a secret:

```bash
npx wrangler secret put ELEVENLABS_API_KEY
```

Enter your API key when prompted.

2. Deploy:

```bash
npx wrangler deploy
```

Your app will be live at `https://ai-story-narrator.<your-subdomain>.workers.dev`

## Built for

[Cloudflare x ElevenLabs Hackathon](https://elevenlabs.io/hackathon) — #ElevenHacks

Built with [Claude Code](https://claude.ai/claude-code)
