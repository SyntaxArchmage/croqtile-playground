import type { Challenge } from "./index";

export const challenge64: Challenge = {
  id: "c64",
  title: "Matrix Column Swap",
  difficulty: "medium",
  description: `Swap columns **0** and **1** of a 2×3 matrix.

Initial matrix:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6]]
\`\`\`

After swapping columns 0 and 1:
\`\`\`
M = [[2, 1, 3],
     [5, 4, 6]]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 2
M[0,1] = 1
M[0,2] = 3
M[1,0] = 5
M[1,1] = 4
M[1,2] = 6
\`\`\`

Use a \`foreach\` loop over rows — swap \`M[i, 0]\` and \`M[i, 1]\` with a temporary variable.`,
  starterCode: `__co__ void matrix_column_swap() {
  global float M[2, 3];

  parallel {i, j} by [2, 3] {
    M[0, 0] = 1.0f; M[0, 1] = 2.0f; M[0, 2] = 3.0f;
    M[1, 0] = 4.0f; M[1, 1] = 5.0f; M[1, 2] = 6.0f;
  }

  // TODO: swap columns 0 and 1 for each row
  // foreach i in [0:2] {
  //   float tmp = M[i, 0];
  //   M[i, 0] = M[i, 1];
  //   M[i, 1] = tmp;
  // }

  parallel {i, j} by [2, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 2", description: "Column 0 now holds former column 1" },
    { expectedOutput: "M[0,1] = 1", description: "Column 1 now holds former column 0" },
    { expectedOutput: "M[1,0] = 5", description: "Second row column 0 swapped" },
    {
      expectedOutput: "M[0,0] = 2\nM[0,1] = 1\nM[0,2] = 3\nM[1,0] = 5\nM[1,1] = 4\nM[1,2] = 6",
      description: "Full swapped matrix",
    },
  ],
  hint: "foreach i in [0:2]: save M[i,0] in tmp, copy M[i,1] to M[i,0], then tmp to M[i,1].",
};
