import type { Challenge } from "./index";

export const challenge123: Challenge = {
  id: "c123",
  title: "Array Rotate Right",
  difficulty: "medium",
  description: `Rotate an array of 6 elements **two positions** to the right using \`parallel\`.

Given \`src = [10, 20, 30, 40, 50, 60]\`, each element shifts right by 2 and wraps around.

Expected output:
\`\`\`
dst[0] = 50
dst[1] = 60
dst[2] = 10
dst[3] = 20
dst[4] = 30
dst[5] = 40
\`\`\`

Use modular arithmetic: \`dst[i] = src[(i + N - 2) % N]\`.`,
  starterCode: `__co__ void rotate_right_two() {
  int N = 6;
  global int src[6];
  global int dst[6];

  parallel {i} by [6] {
    src[i] = (i + 1) * 10;
  }

  // TODO: rotate right by 2 with parallel
  // parallel {i} by [6] { dst[i] = src[(i + N - 2) % N]; }

  parallel {i} by [6] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 50", description: "First element wraps from index 4" },
    { expectedOutput: "dst[1] = 60", description: "Second element wraps from index 5" },
    { expectedOutput: "dst[2] = 10", description: "Third element is first source" },
    {
      expectedOutput: "dst[0] = 50\ndst[1] = 60\ndst[2] = 10\ndst[3] = 20\ndst[4] = 30\ndst[5] = 40",
      description: "Full rotate-right-by-2 output",
    },
  ],
  hint: "Each thread i reads from two positions back: dst[i] = src[(i + N - 2) % N].",
};
