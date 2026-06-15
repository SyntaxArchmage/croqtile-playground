# Croqtile Playground — Session Handoff

**Date**: 2026-06-15
**Sessions**: auto-dev (multiple invocations, 130+ total commits)

## Current State

- `npm install` ✅
- `npm test` ✅ (443 tests, 27 suites)
- `npx tsc --noEmit` ✅
- `npm run lint` ✅
- `npm run build` ✅

## Features Implemented

### Core IDE
- Monaco editor with Choreo syntax highlighting (Catppuccin Mocha theme)
- Toolbar: Run / Compile / AST / Target selector / Examples / Share / Download / Format / Open
- Output panel (tabbed: Output / Errors / AST) with auto-tab-switch, error line highlighting
- Status bar: worker status, compiler version, cursor position (Ln/Col), line count, target, execution time
- Resizable split layout with keyboard and touch support
- Keyboard shortcuts: Ctrl+Enter (Run), Ctrl+Shift+Enter (Compile), Ctrl+Shift+D (AST), Ctrl+S (Share), Ctrl+L (Clear), Ctrl+P (Command Palette), ? (Help)
- Command palette (Ctrl+P) with fuzzy search
- Error boundary with graceful crash recovery

### Content
- 9 tutorials (ch01–ch09) with "Try it" inline code blocks
- 15 challenges (c01–c15) with auto-verification and progress badges
- 10 example programs

### User Experience
- URL sharing with base64url encoding (backward-compatible with legacy percent-encoding)
- URL deep linking (?tutorial=ch01&step=2, ?challenge=c04)
- localStorage persistence: progress, last source, editor settings
- Editor settings: font size (10–24px), word wrap toggle
- Challenge progress tracking: attempts, best code, pass/fail status, confetti animation
- Unsaved changes warning dialog
- Running indicator in document title
- Tutorial step indicator dots
- Responsive layout (stacked on mobile with touch-resizable panels)
- ARIA accessibility labels, keyboard-navigable menus, focus trapping in modals
- Floating Run button (FAB) for mobile users
- Custom scrollbar styling

### Infrastructure
- Next.js 16.2.9 + React 19 + Tailwind CSS 4
- ESLint flat config for Next.js 16
- GitHub Actions CI: type check, lint, test, build
- WASM build script with version tracking (build-manifest.json)
- 443 unit/component tests across 27 suites
- Coverage: ~97% statements, ~90% branches, ~97% functions, ~99% lines
- prefers-reduced-motion media query for accessibility
- Coverage thresholds: 95% statements, 85% branches, 95% functions, 95% lines
- Worker execution timeout (30s) with elapsed time reporting

## Remaining Work

### Blocked
- [ ] WASM build (requires emsdk installation)
- [ ] E2E test: write code → run → see output (requires WASM)

### Future (PRD Phase 6)
- [ ] L2 execution: Remote GPU Server
- [ ] WebGPU exploration (L3)
- [ ] Extend MockInterpreter to support mma
