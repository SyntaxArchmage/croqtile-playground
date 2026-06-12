#!/usr/bin/env bash
set -euo pipefail

# build-wasm.sh — Build co-web.wasm from croqtile and copy to website with version tracking.
#
# Usage: ./scripts/build-wasm.sh [/path/to/croqtile]
#
# Requires:
#   - Native croqtile build (parser files in build/)
#   - Emscripten SDK installed at croqtile/extern/emsdk

CROQTILE_DIR="${1:-$(realpath "$(dirname "$0")/../../croqtile")}"
WEBSITE_DIR="$(realpath "$(dirname "$0")/..")"
DEST_DIR="$WEBSITE_DIR/public/wasm"

if [ ! -d "$CROQTILE_DIR/lib" ]; then
  echo "ERROR: croqtile directory not found at: $CROQTILE_DIR"
  echo "Usage: $0 /path/to/croqtile"
  exit 1
fi

if [ ! -f "$CROQTILE_DIR/build/parser.tab.cc" ]; then
  echo "ERROR: Native build required first."
  echo "  cd $CROQTILE_DIR && make build"
  exit 1
fi

if [ ! -d "$CROQTILE_DIR/extern/emsdk/upstream" ]; then
  echo "ERROR: Emscripten SDK not found."
  echo "  cd $CROQTILE_DIR/extern && git clone https://github.com/emscripten-core/emsdk.git"
  echo "  cd emsdk && ./emsdk install latest && ./emsdk activate latest"
  exit 1
fi

echo "=== Building co-web.wasm ==="
echo "  Source: $CROQTILE_DIR"
echo "  Dest:   $DEST_DIR"

cd "$CROQTILE_DIR"

COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_FULL=$(git rev-parse HEAD)
VERSION=$(cat VERSION.txt | tr -d '\n')
DIRTY=$(git diff --quiet && echo "" || echo "-dirty")

echo "  Version: $VERSION"
echo "  Commit:  $COMMIT_HASH$DIRTY"

make co-web

echo "=== Copying artifacts ==="
cp "$CROQTILE_DIR/tools/co-web/web/co-web.js" "$DEST_DIR/"
cp "$CROQTILE_DIR/build-wasm/co-web.wasm" "$DEST_DIR/"

echo "=== Writing build manifest ==="
cat > "$DEST_DIR/build-manifest.json" <<EOF
{
  "artifact": "co-web",
  "version": "$VERSION",
  "commit": "$COMMIT_FULL$DIRTY",
  "commit_short": "$COMMIT_HASH$DIRTY",
  "built_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "builder": "make co-web (Emscripten)",
  "source_repo": "github.com/LancerLab/croqtile",
  "emsdk": "$(cat extern/emsdk/upstream/.emsdk_version 2>/dev/null || echo 'unknown')"
}
EOF

echo "=== Done ==="
echo "Artifacts:"
ls -lh "$DEST_DIR/co-web.js" "$DEST_DIR/co-web.wasm" "$DEST_DIR/build-manifest.json"
echo ""
echo "Manifest:"
cat "$DEST_DIR/build-manifest.json"
