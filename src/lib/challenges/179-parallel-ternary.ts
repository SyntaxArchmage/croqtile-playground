import type { Challenge } from "./index";

export const challenge179: Challenge = {
  id: "c179",
  title: "Parallel Ternary",
  difficulty: "easy",
  description: `Apply a **ternary conditional** to each element using \`parallel\` and \`if/else\`.

Given data = [-2, 0, 5, -8, 3], keep positive values and replace non-positive values with **0**:

| data[i] | result[i] |
|---------|-----------|
| -2      | 0         |
| 0       | 0         |
| 5       | 5         |
| -8      | 0         |
| 3       | 3         |

Expected output:
\`\`\`
result[0] = 0
result[1] = 0
result[2] = 5
result[3] = 0
result[4] = 3
\`\`\`

Use \`parallel {i} by [5]\`: if \`data[i] > 0\` then copy, else set to 0.`,
  starterCode: `__co__ void parallel_ternary() {
  global int data[5];
  global int result[5];

  parallel {i} by [1] {
    data[0] = -2; data[1] = 0; data[2] = 5; data[3] = -8; data[4] = 3;
  }

  // TODO: parallel {i} by [5] {
  //   if (data[i] > 0) { result[i] = data[i]; } else { result[i] = 0; }
  // }

  parallel {i} by [5] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 0", description: "Negative value replaced with 0" },
    { expectedOutput: "result[2] = 5", description: "Positive value kept" },
    { expectedOutput: "result[3] = 0", description: "Negative value replaced with 0" },
    {
      expectedOutput: "result[0] = 0\nresult[1] = 0\nresult[2] = 5\nresult[3] = 0\nresult[4] = 3",
      description: "All ternary results correct",
    },
  ],
  hint: "Inside parallel {i} by [5]: if data[i] > 0 then result[i] = data[i], else result[i] = 0.",
};
