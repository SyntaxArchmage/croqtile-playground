# Croqtile Playground — Agent Instructions

## WASM Development Workflow (MUST FOLLOW)

This playground consumes a WASM binary built from the C++ compiler at `~/workspace/croqtile`.
Any change to the C++ source requires the full workflow below.

### Step 1: Edit C++ in `~/workspace/croqtile/`

Key files:
- `tools/co-mock/mock_interp.cpp` — AST evaluation
- `tools/co-mock/mock_memory.hpp/.cpp` — Value types
- `lib/` — Parser, sema, codegen

### Step 2: Build WASM

```bash
cd ~/workspace/croqtile && bash tools/co-web/build.sh
```

Do NOT use `cmake --build` or `make` — it downloads LLVM from an unreachable internal server.

### Step 3: Deploy to Playground

```bash
cp ~/workspace/croqtile/build-wasm/co-web.{js,wasm} public/wasm/
```

Update `public/wasm/build-manifest.json` with new commit, timestamp, features.

### Step 4: Verify with Binary Comparison (MANDATORY)

Before declaring done, build the native `co-mock` binary and compare outputs:

```bash
cd ~/workspace/croqtile

# Compile changed files
g++ -std=c++17 -O2 -c tools/co-mock/mock_memory.cpp \
  -I lib -I tools/co-mock -I build -I extern/include -o /tmp/mock_memory.o
g++ -std=c++17 -O2 -c tools/co-mock/mock_interp.cpp \
  -I lib -I tools/co-mock -I build -I extern/include -o /tmp/mock_interp.o

# Replace .o files and re-link
cp /tmp/mock_memory.o build/tools/co-mock/CMakeFiles/co-mock.dir/mock_memory.cpp.o
cp /tmp/mock_interp.o build/tools/co-mock/CMakeFiles/co-mock.dir/mock_interp.cpp.o
cd build && g++ -O3 -DNDEBUG \
  lib/CMakeFiles/parse.dir/__/parser.tab.cc.o \
  lib/CMakeFiles/parse.dir/__/scanner.yy.cc.o \
  lib/CMakeFiles/core.dir/*.o lib/CMakeFiles/codegen.dir/*.o \
  lib/CMakeFiles/support.dir/*.o lib/CMakeFiles/pp.dir/*.o \
  tools/co-mock/CMakeFiles/co-mock.dir/*.o \
  -Wl,--whole-archive lib/Target/libtargets.a -Wl,--no-whole-archive \
  -lpthread -o co-mock-fixed

# Compare old vs new
echo 'test code' > /tmp/test.co
build/co-mock /tmp/test.co 2>&1       # old (shows bug)
build/co-mock-fixed /tmp/test.co 2>&1  # new (should be correct)
```

### Commit Rules

- **croqtile** (external): NEVER commit without explicit user permission
- **croqtile-playground**: Commit WASM + JS when user approves

### Environment Notes

- localhost may not work for dev server — use network IP or `-H 0.0.0.0`
- Playwright: use Firefox (Chromium headless GPU crashes)
- `parallel` examples may fail in WASM without SharedArrayBuffer headers — expected
