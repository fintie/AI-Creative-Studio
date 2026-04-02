# AI Creative Studio

AI Creative Studio is a lightweight offline MVP for an **AI + Minecraft-style creative learning app**.

Users can:
- pick a creative challenge
- build a simple 3D block world in the browser
- place and remove different block types
- orbit and zoom the camera
- get deterministic **Tutor Agent** prompts
- get deterministic **Critic Agent** strengths + improvement feedback

No external LLM or API is required in v1.

## Stack

- **Vite**
- **React**
- **Three.js** via **@react-three/fiber** and **@react-three/drei**

## MVP Features

- polished landing/in-app interface
- challenge cards:
  - Design a future city
  - Create a world that solves climate problems
  - Build an accessible community for everyone
- 3D block sandbox
- four block types: Habitat, Nature, Energy, Water
- click ground to place blocks
- click a block to stack upward
- right click a block to remove it
- offline tutor logic based on current world composition
- offline critic logic based on current world composition
- live world stats panel

## Run locally

### Install

```bash
pnpm install
```

### Start the dev server

```bash
pnpm dev
```

Then open the local URL shown by Vite.

### Build for production

```bash
pnpm build
```

### Preview production build

```bash
pnpm preview
```

## How the mock AI works

The Tutor Agent and Critic Agent are simple deterministic rules in `src/App.jsx`.
They inspect the current block world and generate prompts/review text based on:
- total block count
- block type coverage
- world footprint
- build height
- selected challenge

This keeps the prototype fully offline while still showing the intended product loop.

## Notes

This is intentionally a concise MVP:
- no login
- no persistence
- no backend
- no real LLM integration yet

A good next step would be saving worlds and replacing the mock agent logic with structured prompts to a real model.
