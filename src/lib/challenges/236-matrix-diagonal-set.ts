import type { Challenge } from "./index";

export const challenge236: Challenge = {
  id: "c236",
  title: "Matrix Diagonal Set",
  difficulty: "easy",
  description: `Set all **main diagonal** elements of a 3×3 matrix to the value **7**, leaving off-diagonal entries unchanged.

Initial matrix (off-diagonals are 0):
\`\`\`
M = [[0, 0, 0],
     [0, 0, 0],
     [0, 0, 0]]
\`\`\`

After setting the diagonal to 7:
\`\`\`
M = [[7, 0, 0],
     [0, 7, 0],
     [0, 0, 7]]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 7
M[1,1] = 7
M[2,2] = 7
\`\`\`

Use \`parallel {i} by [3]\` — each thread sets \`M[i, i] = 7\`.`,
  starterCode: `__co__ void matrix_diagonal_set() {
  global int M[3, 3];
  int value = 7;

  parallel {i, j} by [3, 3] {
    M[i, j] = 0;
  }

  // TODO: parallel {i} by [3] { M[i, i] = value; }

  parallel {i} by [3] {
    println("M[", i, ",", i, "] =", M[i, i]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 7", description: "Top-left diagonal set to 7" },
    { expectedOutput: "M[1,1] = 7", description: "Center diagonal set to 7" },
    { expectedOutput: "M[2,2] = 7", description: "Bottom-right diagonal set to 7" },
    {
      expectedOutput: "M[0,0] = 7\nM[1,1] = 7\nM[2,2] = 7",
      description: "All diagonal elements set to 7",
    },
  ],
  hint: "parallel {i} by [3] { M[i, i] = value; } — each thread writes one diagonal entry.",
};
