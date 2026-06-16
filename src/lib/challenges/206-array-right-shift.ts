import type { Challenge } from "./index";

export const challenge206: Challenge = {
  id: "c206",
  title: "Array Right Shift",
  difficulty: "easy",
  description: `Shift all elements **right by 1**, wrapping the last element to the front, using \`parallel\`.

Given \`src = [10, 20, 30, 40, 50]\`:

Expected output:
\`\`\`
dst[0] = 50
dst[1] = 10
dst[2] = 20
dst[3] = 30
dst[4] = 40
\`\`\`

Use \`dst[i] = src[(i + N - 1) % N]\` with \`N = 5\`.`,
  starterCode: `__co__ void array_right_shift() {
  int N = 5;
  global int src[5];
  global int dst[5];

  parallel {i} by [5] {
    src[i] = (i + 1) * 10;
  }

  // TODO: shift right by 1 with parallel
  // parallel {i} by [5] { dst[i] = src[(i + N - 1) % N]; }

  parallel {i} by [5] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 50", description: "Last element wraps to front" },
    { expectedOutput: "dst[1] = 10", description: "First element shifts to index 1" },
    { expectedOutput: "dst[4] = 40", description: "Second-to-last element shifts to end" },
    {
      expectedOutput: "dst[0] = 50\ndst[1] = 10\ndst[2] = 20\ndst[3] = 30\ndst[4] = 40",
      description: "Full right-shift-by-1 output",
    },
  ],
  hint: "parallel {i} by [5] { dst[i] = src[(i + N - 1) % N]; } — each thread reads from the previous index with wrap-around.",
};
