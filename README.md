# Croqtile Playground

Browser-based IDE for writing, compiling, and running Croqtile code. No installation required.

## Features

- **Monaco Editor** with Choreo syntax highlighting and Catppuccin dark theme
- **Mock Interpreter** — instant in-browser execution via WASM
- **Compiler Output** — view generated C++ or CUDA source
- **AST Dump** — inspect the abstract syntax tree
- **Tutorials** — 3 guided lessons (Hello World, Parallel, Memory)
- **Challenges** — 8 coding problems with auto-verification
- **URL Sharing** — share code via URL hash
- **Progress Tracking** — localStorage-based tutorial/challenge progress
- **Keyboard Shortcuts** — Ctrl+Enter to run
- **Responsive** — stacked layout on mobile

## Architecture

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS 4 + Monaco Editor
- **Execution**: Choreo compiler compiled to WASM via Emscripten (from `croqtile` repo)
- **Targets**: Mock interpreter (instant), cc (C++ codegen), cute (CUDA codegen)
- **Deployment**: Static export — no server required

## Setup

```bash
npm install

# Build WASM artifacts from croqtile (requires Emscripten SDK)
./scripts/build-wasm.sh /path/to/croqtile

# Development
npm run dev

# Tests
npm test

# Production build
npm run build
```

## WASM Artifacts

The compiled WASM files (`co-web.js`, `co-web.wasm`) are gitignored.
Version tracking is done via `public/wasm/build-manifest.json` which records
the exact croqtile commit and version used to build the artifacts.

## Project Structure

```
src/
  app/              # Next.js pages and layout
  components/       # React components (Playground, Editor, Toolbar, etc.)
  lib/              # Hooks, utilities, content data
    challenges/     # 8 coding challenges
    tutorials/      # 3 tutorial chapters
    examples.ts     # 6 example programs
    progress.ts     # localStorage progress tracking
    checkTests.ts   # Test verification logic
    useChoreoWorker.ts  # WASM worker hook
  __tests__/        # Jest unit and component tests
public/wasm/        # WASM artifacts (gitignored) + worker + manifest
```

## Related Repos

| Repo | Role |
|------|------|
| `croqtile` | Compiler source (builds WASM) |
| `croqtile-playground` | This repo (frontend + WASM integration) |
| `croqtile-website` | Main website (links to playground) |
