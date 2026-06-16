import type { Challenge } from "./index";

export const challenge138: Challenge = {
  id: "c138",
  title: "Matrix Saddle Point",
  difficulty: "hard",
  description: `Find **saddle points** in a 3×3 matrix — elements that are the **minimum in their row** and the **maximum in their column**.

Given:
\`\`\`
M = [[6, 7, 8],
     [1, 5, 9],
     [2, 3, 4]]
\`\`\`

M[0,0] = 6 is the row-0 minimum and the column-0 maximum → saddle point.

Expected output:
\`\`\`
saddle_count = 1
saddle[0] row = 0 col = 0 value = 6
\`\`\`

Use \`parallel {i, j}\` to test each cell: \`foreach\` over its row for the minimum and \`foreach\` over its column for the maximum.`,
  starterCode: `__co__ void matrix_saddle_point() {
  global int M[3, 3];
  global int saddle_row[9];
  global int saddle_col[9];
  global int saddle_val[9];
  int saddle_count = 0;

  parallel {i, j} by [3, 3] {
    M[0, 0] = 6; M[0, 1] = 7; M[0, 2] = 8;
    M[1, 0] = 1; M[1, 1] = 5; M[1, 2] = 9;
    M[2, 0] = 2; M[2, 1] = 3; M[2, 2] = 4;
  }

  // TODO: parallel {i, j} test each cell
  // int row_min = M[i, 0];
  // foreach k in [1:3] { if (M[i, k] < row_min) row_min = M[i, k]; }
  // int col_max = M[0, j];
  // foreach k in [1:3] { if (M[k, j] > col_max) col_max = M[k, j]; }
  // if (M[i, j] == row_min && M[i, j] == col_max) {
  //   int idx = saddle_count;
  //   saddle_count = saddle_count + 1;
  //   saddle_row[idx] = i; saddle_col[idx] = j; saddle_val[idx] = M[i, j];
  // }

  println("saddle_count =", saddle_count);
  foreach k in [0:saddle_count] {
    println("saddle[", k, "] row =", saddle_row[k], "col =", saddle_col[k], "value =", saddle_val[k]);
  }
}
`,
  tests: [
    { expectedOutput: "saddle_count = 1", description: "One saddle point in the matrix" },
    { expectedOutput: "saddle[0] row = 0 col = 0 value = 6", description: "Saddle at (0,0) with value 6" },
    {
      expectedOutput: "saddle_count = 1\nsaddle[0] row = 0 col = 0 value = 6",
      description: "Full saddle point output",
    },
  ],
  hint: "Each thread (i,j): foreach k scan row i for min and column j for max. If M[i,j] equals both, append to saddle arrays using saddle_count as index.",
};
