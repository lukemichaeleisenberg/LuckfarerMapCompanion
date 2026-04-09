# LuckfarerMapCompanion

A browser-based fantasy hex map generator. Paint terrain on a 20x20 hex grid with neighbor-aware rendering (coastlines, mountain scaling), flood-fill region tracking, and per-user save/load via Supabase.

## Dependencies

| Package | Role | Docs |
|---|---|---|
| [React 19](https://react.dev) | UI framework | https://react.dev/reference |
| [Vite](https://vite.dev) | Dev server & bundler | https://vite.dev/guide |
| [Konva](https://konvajs.org) | 2D canvas rendering | https://konvajs.org/docs |
| [react-konva](https://github.com/konvajs/react-konva) | React bindings for Konva | https://github.com/konvajs/react-konva |
| [honeycomb-grid](https://abbekeultjes.nl/honeycomb) | Hex grid math (coordinates, neighbors, traversal) | https://abbekeultjes.nl/honeycomb |
| [Zustand](https://github.com/pmndrs/zustand) | Lightweight global state | https://docs.pmnd.rs/zustand |
| [Supabase](https://supabase.com) | Auth & map storage (planned) | https://supabase.com/docs |

## Setup

Requires Node.js >= 18. If using nvm:

```bash
nvm use 24
```

Install dependencies:

```bash
npm install
```

## Running

```bash
npm run dev
```

Opens at http://localhost:5173

Other scripts:

```bash
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint
```