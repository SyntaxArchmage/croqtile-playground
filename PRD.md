# Croqtile Playground — Product Requirements Document

**Version**: 1.0
**Date**: 2026-06-14
**Status**: Draft
**Repo**: `LancerLab/croqtile-playground`

---

## 1. Overview

Croqtile Playground is a browser-based IDE for writing, compiling, and running Croqtile code. It combines three experiences in a single interface:

1. **Online IDE** — free-form code editing with compilation and execution
2. **Tutorial Mode** — guided step-by-step lessons
3. **Challenge Mode** — coding problems with automated verification

No installation required. All compilation and execution happens in the browser via WebAssembly.

### 1.1 Relationship to Other Repos

| Repo | Role |
|------|------|
| `croqtile` | Compiler source; builds WASM artifacts via Emscripten |
| `croqtile-playground` | This repo; frontend + WASM integration |
| `croqtile-website` | Marketing/docs site; links to playground |
| `croqtile-tutorial` | Tutorial source material (ch00–ch09, bilingual) |

The playground is a **standalone deployment** (static export), not embedded in the website.

---

## 2. Target Users

| User | Goal |
|------|------|
| **Learner** | Understand Croqtile concepts (parallel, dma, mma) through guided tutorials |
| **Researcher** | Quickly prototype and test `.co` kernels without local setup |
| **Evaluator** | Try Croqtile before committing to local installation |

---

## 3. Technical Architecture

### 3.1 Frontend Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (static export) |
| UI | React 19 + Tailwind CSS 4 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Language | TypeScript 5.8 |

### 3.2 Execution Engine

The Choreo compiler (C++) is compiled to WebAssembly via Emscripten. The same C++ source code produces both the native `choreo` binary (for local use) and `co-web.wasm` (for browser use).

```
Choreo C++ source ──┬── GCC/Clang ──→ choreo (native binary)
                    └── Emscripten ──→ co-web.wasm + co-web.js (browser)
```

WASM runs in a Web Worker (`choreo-worker.js`) to avoid blocking the UI thread.

#### WASM API (4 functions)

| Function | Purpose | Limitation |
|----------|---------|------------|
| `compile(source, target, flags)` | Generate C++/CUDA source text | Output only; does not execute |
| `mockRun(source)` | Interpret-execute via MockInterpreter | No mma support |
| `dumpAST(source)` | Print AST text dump | Debug/educational use |
| `getVersion()` | Return compiler version string | — |

#### MockInterpreter Capabilities

| Construct | Supported? |
|-----------|-----------|
| `println()` / `print()` | Yes |
| `parallel {i,j} by [M,N]` | Yes (serial loop) |
| `dma(src, dst)` | Yes (memcpy) |
| `foreach` | Yes |
| `if/else/while/break/continue` | Yes |
| `inthreads` | Yes (std::thread) |
| `rotate` | Yes |
| `mma()` | **No** — "not supported" error |

### 3.3 Execution Tiers (Future)

| Tier | Mechanism | GPU Required? | Status |
|------|-----------|--------------|--------|
| **L1** | WASM MockInterpreter (browser) | No | Primary path (MVP) |
| **L2** | Remote GPU Server (REST API) | No (server has GPU) | Architecture exists in co-web; not deployed |
| **L3** | WebGPU (browser-native GPU) | Yes | Not planned for MVP; requires WGSL codegen backend |

For MVP, only L1 is implemented. L2/L3 are future enhancements.

---

## 4. User Interface

### 4.1 Layout Philosophy

The IDE is **always present** on the right side. The left panel is a toggleable Context Panel that provides tutorial or challenge content. This creates a "learn while you code" experience.

### 4.2 Layout States

#### Pure IDE (panel closed — `/playground`)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─Toolbar──────────────────────────────────────────────────┐│
│ │ [◀ Panel] [Target ▾] [▶ Run] [Compile] [AST] [Examples]││
│ └──────────────────────────────────────────────────────────┘│
│ ┌─Editor───────────────────────────────────────────────────┐│
│ │                     Monaco Editor (.co)                   ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌─Output (tabbed)──────────────────────────────────────────┐│
│ │ [Output] [Errors] [AST]                                  ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌─Status Bar───────────────────────────────────────────────┐│
│ │ ● Ready │ co-web v0.x │ WASM                             ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

#### IDE + Context Panel (tutorial or challenge active)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─Context Panel (left, resizable)─┐┌─IDE Panel (right)────┐│
│ │ [Tutorial | Challenge]          ││ Toolbar               ││
│ │                                  ││ Editor                ││
│ │ Content / instructions           ││ Output (tabbed)       ││
│ │ "Try it" → loads code to editor ││ Status Bar            ││
│ │ [← Prev]  [Next →]             ││                       ││
│ └─────────────────────────────────┘└──────────────────────┘│
│              ↑ draggable divider                            │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Key UX Principles

