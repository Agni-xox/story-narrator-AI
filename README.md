# Bedtime Story Narrator
   2
   3 An AI-powered bedtime story app that continues your story opening with a voice narration — built with **Cloudflare Workers AI** and **ElevenLabs**.
   4
   5 ## What it does
   6
   7 1. Pick a **genre** (Fantasy, Sci-Fi, Adventure, Mystery, Fable, Comedy, Fairy Tale, Thriller)
   8 2. Select an **age group** (2-5, 5-12, 12-18, 18+) — the AI adjusts vocabulary and complexity accordingly
   9 3. Write a **story opening** (a few lines to kick things off)
  10 4. Choose a **narrator voice**
  11 5. Hit Generate — the AI continues your story, ends with a moral, and **reads it aloud** with word-by-word text appearing on screen
  12
  13 Each genre has its own animated background scene — floating fireflies for Fantasy, rain and lightning for Thriller, rising embers for Adventure, and more. The homepage features a looping fantasy nature video.
  14
  15 ## How it works
  16
  17 ```
  18 User input (genre + age + opening + voice)
  19     → Cloudflare Workers AI (Llama 3.1 8B) generates age-appropriate story
  20     → ElevenLabs Text-to-Speech API narrates the story
  21     → Frontend plays audio with synced word-by-word text reveal
  22 ```
  23
  24 **Story generation:** Cloudflare Workers AI runs Meta's Llama 3.1 8B Instruct model at the edge. The system prompt adapts based on the selected age group — simpler words and shorter stories for toddlers, richer vocabulary for adults. Every story ends with a moral.
  25
  26 **Voice narration:** ElevenLabs Multilingual v2 model converts the generated story to natural-sounding speech. Users choose from 5 preset narrator voices.
  27
  28 **Content safety:** The system prompt enforces strict content guidelines — no violence, gore, sexual content, or profanity regardless of age group selected.
  29
  30 ## Tech stack
  31
  32 | Component | Technology |
  33 |-----------|-----------|
  34 | Compute | Cloudflare Workers |
  35 | AI Model | Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`) |
  36 | Voice | ElevenLabs Text-to-Speech API (Multilingual v2) |
  37 | Frontend | Vanilla HTML/CSS/JS (served as static assets) |
  38 | Deployment | Cloudflare Workers (single worker serves everything) |
  39
  40 No frameworks. No database. No external dependencies beyond the two hackathon platforms.
  41
  42 ## Project structure
  43
  44 ```
  45 ├── src/
  46 │   └── index.ts           # Cloudflare Worker — API endpoint + AI + TTS
  47 ├── public/
  48 │   ├── index.html          # Frontend — UI, animations, narration view
  49 │   └── bg-video.mp4        # Homepage background video
  50 ├── wrangler.toml            # Worker config with AI binding
  51 ├── package.json
  52 └── tsconfig.json
  53 ```
  54
  55 ## Run locally
  56
  57 ```bash
  58 npm install
  59 ```
  60
  61 Create a `.dev.vars` file with your ElevenLabs API key:
  62
  63 ```
  64 ELEVENLABS_API_KEY=your_key_here
  65 ```
  66
  67 ```bash
  68 npx wrangler dev
  69 ```
  70
  71 Open http://localhost:8787
  72
  73 > Note: Workers AI requires a Cloudflare account and runs remotely even in local dev.
  74
  75 ## Deploy
  76
  77 ```bash
  78 npx wrangler secret put ELEVENLABS_API_KEY
  79 npx wrangler deploy
  80 ```
  81
  82 ## Built for
  83
  84 [Cloudflare x ElevenLabs Hackathon](https://elevenlabs.io/hackathon) — #ElevenHacks
  85
  86 Built with [Claude Code](https://claude.ai/claude-code)
