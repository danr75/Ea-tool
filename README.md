# Enterprise Architecture Intelligence Platform

A visually-driven platform for CIOs, CDOs, and enterprise architects to navigate organisational technology, data, and AI architecture across conceptual, logical, and physical views — and assess how emerging capabilities will reshape it.

## Status

**Vertical slice** — validates the visual language and information model before committing to the full multi-month build. Includes:

- App shell with mode + view switchers
- Conceptual capability map (5 domains, ~30 capabilities)
- Capability detail panel with relationships
- Emerging Capabilities radar
- Emerging capability detail with impact map

See `/root/.claude/plans/as-part-of-plan-piped-whisper.md` for the full build estimate.

## Tech stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Lucide icons
- Seeded JSON data (no backend yet)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/                         App Router pages
    page.tsx                   Landing / executive overview
    architecture/page.tsx      Conceptual capability map
    emerging/page.tsx          Emerging capabilities radar
    emerging/[id]/page.tsx     Emerging capability detail
  components/
    shell/                     Header, mode + view switchers
    conceptual/                Capability map + detail panel
    emerging/                  Radar, cards, impact map
    ui/                        Shared primitives
  data/                        Seed taxonomy + relationships
  lib/                         Types, selectors
```
