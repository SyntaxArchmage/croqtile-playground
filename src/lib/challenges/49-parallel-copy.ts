import type { Challenge } from "./index";

export const challenge49: Challenge = {
  id: "c49",
  title: "Parallel Copy",
  difficulty: "easy",
  description: `Copy all elements from one array to another using \`parallel\`.

Given src = [10, 20, 30, 40, 50, 60, 70, 80], copy each element into \`dst\`.

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
\`\`\`

Use \`parallel {i} by [8] { dst[i] = src[i]; }\` — one thread per element.`,
  starterCode: `__co__ void parallel_copy() {
  global int src[8];
  global int dst[8];

  parallel {i} by [8] {
    src[i] = (i + 1) * 10;
  }

  // TODO: copy src into dst in parallel
  // parallel {i} by [8] { dst[i] = src[i]; }

  parallel {i} by [8] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 10", description: "First element copied" },
    { expectedOutput: "dst[4] = 50", description: "Middle element copied" },
    { expectedOutput: "dst[7] = 80", description: "Last element copied" },
    {
      expectedOutput: "dst[0] = 10\ndst[1] = 20\ndst[2] = 30\ndst[3] = 40\ndst[4] = 50\ndst[5] = 60\ndst[6] = 70\ndst[7] = 80",
      description: "Full parallel copy output",
    },
  ],
  hint: "Launch parallel {i} by [8] and assign dst[i] = src[i]. Each thread handles one index independently.",
};
