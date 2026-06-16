import type { Challenge } from "./index";

export const challenge93: Challenge = {
  id: "c93",
  title: "Array Shift Left",
  difficulty: "easy",
  description: `Shift all elements one position to the left. The last slot receives the value that was at index 0.

Given \`src = [10, 20, 30, 40, 50]\`, produce \`dst = [20, 30, 40, 50, 10]\`.

Expected output:
\`\`\`
dst[0] = 20
dst[1] = 30
dst[2] = 40
dst[3] = 50
dst[4] = 10
\`\`\`

Use \`parallel {i} by [5]\` with modular indexing: \`dst[i] = src[(i + 1) % N]\`.`,
  starterCode: `__co__ void array_shift_left() {
  int N = 5;
  global int src[5];
  global int dst[5];

  parallel {i} by [5] {
    src[i] = (i + 1) * 10;
  }

  // TODO: shift left — each element moves one slot left, last wraps to first
  // parallel {i} by [5] { dst[i] = src[(i + 1) % N]; }

  parallel {i} by [5] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 20", description: "First element is second source value" },
    { expectedOutput: "dst[3] = 50", description: "Fourth element is last source value" },
    { expectedOutput: "dst[4] = 10", description: "Last slot receives first source value" },
    {
      expectedOutput: "dst[0] = 20\ndst[1] = 30\ndst[2] = 40\ndst[3] = 50\ndst[4] = 10",
      description: "Full shift-left output",
    },
  ],
  hint: "Each thread i reads from the next index: dst[i] = src[(i + 1) % N]. Index 4 wraps back to src[0].",
};
