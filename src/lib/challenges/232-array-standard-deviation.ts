import type { Challenge } from "./index";

export const challenge232: Challenge = {
  id: "c232",
  title: "Array Standard Deviation",
  difficulty: "hard",
  description: `Compute the **population standard deviation** of an array.

Given data = [0, 0, 0, 0, 10] (n = 5):

\`\`\`
mean = (0 + 0 + 0 + 0 + 10) / 5 = 2
variance = ((0-2)² + (0-2)² + (0-2)² + (0-2)² + (10-2)²) / 5
         = (4 + 4 + 4 + 4 + 64) / 5 = 16
std_dev = √16 = 4
\`\`\`

Expected output:
\`\`\`
std_dev = 4
\`\`\`

**Pass 1:** \`foreach\` to compute mean.
**Pass 2:** \`foreach\` to accumulate squared deviations and divide by n for variance.
**Pass 3:** integer square root of variance (Newton's method).`,
  starterCode: `__co__ void array_standard_deviation() {
  global int data[5];
  int n = 5;

  parallel {i} by [1] {
    data[0] = 0; data[1] = 0; data[2] = 0; data[3] = 0; data[4] = 10;
  }

  // TODO: foreach to compute mean
  // int sum = 0;
  // foreach i in [0:n] { sum = sum + data[i]; }
  // int mean = sum / n;

  // TODO: foreach to compute population variance
  // int var_sum = 0;
  // foreach i in [0:n] {
  //   int diff = data[i] - mean;
  //   var_sum = var_sum + diff * diff;
  // }
  // int variance = var_sum / n;

  // TODO: integer sqrt of variance via Newton's method
  int std_dev = 0;

  println("std_dev =", std_dev);
}
`,
  tests: [
    { expectedOutput: "std_dev = 4", description: "Population std dev of [0,0,0,0,10] is 4" },
  ],
  hint: "Compute mean, then variance = sum((data[i]-mean)²)/n, then sqrt variance with Newton: x = (x + variance/x) / 2 until stable.",
};
