import type { Challenge } from "./index";

export const challenge80: Challenge = {
  id: "c80",
  title: "Array Rotate Right",
  difficulty: "medium",
  description: `Rotate an array of 6 elements one position to the **right** using \`parallel\`.

Given \`src = [10, 20, 30, 40, 50, 60]\`, produce \`dst\` where each element shifts right and the last wraps around to the front.

Expected output:
\`\`\`
dst[0] = 60
dst[1] = 10
dst[2] = 20
dst[3] = 30
dst[4] = 40
dst[5] = 50
\`\`\`

Use modular arithmetic: \`dst[i] = src[(i + N - 1) % N]\`.`,
  starterCode: `__co__ void rotate_right() {
  int N = 6;
  global int src[6];
  global int dst[6];

  parallel {i} by [6] {
    src[i] = (i + 1) * 10;
  }

  // TODO: rotate right with parallel
  // parallel {i} by [6] { dst[i] = src[(i + N - 1) % N]; }

  parallel {i} by [6] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 60", description: "First element wraps from last source" },
    { expectedOutput: "dst[1] = 10", description: "Second element is first source" },
    { expectedOutput: "dst[5] = 50", description: "Last element is second-to-last source" },
    {
      expectedOutput: "dst[0] = 60\ndst[1] = 10\ndst[2] = 20\ndst[3] = 30\ndst[4] = 40\ndst[5] = 50",
      description: "Full rotate-right output",
    },
  ],
  hint: "Each thread i reads from the previous index: dst[i] = src[(i + N - 1) % N]. The % operator wraps index 0 back to the last element.",
};
