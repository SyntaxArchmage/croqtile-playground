import type { Challenge } from "./index";

export const challenge228: Challenge = {
  id: "c228",
  title: "Parallel Floor Division",
  difficulty: "easy",
  description: `Compute **floor(data[i] / b)** for each element using \`parallel\` and integer division.

Given data = [7, 10, 13, 8, 15] and divisor **b = 3**:

| data[i] | floor(data / 3) |
|---------|-----------------|
| 7       | 2               |
| 10      | 3               |
| 13      | 4               |
| 8       | 2               |
| 15      | 5               |

Expected output:
\`\`\`
result[0] = 2
result[1] = 3
result[2] = 4
result[3] = 2
result[4] = 5
\`\`\`

Integer division \`data[i] / b\` truncates toward zero, which equals floor for positive operands.`,
  starterCode: `__co__ void parallel_floor_division() {
  global int data[5];
  global int result[5];
  int b = 3;

  parallel {i} by [1] {
    data[0] = 7; data[1] = 10; data[2] = 13; data[3] = 8; data[4] = 15;
  }

  // TODO: result[i] = data[i] / b in parallel {i} by [5]

  parallel {i} by [5] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 2", description: "floor(7/3) = 2" },
    { expectedOutput: "result[1] = 3", description: "floor(10/3) = 3" },
    { expectedOutput: "result[2] = 4", description: "floor(13/3) = 4" },
    {
      expectedOutput: "result[0] = 2\nresult[1] = 3\nresult[2] = 4\nresult[3] = 2\nresult[4] = 5",
      description: "All floor division results correct",
    },
  ],
  hint: "parallel {i} by [5] { result[i] = data[i] / b; } — integer division is floor for positive values.",
};
