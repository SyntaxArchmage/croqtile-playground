import type { Challenge } from "./index";

export const challenge42: Challenge = {
  id: "c42",
  title: "Parallel Absolute Value",
  difficulty: "easy",
  description: `Compute the absolute value of each element in an array.

Given data = [-3, 5, -1, 0, -7, 2], produce [3, 5, 1, 0, 7, 2].

Expected output:
\`\`\`
abs[0] = 3
abs[1] = 5
abs[2] = 1
abs[3] = 0
abs[4] = 7
abs[5] = 2
\`\`\`

Use \`parallel {i} by [6]\` with a conditional: if negative, negate it.`,
  starterCode: `__co__ void parallel_abs() {
  global int data[6];
  global int result[6];

  parallel {i} by [1] {
    data[0] = -3; data[1] = 5; data[2] = -1;
    data[3] = 0; data[4] = -7; data[5] = 2;
  }

  // TODO: compute absolute values in parallel
  // parallel {i} by [6] {
  //   if (data[i] < 0) result[i] = -data[i];
  //   else result[i] = data[i];
  // }

  parallel {i} by [6] {
    println("abs[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "abs[0] = 3", description: "Negative becomes positive" },
    { expectedOutput: "abs[3] = 0", description: "Zero stays zero" },
    { expectedOutput: "abs[1] = 5", description: "Positive stays positive" },
    {
      expectedOutput: "abs[0] = 3\nabs[1] = 5\nabs[2] = 1\nabs[3] = 0\nabs[4] = 7\nabs[5] = 2",
      description: "All absolute values correct",
    },
  ],
  hint: "Each thread checks if data[i] < 0 and negates it. Otherwise, copy as-is.",
};
