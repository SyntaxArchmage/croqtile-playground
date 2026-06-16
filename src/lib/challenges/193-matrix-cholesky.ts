import type { Challenge } from "./index";

export const challenge193: Challenge = {
  id: "c193",
  title: "Matrix Cholesky",
  difficulty: "hard",
  description: `Compute the **Cholesky decomposition** L of a 2×2 positive-definite matrix A, where **A = L × Lᵀ**.

Given:
\`\`\`
A = [[4, 2],
     [2, 5]]
\`\`\`

Cholesky factor (lower triangular):
\`\`\`
L = [[2, 0],
     [1, 2]]
\`\`\`

| L[i,j] | formula              | value |
|--------|----------------------|-------|
| L[0,0] | sqrt(A[0,0])         | 2     |
| L[1,0] | A[1,0] / L[0,0]      | 1     |
| L[1,1] | sqrt(A[1,1] - L[1,0]²) | 2   |

Expected output:
\`\`\`
L[0,0] = 2
L[1,0] = 1
L[1,1] = 2
\`\`\`

Compute L[0,0] first, then L[1,0], then L[1,1] sequentially.`,
  starterCode: `__co__ void matrix_cholesky() {
  global int A[2, 2];
  global int L[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 4; A[0, 1] = 2;
    A[1, 0] = 2; A[1, 1] = 5;
  }

  // TODO: compute Cholesky factor sequentially
  // L[0, 0] = 2;
  // L[1, 0] = A[1, 0] / L[0, 0];
  // L[1, 1] = 2;

  parallel {i, j} by [2, 2] {
    if (i >= j) {
      println("L[", i, ",", j, "] =", L[i, j]);
    }
  }
}
`,
  tests: [
    { expectedOutput: "L[0,0] = 2", description: "L[0,0] = sqrt(4) = 2" },
    { expectedOutput: "L[1,0] = 1", description: "L[1,0] = A[1,0]/L[0,0] = 2/2 = 1" },
    { expectedOutput: "L[1,1] = 2", description: "L[1,1] = sqrt(5 - 1) = 2" },
    {
      expectedOutput: "L[0,0] = 2\nL[1,0] = 1\nL[1,1] = 2",
      description: "Full Cholesky factor output",
    },
  ],
  hint: "L[0,0]=2. Then L[1,0]=A[1,0]/L[0,0]=1. Then L[1,1]=2 since A[1,1]-L[1,0]²=5-1=4 and sqrt(4)=2.",
};
