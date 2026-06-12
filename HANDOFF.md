# Croqtile Playground — Handoff

## Session: 2026-06-12

### What was done

1. **Created independent repo** (`/home/albert/workspace/croqtile-playground/`)
   - From scratch, not copied from website
   - Remote set: `git@github.com:LancerLab/croqtile-playground.git` (push pending)
   - Tech stack: Next.js 16 + Tailwind 4 + Monaco Editor + WASM worker

2. **Cleaned croqtile-website**
   - `git reset --hard b977b76` (removed all playground commits)
   - Force push pending (network down)

3. **Playground features implemented**:
   - Editor (Monaco, vs-dark theme)
   - Toolbar (target selector, Run/Compile/AST, panel toggles)
   - Output panel (tabbed: output/errors)
   - Status bar (compiler version + build manifest)
   - **Tutorial panel** (3 chapters: Hello, Parallel, Memory)
   - **Challenge panel** (3 challenges with test verification)
   - Resizable split layout (left=context, right=IDE)
   - WASM worker architecture (ready to bind to co-web.wasm)
   - Version tracking (build-manifest.json)

4. **TypeScript**: zero errors (tsc --noEmit passes)

### Commits (local, unpushed)

| Hash | Message |
|------|---------|
| c1a0bfa | Initial scaffold |
| 255038d | Tutorial panel |
| 9ca81b2 | Pin dependency versions |
| 0716ac6 | Challenge panel + test verification |

### Blocking

- **Network completely down**: cannot `npm install`, `next build`, `git push`, or `emsdk install`
- node_modules symlinked from croqtile-website for tsc (build fails due to internal Next.js version mismatch in those modules — needs fresh install)

### Next steps (when network returns)

```bash
# 1. Create GitHub repo
# Go to github.com/LancerLab → New repo → croqtile-playground → private

# 2. Push
cd /home/albert/workspace/croqtile-playground
npm install   # fresh install
git push -u origin main

# 3. Clean website remote
cd /home/albert/workspace/croqtile-website
git push origin main --force

# 4. Build WASM
cd /home/albert/workspace/croqtile
# ensure emsdk installed
./scripts/build-wasm.sh /path/to/croqtile
```

### Architecture decisions

- Playground is a **separate private repo**, deployed as static export
- Website links to playground (via URL, not embedded)
- WASM artifacts are gitignored, tracked via `build-manifest.json`
- Execution targets: Mock (phase 1), WGSL (phase 2), WASM kernel (phase 3)
