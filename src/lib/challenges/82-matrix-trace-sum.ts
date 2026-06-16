import type { Challenge } from "./index";

export const challenge82: Challenge = {
  id: "c82",
  title: "Matrix Trace Sum",
  difficulty: "medium",
  description: `Sum the main and anti-diagonals of a 3×3 matrix.

Given matrix (row-major):
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

Main diagonal: M[0,0] + M[1,1] + M[2,2] = 1 + 5 + 9 = **15**
Anti-diagonal: M[0,2] + M[1,1] + M[2,0] = 3 + 5 + 7 = **15**

Expected output:
\`\`\`
main = 15
anti = 15
\`\`\`

Use \`foreach i in [0:3]\` to walk both diagonals in one loop.`,
  starterCode: `__co__ void matrix_trace_sum() {
  int N = 3;
  global int M[9];

  parallel {i} by [3] {
    parallel {j} by [3] {
      M[i * N + j] = i * N + j + 1;
    }
  }

  int main_sum = 0;
  int anti_sum = 0;

  foreach i in [0:3] {
    // TODO: main_sum += M[i * N + i]
    // TODO: anti_sum += M[i * N + (N - 1 - i)]
  }

  println("main =", main_sum);
  println("anti =", anti_sum);
}
`,
  tests: [
    { expectedOutput: "main = 15", description: "Main diagonal trace = 1+5+9 = 15" },
    { expectedOutput: "anti = 15", description: "Anti-diagonal sum = 3+5+7 = 15" },
    { expectedOutput: "main = 15\nanti = 15", description: "Both diagonal sums correct" },
  ],
  hint: "Main diagonal index: M[i * N + i]. Anti-diagonal index: M[i * N + (N - 1 - i)]. Accumulate both in the same foreach loop.",
};
