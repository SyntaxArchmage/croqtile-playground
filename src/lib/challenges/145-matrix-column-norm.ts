import type { Challenge } from "./index";

export const challenge145: Challenge = {
  id: "c145",
  title: "Matrix Column Norm",
  difficulty: "hard",
  description: `Compute the **L2 norm** of each column in a 3×4 matrix: sum the squares of each column, then take the integer square root.

Given:
\`\`\`
  1   2   3   4
  5   6   7   8
  9  10  11  12
\`\`\`

Column sums of squares: 107, 140, 179, 224.

Expected output (integer square roots):
\`\`\`
col_norm[0] = 10
col_norm[1] = 11
col_norm[2] = 13
col_norm[3] = 14
\`\`\`

Use \`foreach\` to accumulate squares per column, then find the largest \`r\` with \`r * r <= sum\`.`,
  starterCode: `__co__ void matrix_column_norm() {
  global int matrix[3, 4];
  global int col_norm[4];

  parallel {i, j} by [3, 4] {
    matrix[i, j] = i * 4 + j + 1;
  }

  // TODO: foreach column j, sum squares then integer sqrt
  // foreach j in [0:4] {
  //   int sum_sq = 0;
  //   foreach i in [0:3] {
  //     int v = matrix[i, j];
  //     sum_sq = sum_sq + v * v;
  //   }
  //   int r = 0;
  //   foreach k in [1:sum_sq + 1] {
  //     if (k * k <= sum_sq) { r = k; }
  //   }
  //   col_norm[j] = r;
  // }

  parallel {j} by [4] {
    println("col_norm[", j, "] =", col_norm[j]);
  }
}
`,
  tests: [
    { expectedOutput: "col_norm[0] = 10", description: "Column 0 L2 norm = isqrt(107) = 10" },
    { expectedOutput: "col_norm[1] = 11", description: "Column 1 L2 norm = isqrt(140) = 11" },
    { expectedOutput: "col_norm[3] = 14", description: "Column 3 L2 norm = isqrt(224) = 14" },
    {
      expectedOutput: "col_norm[0] = 10\ncol_norm[1] = 11\ncol_norm[2] = 13\ncol_norm[3] = 14",
      description: "All column L2 norms correct",
    },
  ],
  hint: "foreach j: accumulate sum_sq from matrix[i,j]*matrix[i,j]. Then foreach k scan for largest k with k*k <= sum_sq. Store in col_norm[j].",
};
