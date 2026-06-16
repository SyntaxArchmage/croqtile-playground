import type { Challenge } from "./index";

export const challenge09: Challenge = {
  id: "c09",
  title: "Tiled Copy",
  difficulty: "medium",
  description: `Copy an 8-element global array to another using tiles of size 4.

1. Initialize src = [10, 20, 30, 40, 50, 60, 70, 80]
2. For each tile of 4 elements:
   - DMA the tile from src to shared memory
   - Copy from shared memory to dst
3. Print all dst values

Expected output:
\`\`\`
dst[0] = 10
dst[1] = 20
dst[2] = 30
dst[3] = 40
dst[4] = 50
dst[5] = 60
dst[6] = 70
dst[7] = 80
\`\`\``,
  starterCode: `__co__ void tiled_copy() {
  global float src[8];
  global float dst[8];
  shared float tile[4];

  // Initialize src
  parallel {i} by [8] {
    src[i] = (float)((i + 1) * 10);
  }

  // Copy in tiles of 4
  // Hint: use foreach t in [0:2] for tile index

  // Print dst
}
`,
  tests: [
    { expectedOutput: "dst[0] = 10", description: "First element copied from tile 0" },
    { expectedOutput: "dst[4] = 50", description: "First element copied from tile 1" },
    { expectedOutput: "dst[0] = 10\ndst[1] = 20\ndst[2] = 30\ndst[3] = 40\ndst[4] = 50\ndst[5] = 60\ndst[6] = 70\ndst[7] = 80", description: "All 8 elements copied correctly" },
  ],
  hint: "Loop over 2 tiles (t = 0 and 1). For each tile, DMA 4 elements starting at t*4, then copy tile into the matching dst slice.",
};
