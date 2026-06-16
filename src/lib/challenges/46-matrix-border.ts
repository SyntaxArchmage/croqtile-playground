import type { Challenge } from "./index";

export const challenge46: Challenge = {
  id: "c46",
  title: "Matrix Border",
  difficulty: "medium",
  description: `Print only the border elements of a 3×3 matrix using \`parallel\` and conditionals.

Given:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

The center element M[1,1] = 5 is **not** border. Print every border cell as \`M[row,col] = value\`.

Expected output:
\`\`\`
M[0,0] = 1
M[0,1] = 2
M[0,2] = 3
M[1,0] = 4
M[1,2] = 6
M[2,0] = 7
M[2,1] = 8
M[2,2] = 9
\`\`\`

A cell is on the border when \`i == 0 || i == 2 || j == 0 || j == 2\`.`,
  starterCode: `__co__ void matrix_border() {
  global int M[3, 3];

  parallel {i, j} by [3, 3] {
    M[i, j] = i * 3 + j + 1;
  }

  // TODO: print border cells only
  // parallel {i, j} by [3, 3] {
  //   if (i == 0 || i == 2 || j == 0 || j == 2) {
  //     println("M[", i, ",", j, "] =", M[i, j]);
  //   }
  // }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 1", description: "Top-left corner" },
    { expectedOutput: "M[1,2] = 6", description: "Right edge (not corner)" },
    { expectedOutput: "M[2,2] = 9", description: "Bottom-right corner" },
    {
      expectedOutput: "M[0,0] = 1\nM[0,1] = 2\nM[0,2] = 3\nM[1,0] = 4\nM[1,2] = 6\nM[2,0] = 7\nM[2,1] = 8\nM[2,2] = 9",
      description: "Full border output in row-major order",
    },
  ],
  hint: "Use nested parallel {i, j} with an if guard: only println when the cell lies on the outer ring of the 3×3 grid.",
};
