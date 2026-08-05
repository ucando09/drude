# Drude — landing page

Landing page for **P-say-B**: vibe-coding, for hardware.

## Stack

- Vite + React + TypeScript
- Framer Motion (scroll-driven phone-dissection scene)

## Develop

```sh
npm install
npm run dev
```

## Deploy (Vercel)

Push to a git repo and import it in Vercel — the Vite preset is auto-detected
(build `npm run build`, output `dist`). Or from this folder: `npx vercel`.

## Things to fill in

- `src/sections/Founders.tsx` — real founder names, roles, resume lines (marked `TODO(founders)`)
- `src/sections/Nav.tsx` / `src/sections/Footer.tsx` — contact email if it should differ
