import type { Challenge } from "./index";

export const challenge68: Challenge = {
  id: "c68",
  title: "Matrix Diagonal Fill",
  difficulty: "medium",
  description: `Fill only the **main diagonal** of a 4×4 matrix with **1**, zeros elsewhere.

Expected matrix:
\`\`\`
M = [[1, 0, 0, 0],
     [0, 1, 0, 0],
     [0, 0, 1, 0],
     [0, 0, 0, 1]]
\`\`\`

Expected output:
\`\`\`
M[0, 0] = 1
M[0, 1] = 0
M[0, 2] = 0
M[0, 3] = 0
M[1, 0] = 0
M[1, 1] = 1
M[1, 2] = 0
M[1, 3] = 0
M[2, 0] = 0
M[2, 1] = 0
M[2, 2] = 1
M[2, 3] = 0
M[3, 0] = 0
M[3, 1] = 0
M[3, 2] = 0
M[3, 3] = 1
\`\`\`

Use \`parallel {i, j} by [4, 4]\` — set \`M[i, j] = 1\` when \`i == j\`, otherwise \`0\`.`,
  starterCode: `__co__ void matrix_diagonal_fill() {
  global int M[4, 4];

  // TODO: fill main diagonal with 1, zeros elsewhere
  // parallel {i, j} by [4, 4] {
  //   if (i == j) { M[i, j] = 1; } else { M[i, j] = 0; }
  // }

  parallel {i, j} by [4, 4] {
    println("M[", i, ", ", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0, 0] = 1", description: "Top-left diagonal is 1" },
    { expectedOutput: "M[0, 1] = 0", description: "Off-diagonal element is 0" },
    { expectedOutput: "M[2, 2] = 1", description: "Center diagonal is 1" },
    { expectedOutput: "M[3, 3] = 1", description: "Bottom-right diagonal is 1" },
    {
      expectedOutput: "M[0, 0] = 1\nM[0, 1] = 0\nM[0, 2] = 0\nM[0, 3] = 0\nM[1, 0] = 0\nM[1, 1] = 1\nM[1, 2] = 0\nM[1, 3] = 0\nM[2, 0] = 0\nM[2, 1] = 0\nM[2, 2] = 1\nM[2, 3] = 0\nM[3, 0] = 0\nM[3, 1] = 0\nM[3, 2] = 0\nM[3, 3] = 1",
      description: "Full 4×4 diagonal matrix",
    },
  ],
  hint: "Inside parallel {i, j} by [4, 4], use if (i == j) { M[i, j] = 1; } else { M[i, j] = 0; }.",
};
