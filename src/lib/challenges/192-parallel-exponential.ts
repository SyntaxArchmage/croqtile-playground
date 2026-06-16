import type { Challenge } from "./index";

export const challenge192: Challenge = {
  id: "c192",
  title: "Parallel Exponential",
  difficulty: "medium",
  description: `Approximate **e^x** using the Taylor series **1 + x + x²/2 + x³/6** for each element using \`parallel\`.

Given x = [1, 2, 3] (integer arithmetic):

| x | 1 + x + x²/2 + x³/6 |
|---|---------------------|
| 1 | 1 + 1 + 0 + 0 = 2     |
| 2 | 1 + 2 + 2 + 1 = 6     |
| 3 | 1 + 3 + 4 + 4 = 12    |

Expected output:
\`\`\`
exp[0] = 2
exp[1] = 6
exp[2] = 12
\`\`\`

Use \`parallel {i} by [3]\` to compute each Taylor approximation with integer division.`,
  starterCode: `__co__ void parallel_exponential() {
  global int x[3];
  global int exp[3];

  parallel {i} by [1] {
    x[0] = 1; x[1] = 2; x[2] = 3;
  }

  // TODO: parallel {i} by [3] {
  //   int xi = x[i];
  //   int x2 = xi * xi;
  //   int x3 = x2 * xi;
  //   exp[i] = 1 + xi + x2 / 2 + x3 / 6;
  // }

  parallel {i} by [3] {
    println("exp[", i, "] =", exp[i]);
  }
}
`,
  tests: [
    { expectedOutput: "exp[0] = 2", description: "e^1 ≈ 1 + 1 + 0 + 0 = 2" },
    { expectedOutput: "exp[1] = 6", description: "e^2 ≈ 1 + 2 + 2 + 1 = 6" },
    { expectedOutput: "exp[2] = 12", description: "e^3 ≈ 1 + 3 + 4 + 4 = 12" },
    {
      expectedOutput: "exp[0] = 2\nexp[1] = 6\nexp[2] = 12",
      description: "All Taylor exponential approximations correct",
    },
  ],
  hint: "Inside parallel {i} by [3]: compute xi=x[i], x2=xi*xi, x3=x2*xi, then exp[i]=1+xi+x2/2+x3/6.",
};