1. **IDE is always accessible** — the editor never goes away
2. **Left panel is context** — reads like a book while you code on the right
3. **"Try it" buttons** — code snippets in tutorials load directly into the editor
4. **Seamless switching** — toggle between Tutorial and Challenge without losing editor state
5. **Panel is collapsible** — collapse for full-width IDE
6. **Resizable divider** — drag to adjust panel/editor ratio

### 4.4 Editor Features

- Choreo (`.co`) syntax highlighting via Monarch tokenizer
- Catppuccin Mocha dark theme (custom `choreoDarkTheme`)
- Keywords: `__co__`, `__cok__`, `dma`, `tma`, `mma`, `parallel`, `foreach`, `pipeline`, etc.
- Types: `f16`, `f32`, `f64`, `bf16`, `i8`–`i64`, `u8`–`u64`, `half`, etc.
- JetBrains Mono / Fira Code font
- No minimap; line numbers on; automatic layout

---

## 5. Feature Specifications

### 5.1 Toolbar

| Button | Action |
|--------|--------|
| Panel toggle | Open/close left Context Panel |
| Target selector | Dropdown: `cc` (C++ CPU), `cute` (CUDA CuTe) |
| Run | Execute via MockInterpreter (`mockRun`) |
| Compile | Generate target code (`compile`) |
| AST | Dump AST (`dumpAST`) |
| Examples | Dropdown to load example programs |

### 5.2 Output Panel

Tabbed panel at the bottom of the IDE:

- **Output** — stdout from mockRun / compile
- **Errors** — stderr / compilation errors (red dot indicator when non-empty)

### 5.3 Status Bar

Shows: worker status indicator (Loading WASM / Ready / Running / Error) + compiler version info.

### 5.4 Tutorial System

**Data model**:

```typescript
interface TutorialStep {
  title: string;
  content: string;    // Markdown-like text
  code: string;       // Code snippet loadable into editor
  hint?: string;
}

interface Tutorial {
  id: string;         // "ch01"
  title: string;      // "Hello Croqtile"
  description: string;
  steps: TutorialStep[];
}
```

**Current content** (12 tutorials):

| ID | Title | Steps | Topics |
|----|-------|-------|--------|
| ch01 | Hello Croqtile | 3 | `__co__` keyword, `println()`, variables/types |
| ch02 | Parallel Execution | 3 | `parallel` construct, thread indices, data parallelism |
| ch03 | Memory Hierarchy | 3 | Global/shared memory, `dma()` transfers, slices |
| ch04 | Loops & Reductions | 3 | `foreach`, sum reduction, max reduction |
| ch05 | 2D Arrays & Matrix Ops | 3 | 2D indexing, matrix ops, dot product |
| ch06 | Advanced Patterns | 3 | Tiled processing, pipeline stages, nested parallel |
| ch07 | Functions & Modularity | 3 | Helper functions, multi-param, composition |
| ch08 | Conditionals & Control Flow | 3 | if/else in parallel, conditional processing, guards |
| ch09 | Common GPU Patterns | 3 | Map, reduce, stencil patterns |
| ch10 | Debugging & Best Practices | 3 | println debugging, DMA validation, performance tips |
| ch11 | Data Types & Casting | 3 | Numeric types, explicit casting, precision |
| ch12 | Array Slicing & DMA Patterns | 3 | Slice notation, computed offsets, double buffering |

All tutorials include interactive "Try it" inline code blocks.

**UX**: Each step shows explanatory text + a code snippet. "Try it" button loads the snippet into the editor on the right. User can run it immediately.

### 5.5 Challenge System

**Data model**:

```typescript
interface TestCase {
  input?: string;
  expectedOutput: string;
  description: string;
}

interface Challenge {
  id: string;          // "c01"
  title: string;       // "Hello Threads"
  difficulty: "easy" | "medium" | "hard";
  description: string; // Problem statement (Markdown)
  starterCode: string; // Pre-filled template
  tests: TestCase[];
  hint?: string;       // Progressive hint
}
```

**Validation logic**: `mockRun(userCode)` → compare `output.trim()` with `expectedOutput.trim()`.

**Current challenges** (24):

