import type { Challenge } from "./index";

export const challenge110: Challenge = {
  id: "c110",
  title: "Matrix Lower Triangle",
  difficulty: "medium",
  description: `Extract and print the **lower triangular** elements (where \`i >= j\`) of a 3×3 matrix.

Given:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

Lower triangle elements in row-major order: 1, 4, 5, 7, 8, 9.

Expected output:
\`\`\`
M[0,0] = 1
M[1,0] = 4
M[1,1] = 5
M[2,0] = 7
M[2,1] = 8
M[2,2] = 9
\`\`\`

Use \`parallel {i, j} by [3, 3]\` with \`if (i >= j)\` to print only lower-triangle cells.`,
  starterCode: `__co__ void matrix_lower_triangle() {
  global int M[3, 3];

  parallel {i, j} by [3, 3] {
    M[i, j] = i * 3 + j + 1;
  }

  // TODO: print cells where i >= j
  // parallel {i, j} by [3, 3] {
  //   if (i >= j) { println("M[", i, ",", j, "] =", M[i, j]); }
  // }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 1", description: "Diagonal element at top-left" },
    { expectedOutput: "M[1,1] = 5", description: "Interior lower-triangle element" },
    { expectedOutput: "M[2,2] = 9", description: "Bottom-right diagonal element" },
    {
      expectedOutput: "M[0,0] = 1\nM[1,0] = 4\nM[1,1] = 5\nM[2,0] = 7\nM[2,1] = 8\nM[2,2] = 9",
      description: "Full lower triangle in row-major order",
    },
  ],
  hint: "parallel {i, j} by [3, 3] with if (i >= j): println only cells on or below the main diagonal.",
};
