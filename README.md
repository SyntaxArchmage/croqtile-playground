# Croqtile Playground

Browser-based IDE for writing, compiling, and running Croqtile code.

## Architecture

- **Frontend**: Next.js + React + Tailwind + Monaco Editor
- **Execution**: Choreo compiler compiled to WASM via Emscripten (from `croqtile` repo)
- **Targets**: Mock interpreter (instant), cc (C++ codegen), cute (CUDA codegen)
- **Deployment**: Static export (`next export`) — no server required

## Setup

```bash
npm install

# Build WASM artifacts from croqtile (requires Emscripten SDK)
./scripts/build-wasm.sh /path/to/croqtile

# Development
npm run dev
```

## WASM Artifacts

The compiled WASM files (`co-web.js`, `co-web.wasm`) are gitignored.
Version tracking is done via `public/wasm/build-manifest.json` which records
the exact croqtile commit and version used to build the artifacts.

## Relationship to Other Repos

| Repo | Role |
|------|------|
| `croqtile` | Compiler source (builds WASM) |
| `croqtile-playground` | This repo (frontend + WASM integration) |
| `croqtile-website` | Main website (links to playground) |
