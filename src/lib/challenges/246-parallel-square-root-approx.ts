import type { Challenge } from "./index";

export const challenge246: Challenge = {
  id: "c246",
  title: "Parallel Square Root Approx",
  difficulty: "medium",
  description: `Approximate **√x** for each element using **Newton's method** in \`parallel\`.

Given data = [4, 9, 16, 25] (perfect squares):

| data[i] | √data[i] |
|---------|----------|
| 4       | 2        |
| 9       | 3        |
| 16      | 4        |
| 25      | 5        |

**Newton iteration:** \`x_{n+1} = (x_n + data[i] / x_n) / 2\`, starting from \`x = data[i] / 2 + 1\`. Run 5 iterations.

Expected output:
\`\`\`
sqrt[0] = 2
sqrt[1] = 3
sqrt[2] = 4
sqrt[3] = 5
\`\`\``,
  starterCode: `__co__ void parallel_square_root_approx() {
  global int data[4];
  global int sqrt[4];

  parallel {i} by [1] {
    data[0] = 4; data[1] = 9; data[2] = 16; data[3] = 25;
  }

  // TODO: parallel {i} by [4] {
  //   int x = data[i] / 2 + 1;
  //   foreach iter in [0:5] {
  //     x = (x + data[i] / x) / 2;
  //   }
  //   sqrt[i] = x;
  // }

  parallel {i} by [4] {
    println("sqrt[", i, "] =", sqrt[i]);
  }
}
`,
  tests: [
    { expectedOutput: "sqrt[0] = 2", description: "√4 ≈ 2" },
    { expectedOutput: "sqrt[1] = 3", description: "√9 ≈ 3" },
    { expectedOutput: "sqrt[2] = 4", description: "√16 ≈ 4" },
    { expectedOutput: "sqrt[3] = 5", description: "√25 ≈ 5" },
    {
      expectedOutput: "sqrt[0] = 2\nsqrt[1] = 3\nsqrt[2] = 4\nsqrt[3] = 5",
      description: "All Newton sqrt approximations correct",
    },
  ],
  hint: "Inside parallel {i} by [4]: start x = data[i]/2+1, iterate x = (x + data[i]/x)/2 five times with foreach, store in sqrt[i].",
};
