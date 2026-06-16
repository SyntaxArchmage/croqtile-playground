import type { Challenge } from "./index";

export const challenge26: Challenge = {
  id: "c26",
  title: "Diagonal Sum",
  difficulty: "medium",
  description: `Compute the sum of both diagonals of a 3x3 matrix.

Given matrix:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

The main diagonal is M[0,0] + M[1,1] + M[2,2] = 1 + 5 + 9 = 15.
The anti-diagonal is M[0,2] + M[1,1] + M[2,0] = 3 + 5 + 7 = 15.

Expected output:
\`\`\`
main = 15
anti = 15
\`\`\`

Use \`foreach\` to iterate over the diagonal indices.`,
  starterCode: `__co__ void diagonal_sum() {
  int N = 3;
  global int M[9];

  // Initialize 3x3 matrix: M[row*3+col] = row*3 + col + 1
  parallel {i} by [3] {
    parallel {j} by [3] {
      M[i * 3 + j] = i * 3 + j + 1;
    }
  }

  int main_sum = 0;
  int anti_sum = 0;

  foreach i in [0:3] {
    // TODO: accumulate main diagonal: M[i * N + i]
    // TODO: accumulate anti-diagonal: M[i * N + (N - 1 - i)]
  }

  println("main =", main_sum);
  println("anti =", anti_sum);
}
`,
  tests: [
    { expectedOutput: "main = 15", description: "Main diagonal sum = 1+5+9 = 15" },
    { expectedOutput: "anti = 15", description: "Anti-diagonal sum = 3+5+7 = 15" },
    { expectedOutput: "main = 15\nanti = 15", description: "Both diagonal sums correct" },
  ],
  hint: "Main diagonal: M[i * N + i]. Anti-diagonal: M[i * N + (N - 1 - i)]. Both use the same loop variable i.",
};
