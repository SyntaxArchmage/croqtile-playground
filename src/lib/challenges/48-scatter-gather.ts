import type { Challenge } from "./index";

export const challenge48: Challenge = {
  id: "c48",
  title: "Scatter Gather",
  difficulty: "hard",
  description: `Use shared memory and DMA to scatter array values, then gather them back in reverse order.

Given src = [10, 20, 30, 40]:

1. **Scatter**: DMA \`src\` into shared memory \`buf\`
2. **Gather**: Read from \`buf\` in reverse and write to \`dst\`

Expected output:
\`\`\`
dst[0] = 40
dst[1] = 30
dst[2] = 20
dst[3] = 10
\`\`\`

Use \`dma(src[0:4], buf[0:4])\` for the scatter step, then a parallel block to gather in reverse.`,
  starterCode: `__co__ void scatter_gather() {
  global int src[4];
  global int dst[4];
  shared int buf[4];

  parallel {i} by [4] {
    src[i] = (i + 1) * 10;
  }

  // TODO: scatter src into shared buf via DMA
  // dma(src[0:4], buf[0:4]);

  // TODO: gather buf back into dst in reverse order
  // parallel {i} by [4] { dst[i] = buf[3 - i]; }

  parallel {i} by [4] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 40", description: "First element is last source value" },
    { expectedOutput: "dst[3] = 10", description: "Last element is first source value" },
    {
      expectedOutput: "dst[0] = 40\ndst[1] = 30\ndst[2] = 20\ndst[3] = 10",
      description: "Full reverse gather output",
    },
  ],
  hint: "Scatter with dma(src[0:4], buf[0:4]). Gather with parallel {i} by [4] { dst[i] = buf[3 - i]; } — read shared memory from the far end.",
};
