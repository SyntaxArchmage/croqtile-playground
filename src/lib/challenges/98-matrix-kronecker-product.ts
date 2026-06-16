import type { Challenge } from "./index";

export const challenge98: Challenge = {
  id: "c98",
  title: "Matrix Kronecker Product",
  difficulty: "hard",
  description: `Compute the **Kronecker product** of two 2×2 matrices.

Given:
\`\`\`
A = [[1, 2],    B = [[5, 6],
     [3, 4]]          [7, 8]]
\`\`\`

The result K = A ⊗ B is a 4×4 matrix where each entry of A is scaled by the entire matrix B:
\`\`\`
 5   6  10  12
 7   8  14  16
15  18  20  24
21  24  28  32
\`\`\`

Formula: \`K[i, j] = A[i / 2, j / 2] * B[i % 2, j % 2]\` (integer division).

Expected output:
\`\`\`
K[0,0] = 5
K[0,1] = 6
K[0,2] = 10
K[0,3] = 12
K[1,0] = 7
K[1,1] = 8
K[1,2] = 14
K[1,3] = 16
K[2,0] = 15
K[2,1] = 18
K[2,2] = 20
K[2,3] = 24
K[3,0] = 21
K[3,1] = 24
K[3,2] = 28
K[3,3] = 32
\`\`\`

Use \`parallel {i, j} by [4, 4]\` — each thread writes one output cell.`,
  starterCode: `__co__ void matrix_kronecker_product() {
  global int A[2, 2];
  global int B[2, 2];
  global int K[4, 4];

  parallel {i, j} by [1, 1] {
    A[0, 0] = 1; A[0, 1] = 2;
    A[1, 0] = 3; A[1, 1] = 4;
    B[0, 0] = 5; B[0, 1] = 6;
    B[1, 0] = 7; B[1, 1] = 8;
  }

  // TODO: parallel {i, j} by [4, 4] { K[i, j] = A[i / 2, j / 2] * B[i % 2, j % 2]; }

  parallel {i, j} by [4, 4] {
    println("K[", i, ",", j, "] =", K[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "K[0,0] = 5", description: "A[0,0] * B[0,0] = 1 * 5 = 5" },
    { expectedOutput: "K[1,2] = 14", description: "A[0,1] * B[1,0] = 2 * 7 = 14" },
    { expectedOutput: "K[3,3] = 32", description: "A[1,1] * B[1,1] = 4 * 8 = 32" },
    {
      expectedOutput: "K[0,0] = 5\nK[0,1] = 6\nK[0,2] = 10\nK[0,3] = 12\nK[1,0] = 7\nK[1,1] = 8\nK[1,2] = 14\nK[1,3] = 16\nK[2,0] = 15\nK[2,1] = 18\nK[2,2] = 20\nK[2,3] = 24\nK[3,0] = 21\nK[3,1] = 24\nK[3,2] = 28\nK[3,3] = 32",
      description: "Full 4×4 Kronecker product output",
    },
  ],
  hint: "Each thread (i, j) maps to A row i/2, A col j/2 and B row i%2, B col j%2. Multiply the two entries for K[i, j].",
};
