import type { Challenge } from "./index";

export const challenge142: Challenge = {
  id: "c142",
  title: "Matrix Row Max",
  difficulty: "medium",
  description: `Find the **maximum element in each row** of a 3×4 matrix.

Given:
\`\`\`
M = [[3, 7,  2,  9],
     [1, 8,  4,  5],
     [6, 2, 10,  3]]
\`\`\`

Expected output:
\`\`\`
row_max[0] = 9
row_max[1] = 8
row_max[2] = 10
\`\`\`

Use \`foreach\` over each row to track the running maximum.`,
  starterCode: `__co__ void matrix_row_max() {
  global int M[3, 4];
  global int row_max[3];

  parallel {i} by [1] {
    M[0, 0] = 3;  M[0, 1] = 7;  M[0, 2] = 2;  M[0, 3] = 9;
    M[1, 0] = 1;  M[1, 1] = 8;  M[1, 2] = 4;  M[1, 3] = 5;
    M[2, 0] = 6;  M[2, 1] = 2;  M[2, 2] = 10; M[2, 3] = 3;
  }

  // TODO: foreach row i, scan columns to find row_max[i]
  // foreach i in [0:3] {
  //   int best = M[i, 0];
  //   foreach j in [1:4] { if (M[i, j] > best) best = M[i, j]; }
  //   row_max[i] = best;
  // }

  parallel {i} by [3] {
    println("row_max[", i, "] =", row_max[i]);
  }
}
`,
  tests: [
    { expectedOutput: "row_max[0] = 9", description: "Row 0 max is 9" },
    { expectedOutput: "row_max[1] = 8", description: "Row 1 max is 8" },
    { expectedOutput: "row_max[2] = 10", description: "Row 2 max is 10" },
    {
      expectedOutput: "row_max[0] = 9\nrow_max[1] = 8\nrow_max[2] = 10",
      description: "All row maxima correct",
    },
  ],
  hint: "foreach i in [0:3]: start best = M[i,0], then foreach j in [1:4] update best when M[i,j] is larger. Store best in row_max[i].",
};
