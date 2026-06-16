# Croqtile Playground — Session Handoff

**Date**: 2026-06-16
**Sessions**: auto-dev (multiple invocations, 260+ total commits)

## Current State

- `npm install` ✅
- `npm test` ✅ (994 tests, 44 suites)
- `npx tsc --noEmit` ✅
- `npm run lint` ✅
- `npm run build` ✅
- Coverage: 99.91% stmts, 98.74% branches, 100% functions, 100% lines

## Features Implemented

### Core IDE
- Monaco editor with Choreo syntax highlighting (Catppuccin Mocha + Latte themes)
- Toolbar: Run / Compile / AST / Target selector / Examples / Share / Download / Format / Open
- Output panel (tabbed: Output / Errors / AST) with auto-tab-switch, error line highlighting, copy-to-clipboard, line numbers toggle
- Status bar: worker status, compiler version, cursor position (Ln/Col), selection info, line count, target, execution time, unsaved indicator
- Resizable split layout with keyboard and touch support
- Keyboard shortcuts: Ctrl+Enter (Run), Ctrl+Shift+Enter (Compile), Ctrl+Alt+D (AST), Ctrl+S (Share), Ctrl+L (Clear), Ctrl+P (Command Palette), Ctrl+G (Go to Line), Ctrl+F (Find), Ctrl+H (Replace), Ctrl+Z (Undo), Ctrl+Shift+Z (Redo), Ctrl+Shift+T (Toggle Theme), ? (Help)
- Command palette (Ctrl+P) with fuzzy search — 13 commands
- Error boundary with graceful crash recovery
- Light/dark theme toggle (Catppuccin Latte/Mocha)

### Content
- 50 tutorials (ch01–ch50) with "Try it" inline code blocks
- 210 challenges (c01–c210) with auto-verification, progress badges, and "in progress" status
- 59 example programs

### User Experience
- URL sharing with base64url encoding (backward-compatible with legacy percent-encoding)
- URL deep linking (?tutorial=ch01&step=2, ?challenge=c04)
- localStorage persistence: progress, last source, editor settings
- Export/import progress (JSON backup/restore via settings menu and command palette)
- Editor settings: font size (10–24px), font family, word wrap toggle, output line numbers
- Challenge progress tracking: attempts, best code, pass/fail status, confetti animation
- Challenge test failure diff with color-coded expected (green) vs actual (red)
- Challenge status filter (All/To Do/Passed) in challenge list
- Progressive hints for challenges (multi-hint, reveal one at a time)
- Progress summary bars in tutorial list, challenge list, and settings menu
- Unsaved changes warning dialog with auto-save (5s debounce)
- Unsaved changes indicator in status bar
- Running indicator in document title
- Clickable tutorial step dots for direct navigation
- Breadcrumb navigation in tutorial detail view
- ListSearchInput for filtering tutorial/challenge lists
- Pagination (load-more, 20 items per page) for tutorial/challenge lists
- "In progress" badges on tutorials and challenges
- Smart file download with function-name-based filenames
- File open with extension validation (.co/.txt) and size limits (1MB)
- Responsive layout with 44px touch targets on mobile
- Mobile command palette button (visible below 640px)
- Print-friendly CSS (`@media print` hides chrome, preserves content)
- Skip-to-editor link for screen readers
- Floating Run button (FAB) for mobile users
- Custom scrollbar styling
- ShortcutsDialog extracted component with platform-aware shortcut labels

### Accessibility
- ARIA accessibility labels, keyboard-navigable menus, focus trapping in modals
- `:focus-visible` styles for keyboard navigation (globals.css)
- CommandPalette focus trap
- Improved color contrast
- Semantic landmarks (`main`, `nav`, `region`)
- Live regions for status announcements (worker status, completion banners)
- prefers-reduced-motion media query

### Infrastructure
- Next.js 16.2.9 + React 19 + Tailwind CSS 4
- ESLint flat config for Next.js 16
- GitHub Actions CI: type check, lint, test, build
- `.npmrc` with `legacy-peer-deps=true` for CI compatibility
- WASM build script with version tracking (build-manifest.json)
- Platform detection (`src/lib/platform.ts`) for macOS vs Windows/Linux shortcut display
- 994 unit/component tests across 44 suites
- Coverage: 99.91% statements, 98.74% branches, 100% functions, 100% lines
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
