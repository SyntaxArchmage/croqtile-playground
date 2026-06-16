import type { Challenge } from "./index";

export const challenge163: Challenge = {
  id: "c163",
  title: "Array Rotate Copy",
  difficulty: "easy",
  description: `Copy an array into a **new** array with a one-position **left rotation** using \`parallel\`.

Given \`src = [10, 20, 30, 40, 50, 60]\`, produce \`dst\` where each element shifts left and the first wraps to the end.

Expected output:
\`\`\`
dst[0] = 20
dst[1] = 30
dst[2] = 40
dst[3] = 50
dst[4] = 60
dst[5] = 10
\`\`\`

Use modular indexing: \`dst[i] = src[(i + 1) % N]\`.`,
  starterCode: `__co__ void array_rotate_copy() {
  int N = 6;
  global int src[6];
  global int dst[6];

  parallel {i} by [6] {
    src[i] = (i + 1) * 10;
  }

  // TODO: parallel {i} by [6] { dst[i] = src[(i + 1) % N]; }

  parallel {i} by [6] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 20", description: "First element is second source element" },
    { expectedOutput: "dst[5] = 10", description: "Last element wraps to first source element" },
    {
      expectedOutput: "dst[0] = 20\ndst[1] = 30\ndst[2] = 40\ndst[3] = 50\ndst[4] = 60\ndst[5] = 10",
      description: "Full rotated copy output",
    },
  ],
  hint: "Each thread i writes dst[i] = src[(i + 1) % N]. The modulo wraps the last thread back to index 0.",
};