| ID | Title | Difficulty | Key Construct |
|----|-------|-----------|---------------|
| c01 | Hello Threads | Easy | `parallel`, `println` |
| c02 | Parallel Initialize | Easy | `parallel`, array initialization |
| c03 | DMA Reverse | Medium | `dma`, array reversal |
| c04 | Dot Product | Medium | `parallel`, `foreach`, accumulation |
| c05 | Shared Memory Accumulate | Medium | `shared`, `dma`, reduction |
| c06 | Matrix Trace | Hard | 2D indexing, diagonal access |
| c07 | Two-Stage Pipeline | Hard | `pipeline`, multi-stage processing |
| c08 | Nested Parallel | Hard | Multi-dimensional `parallel` |
| c09 | Tiled Copy | Medium | `dma`, tiled data movement |
| c10 | Find Minimum | Easy | `foreach`, conditional reduction |
| c11 | Prefix Sum | Medium | Sequential scan, inclusive prefix sum |
| c12 | Broadcast Add | Easy | Scalar broadcast, element-wise ops |
| c13 | Element-wise Multiply | Easy | `parallel`, element-wise multiply |
| c14 | Row Sum | Medium | 2D arrays, row-wise reduction |
| c15 | Scale Vector (DMA) | Hard | `shared`, `dma`, scale operation |
| c16 | Parallel Classify | Medium | Conditional logic in parallel blocks |
| c17 | Matrix Transpose | Medium | 2D indexing, row/column swap |
| c18 | Histogram Count | Hard | Sequential accumulation, race condition awareness |
| c19 | Swap Adjacent Pairs | Easy | `parallel`, array pair swapping |
| c20 | Moving Average | Hard | `shared`, `dma`, boundary handling, stencil computation |
| c21 | Running Maximum | Medium | `foreach`, sequential max tracking |
| c22 | Matrix Column Sum | Medium | 2D indexing, column-wise reduction |
| c23 | Pipeline Sum | Hard | `pipeline`, `stage`, `dma`, `foreach` accumulation |
| c24 | Pack & Unpack | Easy | Array interleaving, index arithmetic |

### 5.6 Example Programs

Built-in code snippets loadable from toolbar dropdown (14 examples):

| Name | Demonstrates |
|------|-------------|
| Hello World | Basic `__co__` function + `println` |
| Parallel Loop | `parallel {i} by [4]` |
| DMA Transfer | `global`/`shared` memory + `dma()` |
| Matrix Multiply | `parallel` + `foreach` + accumulation |
| Shared Memory | DMA to shared tile + parallel read |
| Sum Reduction | `foreach` loop accumulation |
| Tiled Processing | Loop over tiles with DMA |
| 2D Parallel Grid | `parallel {i,j} by [N,M]` |
| Conditional Logic | `if/else` inside parallel blocks |
| 1D Stencil | Neighbor averaging with boundary handling |
| Matrix Transpose | 2D index swapping |
| Dot Product | Vector multiply-accumulate |
| Find Maximum | Conditional reduction for max value |
| Two-Stage Pipeline | DMA + shared memory processing |

---

## 6. WASM Integration

### 6.1 Artifacts

| File | Source | Size (est.) |
|------|--------|-------------|
| `co-web.js` | Emscripten JS glue | ~100 KB |
| `co-web.wasm` | Compiled binary | ~5–15 MB |
| `choreo-worker.js` | Web Worker wrapper | ~5 KB |

Artifacts are gitignored. Version tracked via `public/wasm/build-manifest.json` recording the exact `croqtile` commit hash.

### 6.2 Loading Sequence

```
1. User visits /playground
2. Page renders with editor (empty output)
3. useEffect → instantiate Web Worker
4. Worker loads co-web.js → fetches co-web.wasm
5. Module initializes → Worker posts 'ready'
6. Status bar: "Ready" (typically < 2s)
```

### 6.3 Worker Message Protocol

```typescript
// To worker
{ type: 'compile', source: string, target: string, flags: string }
{ type: 'mockRun', source: string }
{ type: 'dumpAST', source: string }

// From worker
{ type: 'ready', data: { version: string } }
{ type: 'compile-result', data: { output: string, errors: string } }
{ type: 'error', data: { message: string } }
```

### 6.4 Build Process

```bash
# In croqtile repo (requires Emscripten SDK)
./scripts/build-wasm.sh /path/to/croqtile

# Produces: public/wasm/co-web.js, public/wasm/co-web.wasm
# Updates: public/wasm/build-manifest.json
```

---

## 7. State Management

### 7.1 Client-Side State (React)

Managed via `useChoreoWorker` hook + component state:

| State | Type | Scope |
|-------|------|-------|
| `source` | `string` | Editor content |
| `target` | `string` | Compile target (cc/cute) |
| `panelMode` | `"tutorial" \| "challenge" \| "closed"` | Left panel state |
| `status` | `"loading" \| "ready" \| "running" \| "error"` | Worker status |
| `output` / `errors` | `string` | Execution results |

### 7.2 Persistence (Future — localStorage)

```typescript
interface PlaygroundState {
  lastSource: string;
  lastTarget: string;
  tutorialProgress: Record<string, "not_started" | "in_progress" | "completed">;
  challengeProgress: Record<string, {
    status: "not_started" | "attempted" | "passed";
    bestCode?: string;
    attempts: number;
  }>;
}
```

No backend needed for MVP. localStorage is sufficient.

---

## 8. Component Architecture

