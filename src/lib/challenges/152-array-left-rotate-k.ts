import type { Challenge } from "./index";

export const challenge152: Challenge = {
  id: "c152",
  title: "Array Left Rotate by K",
  difficulty: "medium",
  description: `Rotate an array **K positions to the left** using \`parallel\`.

Given \`src = [10, 20, 30, 40, 50, 60]\` and **K = 2**, each element shifts left by 2 and wraps around.

Expected output:
\`\`\`
dst[0] = 30
dst[1] = 40
dst[2] = 50
dst[3] = 60
dst[4] = 10
dst[5] = 20
\`\`\`

Use modular arithmetic: \`dst[i] = src[(i + K) % N]\`.`,
  starterCode: `__co__ void array_left_rotate_k() {
  int N = 6;
  int K = 2;
  global int src[6];
  global int dst[6];

  parallel {i} by [6] {
    src[i] = (i + 1) * 10;
  }

  // TODO: rotate left by K with parallel
  // parallel {i} by [6] { dst[i] = src[(i + K) % N]; }

  parallel {i} by [6] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 30", description: "First element from index 2" },
    { expectedOutput: "dst[4] = 10", description: "Fifth element wraps from index 0" },
    { expectedOutput: "dst[5] = 20", description: "Last element wraps from index 1" },
    {
      expectedOutput: "dst[0] = 30\ndst[1] = 40\ndst[2] = 50\ndst[3] = 60\ndst[4] = 10\ndst[5] = 20",
      description: "Full left-rotate-by-2 output",
    },
  ],
  hint: "Each thread i reads from K positions ahead: dst[i] = src[(i + K) % N].",
};
