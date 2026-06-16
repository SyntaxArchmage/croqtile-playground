import type { Challenge } from "./index";

export const challenge242: Challenge = {
  id: "c242",
  title: "Matrix Set Column",
  difficulty: "easy",
  description: `Set **column 1** of a 3×3 matrix to the constant value **5** using \`parallel\`.

Initial matrix:
\`\`\`
M = [[1, 0, 3],
     [4, 0, 6],
     [7, 0, 9]]
\`\`\`

After setting column 1 to 5:
\`\`\`
M = [[1, 5, 3],
     [4, 5, 6],
     [7, 5, 9]]
\`\`\`

Expected output:
\`\`\`
M[0,1] = 5
M[1,1] = 5
M[2,1] = 5
\`\`\`

Use \`parallel {i} by [3]\` to write each row in column 1.`,
  starterCode: `__co__ void matrix_set_column() {
  global int M[3, 3];
  int col = 1;
  int value = 5;

  parallel {i, j} by [3, 3] {
    M[0, 0] = 1; M[0, 1] = 0; M[0, 2] = 3;
    M[1, 0] = 4; M[1, 1] = 0; M[1, 2] = 6;
    M[2, 0] = 7; M[2, 1] = 0; M[2, 2] = 9;
  }

  // TODO: parallel {i} by [3] { M[i, col] = value; }

  parallel {i} by [3] {
    println("M[", i, ",", col, "] =", M[i, col]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,1] = 5", description: "Row 0 col 1 set to 5" },
    { expectedOutput: "M[1,1] = 5", description: "Row 1 col 1 set to 5" },
    { expectedOutput: "M[2,1] = 5", description: "Row 2 col 1 set to 5" },
    {
      expectedOutput: "M[0,1] = 5\nM[1,1] = 5\nM[2,1] = 5",
      description: "Full column 1 set to 5",
    },
  ],
  hint: "parallel {i} by [3] { M[i, col] = value; } — only touch column 1.",
};
