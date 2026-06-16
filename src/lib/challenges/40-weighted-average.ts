import type { Challenge } from "./index";

export const challenge40: Challenge = {
  id: "c40",
  title: "Weighted Average",
  difficulty: "hard",
  description: `Compute the weighted average of an array.

Given:
- values = [10, 20, 30, 40]
- weights = [1, 2, 3, 4]

weighted_avg = sum(values[i] * weights[i]) / sum(weights[i])
            = (10 + 40 + 90 + 160) / (1 + 2 + 3 + 4)
            = 300 / 10
            = 30

Expected output:
\`\`\`
weighted_avg = 30
\`\`\`

Use two sequential \`foreach\` reductions: one for the weighted sum, one for the total weight.`,
  starterCode: `__co__ void weighted_average() {
  global int values[4];
  global int weights[4];

  parallel {i} by [4] {
    values[i] = (i + 1) * 10;
    weights[i] = i + 1;
  }

  // TODO: compute weighted sum and total weight
  // float wsum = 0.0f;
  // float wtotal = 0.0f;
  // foreach i in [0:4] {
  //   wsum = wsum + (float)values[i] * (float)weights[i];
  //   wtotal = wtotal + (float)weights[i];
  // }
  // float avg = wsum / wtotal;
  // println("weighted_avg =", (int)avg);
}
`,
  tests: [
    {
      expectedOutput: "weighted_avg = 30",
      description: "Weighted average of [10,20,30,40] with weights [1,2,3,4]",
    },
  ],
  hint: "Accumulate values[i]*weights[i] and weights[i] in two separate foreach loops (or one loop with two accumulators). Divide at the end.",
};
