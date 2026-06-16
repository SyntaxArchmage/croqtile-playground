import type { Challenge } from "./index";

export const challenge199: Challenge = {
  id: "c199",
  title: "Matrix Eigenvalue 2×2",
  difficulty: "hard",
  description: `Compute the **eigenvalues** of a 2×2 matrix using the characteristic equation.

Given:
\`\`\`
A = [[4, 1],
     [2, 3]]
\`\`\`

For a 2×2 matrix: \`λ² - trace(A)·λ + det(A) = 0\`

- trace = 4 + 3 = **7**
- det = 4×3 - 1×2 = **10**
- discriminant = 7² - 4×10 = **9**, sqrt = **3**
- λ₁ = (7 + 3) / 2 = **5**, λ₂ = (7 - 3) / 2 = **2**

Expected output:
\`\`\`
lambda1 = 5
lambda2 = 2
\`\`\`

Compute trace, determinant, discriminant, and the two eigenvalues.`,
  starterCode: `__co__ void matrix_eigenvalue_2x2() {
  global int A[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 4; A[0, 1] = 1;
    A[1, 0] = 2; A[1, 1] = 3;
  }

  int trace = 0;
  int det = 0;
  int lambda1 = 0;
  int lambda2 = 0;

  // TODO: trace = A[0,0] + A[1,1];
  // TODO: det = A[0,0] * A[1,1] - A[0,1] * A[1,0];
  // TODO: discriminant = trace * trace - 4 * det;
  // TODO: sqrt_disc = 3;  (sqrt of 9)
  // TODO: lambda1 = (trace + sqrt_disc) / 2;
  // TODO: lambda2 = (trace - sqrt_disc) / 2;

  println("lambda1 =", lambda1);
  println("lambda2 =", lambda2);
}
`,
  tests: [
    { expectedOutput: "lambda1 = 5", description: "Larger eigenvalue is 5" },
    { expectedOutput: "lambda2 = 2", description: "Smaller eigenvalue is 2" },
    { expectedOutput: "lambda1 = 5\nlambda2 = 2", description: "Both eigenvalues correct" },
  ],
  hint: "trace = A[0,0]+A[1,1]. det = A[0,0]*A[1,1]-A[0,1]*A[1,0]. discriminant = trace²-4*det = 9. lambda1=(7+3)/2=5, lambda2=(7-3)/2=2.",
};
