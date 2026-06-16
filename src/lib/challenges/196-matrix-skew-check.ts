import type { Challenge } from "./index";

export const challenge196: Challenge = {
  id: "c196",
  title: "Matrix Skew Check",
  difficulty: "hard",
  description: `Check whether a 3×3 matrix is **skew-symmetric**: \`A[i,j] = -A[j,i]\` for all i, j.

Given:
\`\`\`
A = [[ 0,  2, -1],
     [-2,  0,  3],
     [ 1, -3,  0]]
\`\`\`

Verify \`A[i,j] + A[j,i] = 0\` for all pairs.

Expected output:
\`\`\`
is_skew = true
\`\`\`

Use nested \`foreach\` loops to check every off-diagonal pair.`,
  starterCode: `__co__ void matrix_skew_check() {
  global int A[3, 3];

  parallel {i, j} by [3, 3] {
    A[0, 0] = 0; A[0, 1] = 2; A[0, 2] = -1;
    A[1, 0] = -2; A[1, 1] = 0; A[1, 2] = 3;
    A[2, 0] = 1; A[2, 1] = -3; A[2, 2] = 0;
  }

  bool is_skew = true;

  // TODO: foreach i in [0:3] {
  //   foreach j in [0:3] {
  //     if (A[i, j] + A[j, i] != 0) { is_skew = false; }
  //   }
  // }

  println("is_skew =", is_skew);
}
`,
  tests: [
    {
      expectedOutput: "is_skew = true",
      description: "Matrix satisfies A[i,j] = -A[j,i] for all pairs",
    },
  ],
  hint: "Initialize is_skew = true. foreach i,j in [0:3]: if A[i,j] + A[j,i] != 0, set is_skew = false.",
};
