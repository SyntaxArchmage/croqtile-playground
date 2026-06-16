import type { Challenge } from "./index";

export const challenge182: Challenge = {
  id: "c182",
  title: "Parallel Invert",
  difficulty: "easy",
  description: `Compute the **two's complement** of each element by negating and adding 1, using \`parallel\`.

Given data = [5, 0, -3, 1]:

| data[i] | -data[i] + 1 |
|---------|--------------|
| 5       | -4           |
| 0       | 1            |
| -3      | 4            |
| 1       | 0            |

Expected output:
\`\`\`
result[0] = -4
result[1] = 1
result[2] = 4
result[3] = 0
\`\`\`

Use \`parallel {i} by [4]\`: \`result[i] = -data[i] + 1\`.`,
  starterCode: `__co__ void parallel_invert() {
  global int data[4];
  global int result[4];

  parallel {i} by [1] {
    data[0] = 5; data[1] = 0; data[2] = -3; data[3] = 1;
  }

  // TODO: parallel {i} by [4] { result[i] = -data[i] + 1; }

  parallel {i} by [4] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = -4", description: "Two's complement of 5 is -4" },
    { expectedOutput: "result[1] = 1", description: "Two's complement of 0 is 1" },
    { expectedOutput: "result[2] = 4", description: "Two's complement of -3 is 4" },
    {
      expectedOutput: "result[0] = -4\nresult[1] = 1\nresult[2] = 4\nresult[3] = 0",
      description: "All two's complement inversions correct",
    },
  ],
  hint: "Inside parallel {i} by [4]: result[i] = -data[i] + 1 for each element.",
};