```
src/
  app/
    page.tsx                         ← Entry point
    layout.tsx                       ← Root layout

  components/
    Playground.tsx                   ← Top-level orchestrator
    Toolbar.tsx                      ← Run/Compile/AST + target + examples
    Editor.tsx                       ← Monaco editor wrapper (dynamic import)
    OutputPanel.tsx                  ← Tabbed output (Output/Errors)
    StatusBar.tsx                    ← Worker status indicator
    TutorialPanel.tsx                ← Tutorial content + step navigation
    ChallengePanel.tsx               ← Challenge description + verification UI
    ResizableSplit.tsx               ← Draggable left/right divider

  lib/
    useChoreoWorker.ts               ← Web Worker management hook
    examples.ts                      ← Built-in example programs
    tutorials/
      index.ts                       ← Tutorial type definitions + exports
      ch01-hello.ts                  ← Tutorial: Hello Croqtile
      ch02-parallel.ts               ← Tutorial: Parallel Computing
      ch03-memory.ts                 ← Tutorial: Memory & DMA
    challenges/
      index.ts                       ← Challenge type definitions + exports
      01-hello.ts                    ← Challenge: Hello Threads
      02-parallel-sum.ts             ← Challenge: Parallel Sum
      03-dma-reverse.ts              ← Challenge: DMA Reverse
```

---

## 9. Implementation Phases

### Phase 1: Core IDE + Layout (DONE)

- [x] Next.js project scaffold
- [x] Monaco editor with `.co` syntax highlighting
- [x] Toolbar: Run / Compile / AST / Target selector / Examples
- [x] Output panel (tabbed: Output / Errors)
- [x] Status bar
- [x] Resizable split layout
- [x] WASM worker architecture (`useChoreoWorker` hook)
- [x] Example programs (10)

### Phase 2: Tutorial Panel (DONE)

- [x] Tutorial data model (`Tutorial` / `TutorialStep`)
- [x] 3 tutorial chapters (Hello / Parallel / Memory)
- [x] TutorialPanel component with step navigation
- [x] "Load code" into editor
- [x] "Try it" inline buttons in content
- [x] Progress tracking (localStorage)
- [x] Deep link: URL param for tutorial chapter

### Phase 3: Challenge Panel (DONE)

- [x] Challenge data model (`Challenge` / `TestCase`)
- [x] 15 challenges (Hello Threads through Scale Vector DMA)
- [x] ChallengePanel component with verification UI
- [x] Test verification against expected output
- [x] Progressive hint reveal UI
- [x] Progress tracking (localStorage)
- [x] Deep link: URL param for challenge

### Phase 4: Infrastructure (DONE)

- [x] `npm install`
- [ ] WASM build (emsdk not installed)
- [x] GitHub push
- [x] Verify dev server boots successfully
- [ ] End-to-end test: write code → run → see output (requires WASM)

### Phase 5: Polish (DONE)

- [x] Responsive design (stacked on mobile)
- [x] WASM loading spinner
- [x] Keyboard shortcuts (Ctrl+Enter = Run)
- [x] URL sharing (source in URL hash + Share button)
- [x] Error states / graceful degradation
- [x] Auto-scroll output panel
- [x] Auto-switch to errors tab
- [x] Unit tests (562 tests across 30 suites)
- [x] GitHub Actions CI pipeline
- [x] ErrorBoundary component
- [x] Custom scrollbar styling
- [x] ARIA accessibility labels
- [x] Favicon

### Phase 6: Future Enhancements

- [ ] L2 execution: Remote GPU Server integration
- [ ] Extend MockInterpreter to support mma (CPU simulation)
- [x] ~~Additional tutorials (ch04–ch09)~~ — Done
- [x] ~~Additional challenges (9–15 total)~~ — Done (15 total)
- [x] ~~Code sharing via short links~~ — Done (base64url encoding)
- [ ] WebGPU exploration (L3)

---

## 10. Deployment

| Aspect | Plan |
|--------|------|
| Build | `next build` → static export |
| Hosting | Vercel (or any static host) |
| WASM | Static files in `public/wasm/`; gitignored, built separately |
| Domain | TBD (e.g., `playground.croqtile.dev`) |
| CI | GitHub Actions: build check; WASM build optional (requires emsdk) |

---

## 11. Open Questions

1. **MMA support**: Extend MockInterpreter with CPU-simulated matrix multiply? This would unlock ch04+ tutorials and harder challenges.
2. **Deployment hosting**: Vercel vs. GitHub Pages vs. Cloudflare Pages?
3. **WASM CI**: Should the WASM build be part of CI, or manual?
4. **Code sharing**: URL hash encoding vs. short-link service?
5. **Analytics**: Track challenge completion rates?
6. **GPU server**: Deploy the existing `gpu_server.py` for real CUDA execution?
