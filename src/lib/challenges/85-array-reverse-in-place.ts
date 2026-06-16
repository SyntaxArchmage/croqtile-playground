import type { Challenge } from "./index";

export const challenge85: Challenge = {
  id: "c85",
  title: "Array Reverse In-Place",
  difficulty: "medium",
  description: `Reverse an array **in place** using parallel pairwise swaps.

Given data = [10, 20, 30, 40, 50, 60], swap elements at indices \`i\` and \`N - 1 - i\` for each \`i\` in \`[0, N/2)\`.

Expected output:
\`\`\`
data[0] = 60
data[1] = 50
data[2] = 40
data[3] = 30
data[4] = 20
data[5] = 10
\`\`\`

Use \`parallel {i} by [N/2]\` — each thread swaps one symmetric pair without overlapping writes.`,
  starterCode: `__co__ void array_reverse_in_place() {
  global int data[6];

  parallel {i} by [6] {
    data[i] = (i + 1) * 10;
  }

  // TODO: swap data[i] and data[5 - i] in parallel
  // parallel {i} by [3] {
  //   int tmp = data[i];
  //   data[i] = data[5 - i];
  //   data[5 - i] = tmp;
  // }

  parallel {i} by [6] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 60", description: "First element is last original" },
    { expectedOutput: "data[5] = 10", description: "Last element is first original" },
    {
      expectedOutput: "data[0] = 60\ndata[1] = 50\ndata[2] = 40\ndata[3] = 30\ndata[4] = 20\ndata[5] = 10",
      description: "Full in-place reversed output",
    },
  ],
  hint: "Launch parallel {i} by [3]. Use a temp variable to swap data[i] and data[5 - i] — each pair is handled by exactly one thread.",
};
