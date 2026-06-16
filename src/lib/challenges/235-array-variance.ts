import type { Challenge } from "./index";

export const challenge235: Challenge = {
  id: "c235",
  title: "Array Variance",
  difficulty: "hard",
  description: `Compute the **population variance** of an array.

Given data = [2, 4, 6, 8, 10] (n = 5):

\`\`\`
mean = (2 + 4 + 6 + 8 + 10) / 5 = 6
variance = ((2-6)² + (4-6)² + (6-6)² + (8-6)² + (10-6)²) / 5
         = (16 + 4 + 0 + 4 + 16) / 5 = 8
\`\`\`

Expected output:
\`\`\`
variance = 8
\`\`\`

**Pass 1:** \`foreach\` to compute mean.
**Pass 2:** \`foreach\` to accumulate squared deviations and divide by n.`,
  starterCode: `__co__ void array_variance() {
  global int data[5];
  int n = 5;

  parallel {i} by [1] {
    data[0] = 2; data[1] = 4; data[2] = 6; data[3] = 8; data[4] = 10;
  }

  // TODO: foreach to compute mean
  // int sum = 0;
  // foreach i in [0:n] { sum = sum + data[i]; }
  // int mean = sum / n;

  int variance = 0;
  // TODO: foreach to compute population variance
  // int var_sum = 0;
  // foreach i in [0:n] {
  //   int diff = data[i] - mean;
  //   var_sum = var_sum + diff * diff;
  // }
  // variance = var_sum / n;

  println("variance =", variance);
}
`,
  tests: [
    { expectedOutput: "variance = 8", description: "Population variance of [2,4,6,8,10] is 8" },
  ],
  hint: "Compute mean with foreach, then variance = sum((data[i]-mean)²)/n with a second foreach pass.",
};
