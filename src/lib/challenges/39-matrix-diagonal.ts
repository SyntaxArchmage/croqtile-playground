import type { Challenge } from "./index";

export const challenge39: Challenge = {
  id: "c39",
  title: "Matrix Anti-Diagonal",
  difficulty: "medium",
  description: `Extract the anti-diagonal of a 3×3 matrix.

The anti-diagonal consists of elements where \`row + col = N - 1\`:
M[0,2], M[1,1], M[2,0].

Given:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

Expected output:
\`\`\`
anti_diag[0] = 3
anti_diag[1] = 5
anti_diag[2] = 7
\`\`\`

Use \`parallel {i} by [3]\` — each thread reads M[i, 2 - i].`,
  starterCode: `__co__ void matrix_anti_diagonal() {
  global int M[3, 3];
  global int anti_diag[3];

  parallel {i, j} by [3, 3] {
    M[i, j] = i * 3 + j + 1;
  }

  // TODO: extract anti-diagonal
  // anti_diag[i] = M[i, 2 - i]

  parallel {i} by [3] {
    println("anti_diag[", i, "] =", anti_diag[i]);
  }
}
`,
  tests: [
    { expectedOutput: "anti_diag[0] = 3", description: "M[0,2] = 3" },
    { expectedOutput: "anti_diag[1] = 5", description: "M[1,1] = 5" },
    { expectedOutput: "anti_diag[2] = 7", description: "M[2,0] = 7" },
  ],
  hint: "The anti-diagonal of row i is at column (N-1-i). So anti_diag[i] = M[i, 2-i].",
};
