# Croqtile Playground — Session Handoff

**Date**: 2026-06-14
**Session**: auto-dev cycle (ongoing)

## What Was Done This Session

### Defect Fixes (Priority Order)
1. **Choreo syntax highlighting** — Monaco editor now registers a custom "choreo" language with Monarch tokenizer for `__co__`, `parallel`, `dma`, `mma`, `shared`, `global`, `println`, type keywords (`f16`, `f32`, etc.), and Catppuccin dark theme
2. **Example selector reset** — Fixed `<select>` not resettable after choosing an example (controlled value + reset)
3. **Stale closure fix** — Refactored `getCode` into `useCallback`, updated handler dependencies
4. **Worker callback stability** — Removed stale `status` dependency from `run`/`compile`/`dumpAST` callbacks
5. **Challenge test logic** — Fixed `checkTests` to use line-by-line matching instead of full-output equality
6. **Output panel auto-switch** — Automatically switches to Errors tab when new errors arrive
7. **Output panel auto-scroll** — Scrolls to bottom on new content
8. **Type deduplication** — Extracted shared `PanelMode` type
9. **Font family** — Added system font stack to globals.css
10. **Double-render fix** — Context panel no longer mounted twice (desktop/mobile)

### New Features
- **WASM loading spinner** — Animated overlay while compiler initializes
- **WASM error overlay** — Informative message when WASM fails to load
- **URL sharing** — Source code encoded in URL hash; Share button copies link
- **Share feedback** — Button shows "Copied!" for 2 seconds
- **Responsive layout** — Mobile devices get stacked panels via `useIsMobile` hook
- **Keyboard shortcuts** — Ctrl+Enter (Run), Ctrl+Shift+Enter (Compile), Ctrl+S (Share)
- **localStorage progress tracking** — Tutorial step progress and challenge completion
- **Clear output button** — Clears output/errors panel
- **Error boundary** — Graceful crash recovery with reload button
- **SVG favicon** — Catppuccin-themed "C" icon
- **SEO metadata** — Keywords, authors, viewport, theme-color

### Content Expansion
- **8 challenges** (was 3): Hello Threads, Parallel Init, DMA Reverse, Dot Product, Shared Memory Accumulate, Matrix Trace, Two-Stage Pipeline, Nested Parallel
- **6 examples** (was 4): Added Shared Memory demo, Sum Reduction

### Testing
- **53 unit tests** across 9 test suites (all passing)
- Tests cover: `checkTests` logic, data integrity (examples/challenges/tutorials), progress module, StatusBar, OutputPanel, ChallengePanel, Toolbar
- Jest + ts-jest + jsdom environment

### Infrastructure
- GitHub Actions CI workflow (type check, test, build)
- Updated README with full feature list and project structure
- Updated PRD with completed items
- All commits pushed to `SyntaxArchmage/croqtile-playground`

## Current State

- `npm install` ✅
- `npm test` ✅ (53 tests)
- `npx tsc --noEmit` ✅
- `npm run build` ✅
- Dev server boots ✅ (port 3001)

## Remaining Work (from PRD)

### Near-term
- [ ] "Try it" inline buttons in tutorial content
- [ ] Deep link: URL param for tutorial chapter
- [ ] More challenges (9-15 total)
- [ ] Additional tutorials (ch04-ch09)

### Blocked
- [ ] WASM build (requires emsdk installation)
- [ ] E2E test: write code → run → see output (requires WASM)

### Future
- [ ] L2 execution: Remote GPU Server
- [ ] WebGPU exploration (L3)
- [ ] Code sharing via short links
