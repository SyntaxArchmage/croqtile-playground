import type { Challenge } from "./index";

export const challenge209: Challenge = {
  id: "c209",
  title: "Array Weighted Sum",
  difficulty: "medium",
  description: `Compute the **weighted sum** of an array using a weights array.

Given:
- values = [2, 3, 4]
- weights = [1, 2, 3]

\`weighted_sum = Σ values[i] × weights[i] = 2×1 + 3×2 + 4×3 = 20\`

Expected output:
\`\`\`
weighted_sum = 20
\`\`\`

Use a sequential \`foreach\` loop to accumulate the product at each index.`,
  starterCode: `__co__ void array_weighted_sum() {
  global int values[3];
  global int weights[3];

  parallel {i} by [1] {
    values[0] = 2; values[1] = 3; values[2] = 4;
    weights[0] = 1; weights[1] = 2; weights[2] = 3;
  }

  int weighted_sum = 0;

  // TODO: foreach i in [0:3] {
  //   weighted_sum = weighted_sum + values[i] * weights[i];
  // }

  println("weighted_sum =", weighted_sum);
}
`,
  tests: [
    {
      expectedOutput: "weighted_sum = 20",
      description: "2×1 + 3×2 + 4×3 = 20",
    },
  ],
  hint: "Initialize weighted_sum to 0. foreach i in [0:3]: weighted_sum += values[i] * weights[i].",
};
