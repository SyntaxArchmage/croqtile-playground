import type { Challenge } from "./index";

export const challenge172: Challenge = {
  id: "c172",
  title: "Matrix Vertical Flip",
  difficulty: "easy",
  description: `Flip a matrix **top-to-bottom** using \`parallel\`.

Initial 2×4 matrix:
\`\`\`
M = [[1, 2, 3, 4],
     [5, 6, 7, 8]]
\`\`\`

After vertical flip:
\`\`\`
M = [[5, 6, 7, 8],
     [1, 2, 3, 4]]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 5
M[0,1] = 6
M[0,2] = 7
M[0,3] = 8
M[1,0] = 1
M[1,1] = 2
M[1,2] = 3
M[1,3] = 4
\`\`\`

Use \`parallel {i, j} by [2, 4]\` with \`M[i, j] = src[1 - i, j]\`.`,
  starterCode: `__co__ void matrix_vertical_flip() {
  global int src[2, 4];
  global int M[2, 4];

  parallel {i} by [1] {
    src[0, 0] = 1; src[0, 1] = 2; src[0, 2] = 3; src[0, 3] = 4;
    src[1, 0] = 5; src[1, 1] = 6; src[1, 2] = 7; src[1, 3] = 8;
  }

  // TODO: parallel {i, j} by [2, 4] { M[i, j] = src[1 - i, j]; }

  parallel {i, j} by [2, 4] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 5", description: "Row 0 becomes former row 1" },
    { expectedOutput: "M[1,0] = 1", description: "Row 1 becomes former row 0" },
    { expectedOutput: "M[0,3] = 8", description: "Top-right after flip is 8" },
    {
      expectedOutput: "M[0,0] = 5\nM[0,1] = 6\nM[0,2] = 7\nM[0,3] = 8\nM[1,0] = 1\nM[1,1] = 2\nM[1,2] = 3\nM[1,3] = 4",
      description: "Full vertically flipped matrix",
    },
  ],
  hint: "parallel {i, j} by [2, 4]: M[i, j] = src[1 - i, j]. Row i mirrors around the horizontal center.",
};
