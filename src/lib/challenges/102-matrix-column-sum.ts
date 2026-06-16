import type { Challenge } from "./index";

export const challenge102: Challenge = {
  id: "c102",
  title: "Matrix Column Sum",
  difficulty: "medium",
  description: `Compute the sum of each column of a **3×4** matrix.

Matrix:
\`\`\`
 1   2   3   4
 5   6   7   8
 9  10  11  12
\`\`\`

Expected output:
\`\`\`
col[0] = 15
col[1] = 18
col[2] = 21
col[3] = 24
\`\`\`

Initialize each column sum to 0, then use \`foreach\` over rows to accumulate \`matrix[i, j]\` into \`col_sum[j]\`.`,
  starterCode: `__co__ void matrix_column_sum() {
  global int matrix[3, 4];
  global int col_sum[4];

  parallel {i, j} by [3, 4] {
    matrix[i, j] = i * 4 + j + 1;
  }

  // TODO: initialize col_sum[j] = 0, then foreach over rows to accumulate

  parallel {j} by [4] {
    println("col[", j, "] =", col_sum[j]);
  }
}
`,
  tests: [
    { expectedOutput: "col[0] = 15", description: "Column 0 sum = 1+5+9 = 15" },
    { expectedOutput: "col[1] = 18", description: "Column 1 sum = 2+6+10 = 18" },
    { expectedOutput: "col[3] = 24", description: "Column 3 sum = 4+8+12 = 24" },
    {
      expectedOutput: "col[0] = 15\ncol[1] = 18\ncol[2] = 21\ncol[3] = 24",
      description: "All column sums correct",
    },
  ],
  hint: "foreach j in [0:4] { col_sum[j] = 0; } then foreach i in [0:3] { foreach j in [0:4] { col_sum[j] = col_sum[j] + matrix[i, j]; } }",
};
