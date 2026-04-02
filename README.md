# AI Creative Studio · Phase 2

AI Creative Studio is a lightweight offline **AI + Minecraft-style creative learning demo** built with **Vite, React, and Three.js**.

Phase 2 upgrades the original MVP into a stronger product-style prototype:
- a polished startup-style landing page for the product narrative
- client-side routing between the landing page and the live studio
- a richer world palette
- more buildable object types and categories
- better editing tools and affordances
- smarter Tutor Agent responses
- more structured Critic Agent feedback
- a clearer progression loop with challenge goals, scoring, and project summary

Everything still runs locally with **no backend and no external model API**.

## Routes

- `/` - landing page
- `/studio` - live studio/demo experience

## What’s new in Phase 2

### Product/demo polish
- a dedicated landing page that positions the product as an AI-powered 3D creative learning/game platform
- launch CTA and in-app navigation into the existing studio experience
- more polished hero and panel layout
- improved visual hierarchy and card design
- stronger in-app feedback with live scores and status cards

### Building interaction improvements
- **build / paint / erase** editing modes
- click block faces to build outward in multiple directions
- right click to remove objects quickly
- hover ghost preview when placing objects
- **undo / redo / reset / clear** controls
- block selection feedback in the canvas footer

### Expanded palette
The original four block types are now an expanded multi-category palette:

- **Living**
  - Habitat Pod
  - Civic Hub
- **Ecology**
  - Nature Canopy
  - Water Node
- **Systems**
  - Energy Core
  - Mobility Link
- **Experience**
  - Culture Beacon
  - Food Garden

Different object types also use different primitive shapes to make the scene read more clearly.

### Smarter Tutor Agent
The Tutor Agent now responds to:
- selected challenge
- block diversity
- world density
- mobility/infrastructure coverage
- verticality
- progress against challenge goals

Instead of generic prompts, it gives more context-aware next-step coaching.

### Richer Critic Agent
The Critic Agent now produces:
- strengths
- improvements
- a structured **rubric**
  - idea clarity
  - system thinking
  - spatial design
  - challenge fit
- an overall score out of 40

### Progression / reflection loop
Phase 2 adds a stronger design loop with:
- **challenge completion checklist**
- **project summary card**
- **live score breakdown**
- **people vs eco emphasis metrics**

This helps the prototype feel more like a guided creative learning tool rather than just a sandbox.

## Stack

- **Vite**
- **React**
- **Three.js** via **@react-three/fiber** and **@react-three/drei**

## Run locally

### Install

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Then open the local URL shown by Vite.

The app now opens on the landing page by default. Use the launch CTA to enter the studio, or open `/studio` directly.

### Build for production

```bash
npm run build
```

This project is configured for GitHub Pages deployment at:
- `https://fintie.github.io/AI-Creative-Studio/`

_Last deployment refresh: trigger rebuild after Pages enablement._

### Preview production build

```bash
npm run preview
```

## How the offline AI works

The Tutor Agent and Critic Agent are deterministic rule systems in `src/components/StudioExperience.jsx`.
They inspect the current world and derive feedback from metrics such as:
- total object count
- type coverage
- challenge goal completion
- footprint and density
- build height
- infrastructure presence
- people-oriented vs sustainability-oriented balance

This keeps the prototype fully offline while making the feedback feel more dynamic and intentional.

## Project structure

- `src/App.jsx` – route definitions for landing and studio pages
- `src/pages/LandingPage.jsx` – landing page content and section navigation
- `src/pages/StudioPage.jsx` – studio route wrapper and back-navigation links
- `src/components/StudioExperience.jsx` – studio UI, challenge logic, tutor/critic logic, and 3D scene behavior
- `src/styles.css` – product-style interface and responsive layout styling

## Notes

This is still intentionally simple:
- no login
- no persistence
- no backend
- no real LLM integration yet

A strong next step after Phase 2 would be:
- save/load worlds
- shareable project snapshots
- richer object models
- optional real model-backed tutor and critic agents
