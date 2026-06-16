import type { Challenge } from "./index";

export const challenge122: Challenge = {
  id: "c122",
  title: "Matrix Diagonal Sum",
  difficulty: "easy",
  description: `Sum both diagonals of a **4×4** matrix.

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12],
     [13, 14, 15, 16]]
\`\`\`

Main diagonal: 1 + 6 + 11 + 16 = **34**
Anti-diagonal: 4 + 7 + 10 + 13 = **34**

Expected output:
\`\`\`
main = 34
anti = 34
\`\`\`

Use \`foreach i in [0:4]\` — main uses \`M[i, i]\`, anti uses \`M[i, 3 - i]\`.`,
  starterCode: `__co__ void matrix_diagonal_sum() {
  global int M[4, 4];

  parallel {i, j} by [4, 4] {
    M[i, j] = i * 4 + j + 1;
  }

  int main_sum = 0;
  int anti_sum = 0;

  // TODO: foreach i in [0:4] accumulate M[i, i] and M[i, 3 - i]

  println("main =", main_sum);
  println("anti =", anti_sum);
}
`,
  tests: [
    { expectedOutput: "main = 34", description: "Main diagonal sum = 1+6+11+16" },
    { expectedOutput: "anti = 34", description: "Anti-diagonal sum = 4+7+10+13" },
    { expectedOutput: "main = 34\nanti = 34", description: "Both diagonal sums correct" },
  ],
  hint: "One foreach loop: main_sum += M[i,i]; anti_sum += M[i, 3-i].",
};
