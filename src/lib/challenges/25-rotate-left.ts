import type { Challenge } from "./index";

export const challenge25: Challenge = {
  id: "c25",
  title: "Array Rotate Left",
  difficulty: "medium",
  description: `Rotate an array of 6 elements one position to the left using parallel threads.

Given \`src = [10, 20, 30, 40, 50, 60]\`, produce \`dst\` where each element shifts left and the first wraps around to the end.

Expected output:
\`\`\`
dst[0] = 20
dst[1] = 30
dst[2] = 40
dst[3] = 50
dst[4] = 60
dst[5] = 10
\`\`\`

Use modular arithmetic: \`dst[i] = src[(i + 1) % N]\`.`,
  starterCode: `__co__ void rotate_left() {
  int N = 6;
  global int src[6];
  global int dst[6];

  // Initialize source array
  parallel {i} by [6] {
    src[i] = (i + 1) * 10;
  }

  // Rotate left: each thread reads from the next position
  parallel {i} by [6] {
    // TODO: dst[i] = src[???]
  }

  // Print results
  foreach i in [0:6] {
    println("dst[" + i + "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 20", description: "First element is second source element" },
    { expectedOutput: "dst[5] = 10", description: "Last element wraps to first source element" },
    {
      expectedOutput: "dst[0] = 20\ndst[1] = 30\ndst[2] = 40\ndst[3] = 50\ndst[4] = 60\ndst[5] = 10",
      description: "Full rotated output",
    },
  ],
  hint: "Use modular indexing: dst[i] = src[(i + 1) % N]. The % operator wraps the last thread back to index 0.",
};
