import type { Challenge } from "./index";

export const challenge107: Challenge = {
  id: "c107",
  title: "Matrix Row Swap",
  difficulty: "easy",
  description: `Swap rows **0** and **2** of a 3×3 matrix using \`parallel\`.

Initial matrix:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

After swapping rows 0 and 2:
\`\`\`
M = [[7, 8, 9],
     [4, 5, 6],
     [1, 2, 3]]
\`\`\`

Use \`parallel {j} by [3]\` — each thread swaps one column element between row 0 and row 2 with a temporary variable.

Expected output:
\`\`\`
M[0,0] = 7
M[0,1] = 8
M[0,2] = 9
M[1,0] = 4
M[1,1] = 5
M[1,2] = 6
M[2,0] = 1
M[2,1] = 2
M[2,2] = 3
\`\`\``,
  starterCode: `__co__ void matrix_row_swap() {
  global int M[3, 3];

  parallel {i, j} by [3, 3] {
    M[i, j] = i * 3 + j + 1;
  }

  // TODO: swap rows 0 and 2 in parallel {j} by [3]
  // int tmp = M[0, j]; M[0, j] = M[2, j]; M[2, j] = tmp;

  parallel {i, j} by [3, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 7", description: "Row 0 now holds former row 2" },
    { expectedOutput: "M[2,0] = 1", description: "Row 2 now holds former row 0" },
    { expectedOutput: "M[1,1] = 5", description: "Middle row unchanged" },
    {
      expectedOutput: "M[0,0] = 7\nM[0,1] = 8\nM[0,2] = 9\nM[1,0] = 4\nM[1,1] = 5\nM[1,2] = 6\nM[2,0] = 1\nM[2,1] = 2\nM[2,2] = 3",
      description: "Full swapped matrix",
    },
  ],
  hint: "parallel {j} by [3]: save M[0,j] in tmp, copy M[2,j] to M[0,j], then write tmp to M[2,j]. Each column swaps independently.",
};
