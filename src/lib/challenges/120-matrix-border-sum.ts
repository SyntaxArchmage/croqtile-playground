import type { Challenge } from "./index";

export const challenge120: Challenge = {
  id: "c120",
  title: "Matrix Border Sum",
  difficulty: "medium",
  description: `Sum only the **border elements** of a 4×4 matrix using \`parallel\` and a shared accumulator.

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12],
     [13, 14, 15, 16]]
\`\`\`

Border elements: top row, bottom row, left column, right column (including corners once each).

Expected output:
\`\`\`
border_sum = 102
\`\`\`

A cell is on the border when \`i == 0 || i == 3 || j == 0 || j == 3\`. Use \`parallel {i, j} by [4, 4]\` with an \`if\` guard and accumulate into a shared sum.`,
  starterCode: `__co__ void matrix_border_sum() {
  global int M[4, 4];
  int border_sum = 0;

  parallel {i, j} by [4, 4] {
    M[i, j] = i * 4 + j + 1;
  }

  // TODO: sum border cells in parallel
  // parallel {i, j} by [4, 4] {
  //   if (i == 0 || i == 3 || j == 0 || j == 3) {
  //     border_sum = border_sum + M[i, j];
  //   }
  // }

  println("border_sum =", border_sum);
}
`,
  tests: [
    { expectedOutput: "border_sum = 102", description: "Sum of all 4×4 border elements is 102" },
  ],
  hint: "parallel {i, j} by [4, 4]: if on border (i==0 || i==3 || j==0 || j==3), add M[i,j] to border_sum.",
};
