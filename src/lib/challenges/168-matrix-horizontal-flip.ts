import type { Challenge } from "./index";

export const challenge168: Challenge = {
  id: "c168",
  title: "Matrix Horizontal Flip",
  difficulty: "easy",
  description: `Flip a matrix **left-to-right** using \`parallel\`.

Initial 2×4 matrix:
\`\`\`
M = [[1, 2, 3, 4],
     [5, 6, 7, 8]]
\`\`\`

After horizontal flip:
\`\`\`
M = [[4, 3, 2, 1],
     [8, 7, 6, 5]]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 4
M[0,1] = 3
M[0,2] = 2
M[0,3] = 1
M[1,0] = 8
M[1,1] = 7
M[1,2] = 6
M[1,3] = 5
\`\`\`

Use \`parallel {i, j} by [2, 4]\` with \`M[i, j] = src[i, 3 - j]\`.`,
  starterCode: `__co__ void matrix_horizontal_flip() {
  global int src[2, 4];
  global int M[2, 4];

  parallel {i} by [1] {
    src[0, 0] = 1; src[0, 1] = 2; src[0, 2] = 3; src[0, 3] = 4;
    src[1, 0] = 5; src[1, 1] = 6; src[1, 2] = 7; src[1, 3] = 8;
  }

  // TODO: parallel {i, j} by [2, 4] { M[i, j] = src[i, 3 - j]; }

  parallel {i, j} by [2, 4] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 4", description: "Row 0 flipped: first column is 4" },
    { expectedOutput: "M[0,3] = 1", description: "Row 0 flipped: last column is 1" },
    { expectedOutput: "M[1,0] = 8", description: "Row 1 flipped: first column is 8" },
    {
      expectedOutput: "M[0,0] = 4\nM[0,1] = 3\nM[0,2] = 2\nM[0,3] = 1\nM[1,0] = 8\nM[1,1] = 7\nM[1,2] = 6\nM[1,3] = 5",
      description: "Full horizontally flipped matrix",
    },
  ],
  hint: "parallel {i, j} by [2, 4]: M[i, j] = src[i, 3 - j]. Column j mirrors around the center.",
};
