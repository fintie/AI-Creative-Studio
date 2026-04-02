# AI Creative Studio · Phase 2

AI Creative Studio is a lightweight offline **AI + Minecraft-style creative learning demo** built with **Vite, React, and Three.js**.

Phase 2 upgrades the original MVP into a stronger product-style prototype:
- a richer world palette
- more buildable object types and categories
- better editing tools and affordances
- smarter Tutor Agent responses
- more structured Critic Agent feedback
- a clearer progression loop with challenge goals, scoring, and project summary

Everything still runs locally with **no backend and no external model API**.

## What’s new in Phase 2

### Product/demo polish
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

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## How the offline AI works

The Tutor Agent and Critic Agent are deterministic rule systems in `src/App.jsx`.
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

- `src/App.jsx` – app UI, challenge logic, tutor/critic logic, and 3D scene behavior
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
