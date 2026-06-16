import type { Challenge } from "./index";

export const challenge121: Challenge = {
  id: "c121",
  title: "Parallel Sign",
  difficulty: "easy",
  description: `Output **-1**, **0**, or **1** for each element based on its sign using \`parallel\`.

Given data = [5, -3, 0, 7, -1]:

| value | sign |
|-------|------|
| 5     | 1    |
| -3    | -1   |
| 0     | 0    |
| 7     | 1    |
| -1    | -1   |

Expected output:
\`\`\`
sign[0] = 1
sign[1] = -1
sign[2] = 0
sign[3] = 1
sign[4] = -1
\`\`\`

Use \`parallel {i} by [5]\` with \`if/else\` — positive → 1, zero → 0, negative → -1.`,
  starterCode: `__co__ void parallel_sign() {
  global int data[5];
  global int sign[5];

  parallel {i} by [1] {
    data[0] = 5; data[1] = -3; data[2] = 0; data[3] = 7; data[4] = -1;
  }

  // TODO: assign sign[i] = 1, 0, or -1 based on data[i]
  // parallel {i} by [5] { ... }

  parallel {i} by [5] {
    println("sign[", i, "] =", sign[i]);
  }
}
`,
  tests: [
    { expectedOutput: "sign[0] = 1", description: "Positive value maps to 1" },
    { expectedOutput: "sign[1] = -1", description: "Negative value maps to -1" },
    { expectedOutput: "sign[2] = 0", description: "Zero maps to 0" },
    {
      expectedOutput: "sign[0] = 1\nsign[1] = -1\nsign[2] = 0\nsign[3] = 1\nsign[4] = -1",
      description: "All sign outputs correct",
    },
  ],
  hint: "Each thread checks data[i]: if > 0 assign 1, else if == 0 assign 0, else assign -1.",
};
