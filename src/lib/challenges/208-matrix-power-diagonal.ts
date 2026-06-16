import type { Challenge } from "./index";

export const challenge208: Challenge = {
  id: "c208",
  title: "Matrix Power Diagonal",
  difficulty: "hard",
  description: `Compute the **main diagonal of M×M** for a 2×2 matrix.

Given:
\`\`\`
M = [[1, 2],
     [3, 4]]
\`\`\`

First compute \`P = M × M\`:
\`\`\`
P = [[7,  10],
     [15, 22]]
\`\`\`

Then extract the main diagonal: \`diag[0] = P[0,0] = 7\`, \`diag[1] = P[1,1] = 22\`.

Expected output:
\`\`\`
diag[0] = 7
diag[1] = 22
\`\`\`

Use \`parallel {i, j} by [2, 2]\` with \`foreach k\` for the matrix multiply, then \`parallel {i} by [2]\` for the diagonal.`,
  starterCode: `__co__ void matrix_power_diagonal() {
  global int M[2, 2];
  global int P[2, 2];
  global int diag[2];

  parallel {i, j} by [2, 2] {
    M[0, 0] = 1; M[0, 1] = 2;
    M[1, 0] = 3; M[1, 1] = 4;
  }

  // TODO: parallel {i, j} by [2, 2] {
  //   int sum = 0;
  //   foreach k in [0:2] { sum = sum + M[i, k] * M[k, j]; }
  //   P[i, j] = sum;
  // }

  // TODO: parallel {i} by [2] { diag[i] = P[i, i]; }

  parallel {i} by [2] {
    println("diag[", i, "] =", diag[i]);
  }
}
`,
  tests: [
    { expectedOutput: "diag[0] = 7", description: "M×M diagonal[0] = 1×1 + 2×3 = 7" },
    { expectedOutput: "diag[1] = 22", description: "M×M diagonal[1] = 3×2 + 4×4 = 22" },
    {
      expectedOutput: "diag[0] = 7\ndiag[1] = 22",
      description: "Full main diagonal of M×M",
    },
  ],
  hint: "Square M with parallel {i,j} and foreach k reduction. Then diag[i] = P[i,i] in parallel {i} by [2].",
};
