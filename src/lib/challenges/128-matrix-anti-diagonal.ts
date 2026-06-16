import type { Challenge } from "./index";

export const challenge128: Challenge = {
  id: "c128",
  title: "Matrix Anti-Diagonal",
  difficulty: "medium",
  description: `Extract the **anti-diagonal** of a 4×4 matrix.

The anti-diagonal consists of elements where \`row + col = N - 1\`:
M[0,3], M[1,2], M[2,1], M[3,0].

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12],
     [13, 14, 15, 16]]
\`\`\`

Expected output:
\`\`\`
anti_diag[0] = 4
anti_diag[1] = 7
anti_diag[2] = 10
anti_diag[3] = 13
\`\`\`

Use \`parallel {i} by [4]\` — each thread reads \`M[i, 3 - i]\`.`,
  starterCode: `__co__ void matrix_anti_diagonal() {
  global int M[4, 4];
  global int anti_diag[4];

  parallel {i, j} by [4, 4] {
    M[i, j] = i * 4 + j + 1;
  }

  // TODO: extract anti-diagonal
  // parallel {i} by [4] { anti_diag[i] = M[i, 3 - i]; }

  parallel {i} by [4] {
    println("anti_diag[", i, "] =", anti_diag[i]);
  }
}
`,
  tests: [
    { expectedOutput: "anti_diag[0] = 4", description: "M[0,3] = 4" },
    { expectedOutput: "anti_diag[1] = 7", description: "M[1,2] = 7" },
    { expectedOutput: "anti_diag[2] = 10", description: "M[2,1] = 10" },
    { expectedOutput: "anti_diag[3] = 13", description: "M[3,0] = 13" },
    {
      expectedOutput: "anti_diag[0] = 4\nanti_diag[1] = 7\nanti_diag[2] = 10\nanti_diag[3] = 13",
      description: "Full anti-diagonal output",
    },
  ],
  hint: "The anti-diagonal of row i is at column (N-1-i). So anti_diag[i] = M[i, 3-i].",
};
