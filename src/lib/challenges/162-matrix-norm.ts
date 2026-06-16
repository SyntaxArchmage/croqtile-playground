import type { Challenge } from "./index";

export const challenge162: Challenge = {
  id: "c162",
  title: "Matrix Norm",
  difficulty: "medium",
  description: `Compute the **Frobenius norm** of a 3×3 matrix: sum all squared elements, then take the integer square root.

Given:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

Sum of squares = 1 + 4 + 9 + 16 + 25 + 36 + 49 + 64 + 81 = **285**.

Integer square root: largest \`r\` with \`r * r <= 285\` → **16** (since 16² = 256 and 17² = 289).

Expected output:
\`\`\`
norm = 16
\`\`\`

Use \`foreach\` to accumulate squares, then scan for the integer square root.`,
  starterCode: `__co__ void matrix_norm() {
  global int M[3, 3];
  int sum_sq = 0;

  parallel {i, j} by [3, 3] {
    M[i, j] = i * 3 + j + 1;
  }

  int norm = 0;

  // TODO: foreach i,j accumulate sum_sq += M[i,j] * M[i,j]
  // TODO: find largest r with r*r <= sum_sq and store in norm

  println("norm =", norm);
}
`,
  tests: [
    {
      expectedOutput: "norm = 16",
      description: "Frobenius norm = isqrt(285) = 16",
    },
  ],
  hint: "foreach i,j: sum_sq += M[i,j]*M[i,j]. Then foreach k scan for largest k with k*k <= sum_sq and print that k as norm.",
};
