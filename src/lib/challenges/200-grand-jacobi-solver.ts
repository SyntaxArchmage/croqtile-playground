import type { Challenge } from "./index";

export const challenge200: Challenge = {
  id: "c200",
  title: "Grand Challenge: Jacobi Solver",
  difficulty: "hard",
  description: `Perform **one Jacobi iteration** to solve **Ax = b** using shared memory and DMA.

Given:
\`\`\`
A = [[2, 1],    b = [6, 6],    x⁽⁰⁾ = [0, 0]
     [1, 2]]
\`\`\`

Jacobi update: \`x_new[i] = (b[i] - Σⱼ≠ᵢ A[i,j]·x⁽⁰⁾[j]) / A[i,i]\`

- \`x_new[0] = (6 - 1×0) / 2 = 3\`
- \`x_new[1] = (6 - 1×0) / 2 = 3\`

Expected output:
\`\`\`
x[0] = 3
x[1] = 3
\`\`\`

**Steps:** DMA A, b, and x into shared memory, then \`parallel {i} by [2]\` to compute each Jacobi update.`,
  starterCode: `__co__ void grand_jacobi_solver() {
  global int A[2, 2];
  global int b[2];
  global int x[2];
  global int x_new[2];
  shared int s_A[2, 2];
  shared int s_b[2];
  shared int s_x[2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 2; A[0, 1] = 1;
    A[1, 0] = 1; A[1, 1] = 2;
  }
  parallel {i} by [1] {
    b[0] = 6; b[1] = 6;
    x[0] = 0; x[1] = 0;
  }

  // TODO: DMA A, b, x into shared arrays

  // TODO: parallel {i} by [2] {
  //   int sum = 0;
  //   foreach j in [0:2] {
  //     if (j != i) { sum = sum + s_A[i, j] * s_x[j]; }
  //   }
  //   x_new[i] = (s_b[i] - sum) / s_A[i, i];
  // }

  parallel {i} by [2] {
    println("x[", i, "] =", x_new[i]);
  }
}
`,
  tests: [
    { expectedOutput: "x[0] = 3", description: "Jacobi update: (6 - 1×0) / 2 = 3" },
    { expectedOutput: "x[1] = 3", description: "Jacobi update: (6 - 1×0) / 2 = 3" },
    {
      expectedOutput: "x[0] = 3\nx[1] = 3",
      description: "Full Jacobi iteration output",
    },
  ],
  hint: "DMA A, b, x into shared memory. Each thread i: sum off-diagonal A[i,j]*x[j], then x_new[i] = (b[i] - sum) / A[i,i].",
};
