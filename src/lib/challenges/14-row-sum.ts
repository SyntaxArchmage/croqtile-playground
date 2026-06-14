import type { Challenge } from "./index";

export const challenge14: Challenge = {
  id: "ch14",
  title: "Row Sum",
  difficulty: "medium",
  description: `Compute the sum of each row in a 4x4 matrix.

Initialize matrix[i,j] = i * 4 + j + 1, then compute the sum of each row.

Print each result as: row_sum[i] = <value>`,
  starterCode: `__co__ void row_sum() {
  global float matrix[4, 4];
  global float row_sum[4];

  parallel {i, j} by [4, 4] {
    matrix[i, j] = (float)(i * 4 + j + 1);
  }

  // TODO: compute sum of each row
  // row_sum[i] = matrix[i,0] + matrix[i,1] + matrix[i,2] + matrix[i,3]

  parallel {i} by [4] {
    println("row_sum[", i, "] =", row_sum[i]);
  }
}
`,
  tests: [
    { description: "row_sum[0] = 10 (1+2+3+4)", expectedOutput: "row_sum[0] = 10" },
    { description: "row_sum[1] = 26 (5+6+7+8)", expectedOutput: "row_sum[1] = 26" },
    { description: "row_sum[3] = 58 (13+14+15+16)", expectedOutput: "row_sum[3] = 58" },
  ],
  hint: "For each row i, use foreach j in [0:4] to accumulate matrix[i,j] into row_sum[i].",
};
