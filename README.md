# A Little Universe Called Nisha

A cinematic, interactive romantic story built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion and Lucide React. Every visual is created in code—there are no image assets.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify a production build

```bash
npm run typecheck
npm run lint
npm run build
```

## Personalize

- Edit every message and the love letter in `lib/content.ts`.
- Edit the palette variables at the top of `app/globals.css`.
- To add optional ambience, place a personally owned or royalty-free MP3 at `public/audio/nisha-ambience.mp3`.

Audio never autoplays before interaction, mute and animation preferences are remembered locally, and the experience honors reduced-motion preferences.
