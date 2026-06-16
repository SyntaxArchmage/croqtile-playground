import type { Challenge } from "./index";

export const challenge227: Challenge = {
  id: "c227",
  title: "Matrix Scale Row",
  difficulty: "easy",
  description: `Scale **row 1** of a 3×3 matrix by the constant **2** using \`parallel\`.

Initial matrix:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

After scaling row 1 by 2:
\`\`\`
M = [[1,  2,  3],
     [8, 10, 12],
     [7,  8,  9]]
\`\`\`

Expected output:
\`\`\`
M[1,0] = 8
M[1,1] = 10
M[1,2] = 12
\`\`\`

Use \`parallel {j} by [3]\` to multiply each element in row 1.`,
  starterCode: `__co__ void matrix_scale_row() {
  global int M[3, 3];
  int row = 1;
  int factor = 2;

  parallel {i, j} by [3, 3] {
    M[0, 0] = 1; M[0, 1] = 2; M[0, 2] = 3;
    M[1, 0] = 4; M[1, 1] = 5; M[1, 2] = 6;
    M[2, 0] = 7; M[2, 1] = 8; M[2, 2] = 9;
  }

  // TODO: parallel {j} by [3] { M[row, j] = M[row, j] * factor; }

  parallel {j} by [3] {
    println("M[", row, ",", j, "] =", M[row, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[1,0] = 8", description: "Row 1 col 0: 4 × 2 = 8" },
    { expectedOutput: "M[1,1] = 10", description: "Row 1 col 1: 5 × 2 = 10" },
    { expectedOutput: "M[1,2] = 12", description: "Row 1 col 2: 6 × 2 = 12" },
    {
      expectedOutput: "M[1,0] = 8\nM[1,1] = 10\nM[1,2] = 12",
      description: "Full scaled row 1",
    },
  ],
  hint: "parallel {j} by [3] { M[row, j] = M[row, j] * factor; } — only touch row 1.",
};
