import type { Challenge } from "./index";

export const challenge127: Challenge = {
  id: "c127",
  title: "Parallel Ceiling Division",
  difficulty: "easy",
  description: `Compute **ceil(a[i] / b)** for each element using \`parallel\`.

Given data = [7, 10, 13, 8, 15] and divisor **b = 3**:

| a[i] | ceil(a / 3) |
|------|-------------|
| 7    | 3           |
| 10   | 4           |
| 13   | 5           |
| 8    | 3           |
| 15   | 5           |

Expected output:
\`\`\`
result[0] = 3
result[1] = 4
result[2] = 5
result[3] = 3
result[4] = 5
\`\`\`

Use integer ceiling formula: \`(data[i] + b - 1) / b\`.`,
  starterCode: `__co__ void parallel_ceiling_division() {
  global int data[5];
  global int result[5];
  int b = 3;

  parallel {i} by [1] {
    data[0] = 7; data[1] = 10; data[2] = 13; data[3] = 8; data[4] = 15;
  }

  // TODO: result[i] = (data[i] + b - 1) / b in parallel {i} by [5]

  parallel {i} by [5] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 3", description: "ceil(7/3) = 3" },
    { expectedOutput: "result[1] = 4", description: "ceil(10/3) = 4" },
    { expectedOutput: "result[2] = 5", description: "ceil(13/3) = 5" },
    {
      expectedOutput: "result[0] = 3\nresult[1] = 4\nresult[2] = 5\nresult[3] = 3\nresult[4] = 5",
      description: "All ceiling division results correct",
    },
  ],
  hint: "parallel {i} by [5] { result[i] = (data[i] + b - 1) / b; } — integer formula for ceiling division.",
};
