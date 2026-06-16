import type { Challenge } from "./index";

export const challenge22: Challenge = {
  id: "c22",
  title: "Matrix Column Sum",
  difficulty: "medium",
  description: `Given a 4×3 matrix, compute the sum of each column.

Matrix:
\`\`\`
 1   2   3
 4   5   6
 7   8   9
10  11  12
\`\`\`

Expected output:
\`\`\`
col[0] = 22
col[1] = 26
col[2] = 30
\`\`\`

Use 2D indexing and foreach reduction per column.`,
  starterCode: `__co__ void column_sum() {
  global float matrix[4, 3];
  global float col_sum[3];

  // Initialize matrix = [[1,2,3],[4,5,6],[7,8,9],[10,11,12]]
  parallel {i, j} by [4, 3] {
    matrix[i, j] = (float)(i * 3 + j + 1);
  }

  // TODO: initialize col_sum[j] = 0, then foreach over rows to accumulate

  parallel {j} by [3] {
    println("col[", j, "] =", col_sum[j]);
  }
}
`,
  tests: [
    { expectedOutput: "col[0] = 22", description: "Column 0 sum = 1+4+7+10 = 22" },
    { expectedOutput: "col[2] = 30", description: "Column 2 sum = 3+6+9+12 = 30" },
    { expectedOutput: "col[0] = 22\ncol[1] = 26\ncol[2] = 30", description: "All column sums correct" },
  ],
  hint: "Initialize column sums to 0, then use nested loops to accumulate matrix[i,j] into col_sum[j].",
};
