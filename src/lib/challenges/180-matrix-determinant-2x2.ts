import type { Challenge } from "./index";

export const challenge180: Challenge = {
  id: "c180",
  title: "Matrix Determinant 2×2",
  difficulty: "medium",
  description: `Compute the **determinant** of a 2×2 matrix.

Given:
\`\`\`
A = [[4, 2],
     [1, 3]]
\`\`\`

Formula: \`det = A[0,0] × A[1,1] - A[0,1] × A[1,0]\`

\`det = 4 × 3 - 2 × 1 = 10\`

Expected output:
\`\`\`
det = 10
\`\`\`

Read the four matrix elements and apply the determinant formula.`,
  starterCode: `__co__ void matrix_determinant_2x2() {
  global int A[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 4; A[0, 1] = 2;
    A[1, 0] = 1; A[1, 1] = 3;
  }

  int det = 0;

  // TODO: det = A[0,0] * A[1,1] - A[0,1] * A[1,0];

  println("det =", det);
}
`,
  tests: [
    {
      expectedOutput: "det = 10",
      description: "2×2 determinant: 4×3 - 2×1 = 10",
    },
  ],
  hint: "Compute det = A[0,0] * A[1,1] - A[0,1] * A[1,0] after initializing the matrix.",
};
