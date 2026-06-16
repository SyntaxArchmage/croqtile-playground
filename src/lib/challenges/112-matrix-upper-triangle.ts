import type { Challenge } from "./index";

export const challenge112: Challenge = {
  id: "c112",
  title: "Matrix Upper Triangle",
  difficulty: "medium",
  description: `Extract and print the **upper triangular** elements (where \`i <= j\`) of a 4×4 matrix.

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12],
     [13, 14, 15, 16]]
\`\`\`

Upper triangle elements in row-major order: 1, 2, 3, 4, 6, 7, 8, 11, 12, 16.

Expected output:
\`\`\`
M[0,0] = 1
M[0,1] = 2
M[0,2] = 3
M[0,3] = 4
M[1,1] = 6
M[1,2] = 7
M[1,3] = 8
M[2,2] = 11
M[2,3] = 12
M[3,3] = 16
\`\`\`

Use \`parallel {i, j} by [4, 4]\` with \`if (i <= j)\` to print only upper-triangle cells.`,
  starterCode: `__co__ void matrix_upper_triangle() {
  global int M[4, 4];

  parallel {i, j} by [4, 4] {
    M[i, j] = i * 4 + j + 1;
  }

  // TODO: print cells where i <= j
  // parallel {i, j} by [4, 4] {
  //   if (i <= j) { println("M[", i, ",", j, "] =", M[i, j]); }
  // }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 1", description: "Top-left corner element" },
    { expectedOutput: "M[0,3] = 4", description: "Top-right corner element" },
    { expectedOutput: "M[1,1] = 6", description: "Interior upper-triangle element" },
    { expectedOutput: "M[3,3] = 16", description: "Bottom-right diagonal element" },
    {
      expectedOutput: "M[0,0] = 1\nM[0,1] = 2\nM[0,2] = 3\nM[0,3] = 4\nM[1,1] = 6\nM[1,2] = 7\nM[1,3] = 8\nM[2,2] = 11\nM[2,3] = 12\nM[3,3] = 16",
      description: "Full upper triangle in row-major order",
    },
  ],
  hint: "parallel {i, j} by [4, 4] with if (i <= j): println only cells on or above the main diagonal.",
};
