import type { Challenge } from "./index";

export const challenge60: Challenge = {
  id: "c60",
  title: "Matrix Row Norm",
  difficulty: "medium",
  description: `Compute the **L1 norm** (sum of absolute values) of each row in a 2×4 matrix.

Initialize the matrix:
\`\`\`
M = [  1, -2,  3, -4,
       5,  6, -7,  8 ]
\`\`\`

Row 0: |1| + |-2| + |3| + |-4| = **10**
Row 1: |5| + |6| + |-7| + |8| = **26**

Print each result as: \`row_norm[i] = <value>\``,
  starterCode: `__co__ void matrix_row_norm() {
  global int M[2, 4];
  global int row_norm[2];

  parallel {i} by [1] {
    M[0, 0] = 1;  M[0, 1] = -2; M[0, 2] = 3;  M[0, 3] = -4;
    M[1, 0] = 5;  M[1, 1] = 6;  M[1, 2] = -7; M[1, 3] = 8;
  }

  // TODO: compute L1 norm of each row
  // foreach i in [0:2] {
  //   int sum = 0;
  //   foreach j in [0:4] {
  //     int v = M[i, j];
  //     if (v < 0) sum = sum + (-v);
  //     else sum = sum + v;
  //   }
  //   row_norm[i] = sum;
  // }

  parallel {i} by [2] {
    println("row_norm[", i, "] =", row_norm[i]);
  }
}
`,
  tests: [
    { expectedOutput: "row_norm[0] = 10", description: "Row 0 L1 norm is 10" },
    { expectedOutput: "row_norm[1] = 26", description: "Row 1 L1 norm is 26" },
    {
      expectedOutput: "row_norm[0] = 10\nrow_norm[1] = 26",
      description: "Both row norms correct",
    },
  ],
  hint: "Use nested foreach over rows and columns. For each element, add its absolute value: if v < 0, add -v; otherwise add v.",
};
