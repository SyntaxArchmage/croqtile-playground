import type { Challenge } from "./index";

export const challenge239: Challenge = {
  id: "c239",
  title: "Matrix Set Row",
  difficulty: "easy",
  description: `Set **row 2** of a 3×3 matrix to the constant value **9** using \`parallel\`.

Initial matrix:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 0]]
\`\`\`

After setting row 2 to 9:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [9, 9, 9]]
\`\`\`

Expected output:
\`\`\`
M[2,0] = 9
M[2,1] = 9
M[2,2] = 9
\`\`\`

Use \`parallel {j} by [3]\` to write each column in row 2.`,
  starterCode: `__co__ void matrix_set_row() {
  global int M[3, 3];
  int row = 2;
  int value = 9;

  parallel {i, j} by [3, 3] {
    M[0, 0] = 1; M[0, 1] = 2; M[0, 2] = 3;
    M[1, 0] = 4; M[1, 1] = 5; M[1, 2] = 6;
    M[2, 0] = 7; M[2, 1] = 8; M[2, 2] = 0;
  }

  // TODO: parallel {j} by [3] { M[row, j] = value; }

  parallel {j} by [3] {
    println("M[", row, ",", j, "] =", M[row, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[2,0] = 9", description: "Row 2 col 0 set to 9" },
    { expectedOutput: "M[2,1] = 9", description: "Row 2 col 1 set to 9" },
    { expectedOutput: "M[2,2] = 9", description: "Row 2 col 2 set to 9" },
    {
      expectedOutput: "M[2,0] = 9\nM[2,1] = 9\nM[2,2] = 9",
      description: "Full row 2 set to 9",
    },
  ],
  hint: "parallel {j} by [3] { M[row, j] = value; } — only touch row 2.",
};
