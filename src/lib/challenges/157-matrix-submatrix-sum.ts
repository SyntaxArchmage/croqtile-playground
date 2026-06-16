import type { Challenge } from "./index";

export const challenge157: Challenge = {
  id: "c157",
  title: "Matrix Submatrix Sum",
  difficulty: "medium",
  description: `Sum a **2×2 submatrix** of a **4×4** matrix starting at row **1**, column **2**.

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12],
     [13, 14, 15, 16]]
\`\`\`

Submatrix at (row=1, col=2):
\`\`\`
 7   8
11  12
\`\`\`

Sum = 7 + 8 + 11 + 12 = **38**.

Expected output:
\`\`\`
sum = 38
\`\`\`

Use \`foreach\` over the 2×2 block: \`M[row + dr, col + dc]\` for dr, dc in [0:2].`,
  starterCode: `__co__ void matrix_submatrix_sum() {
  global int M[4, 4];
  int row = 1;
  int col = 2;

  parallel {i, j} by [4, 4] {
    M[i, j] = i * 4 + j + 1;
  }

  int sum = 0;

  // TODO: foreach dr in [0:2] {
  //   foreach dc in [0:2] {
  //     sum = sum + M[row + dr, col + dc];
  //   }
  // }

  println("sum =", sum);
}
`,
  tests: [
    {
      expectedOutput: "sum = 38",
      description: "2×2 submatrix at (1,2) sums to 7+8+11+12 = 38",
    },
  ],
  hint: "Nested foreach over dr and dc in [0:2]: sum += M[row + dr, col + dc].",
};
