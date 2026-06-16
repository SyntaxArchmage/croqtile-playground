import type { Challenge } from "./index";

export const challenge113: Challenge = {
  id: "c113",
  title: "Parallel Absolute Value",
  difficulty: "easy",
  description: `Compute the absolute value of each element in an array using \`parallel\` and \`if/else\`.

Given data = [4, -8, 0, -3, 6, -1], produce [4, 8, 0, 3, 6, 1].

Expected output:
\`\`\`
abs[0] = 4
abs[1] = 8
abs[2] = 0
abs[3] = 3
abs[4] = 6
abs[5] = 1
\`\`\`

Use \`parallel {i} by [6]\` — if \`data[i] < 0\`, negate it; otherwise copy as-is.`,
  starterCode: `__co__ void parallel_absolute_value() {
  global int data[6];
  global int abs[6];

  parallel {i} by [1] {
    data[0] = 4; data[1] = -8; data[2] = 0;
    data[3] = -3; data[4] = 6; data[5] = -1;
  }

  // TODO: compute absolute values in parallel
  // parallel {i} by [6] {
  //   if (data[i] < 0) abs[i] = -data[i];
  //   else abs[i] = data[i];
  // }

  parallel {i} by [6] {
    println("abs[", i, "] =", abs[i]);
  }
}
`,
  tests: [
    { expectedOutput: "abs[0] = 4", description: "Positive stays positive" },
    { expectedOutput: "abs[1] = 8", description: "Negative becomes positive" },
    { expectedOutput: "abs[2] = 0", description: "Zero stays zero" },
    {
      expectedOutput: "abs[0] = 4\nabs[1] = 8\nabs[2] = 0\nabs[3] = 3\nabs[4] = 6\nabs[5] = 1",
      description: "All absolute values correct",
    },
  ],
  hint: "Each thread checks if data[i] < 0 and negates it. Otherwise, copy as-is.",
};
