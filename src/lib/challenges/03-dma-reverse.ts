import type { Challenge } from "./index";

export const challenge03: Challenge = {
  id: "c03",
  title: "DMA Reverse",
  difficulty: "medium",
  description: `Use DMA to copy a 4-element slice from global memory into shared memory, then write it back in reverse order.

Given \`src = [10, 20, 30, 40]\`, the result in \`dst\` should be \`[40, 30, 20, 10]\`.

Steps:
1. Initialize src array with values [10, 20, 30, 40]
2. DMA src into shared memory
3. In parallel, reverse the order into a dst array
4. Print dst values

Expected output:
\`\`\`
dst[0] = 40
dst[1] = 30
dst[2] = 20
dst[3] = 10
\`\`\``,
  starterCode: `__co__ void dma_reverse() {
  global float src[4];
  global float dst[4];
  shared float tile[4];

  // 1. Initialize src
  parallel {i} by [4] {
    src[i] = (float)((i + 1) * 10);
  }

  // 2. DMA src -> tile

  // 3. Reverse tile into dst

  // 4. Print results
}
`,
  tests: [
    { expectedOutput: "dst[0] = 40", description: "dst[0] should be the last source element (40)" },
    { expectedOutput: "dst[3] = 10", description: "dst[3] should be the first source element (10)" },
    { expectedOutput: "dst[0] = 40\ndst[1] = 30\ndst[2] = 20\ndst[3] = 10", description: "Full reversed output" },
  ],
  hint: "After DMA loads src into tile, write dst in reverse order — element i of dst comes from the opposite end of tile.",
};
