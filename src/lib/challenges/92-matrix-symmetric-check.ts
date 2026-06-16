import type { Challenge } from "./index";

export const challenge92: Challenge = {
  id: "c92",
  title: "Matrix Symmetric Check",
  difficulty: "medium",
  description: `Check whether a 3×3 matrix is **symmetric** — every off-diagonal pair satisfies \`A[i][j] == A[j][i]\`.

Given:
\`\`\`
1  2  3
4  5  6
7  8  9
\`\`\`

Element \`A[1,0] = 4\` does not equal \`A[0,1] = 2\`, so the matrix is not symmetric.

Expected output:
\`\`\`
is_symmetric = false
\`\`\`

Use \`foreach\` loops over \`i\` and \`j\` (with \`j > i\`) to compare mirrored entries. Set a flag to \`false\` on the first mismatch.`,
  starterCode: `__co__ void matrix_symmetric_check() {
  global int A[3, 3];

  parallel {i, j} by [1, 1] {
    A[0, 0] = 1; A[0, 1] = 2; A[0, 2] = 3;
    A[1, 0] = 4; A[1, 1] = 5; A[1, 2] = 6;
    A[2, 0] = 7; A[2, 1] = 8; A[2, 2] = 9;
  }

  // TODO: check symmetry with foreach and a flag
  // bool is_symmetric = true;
  // foreach i in [0:3] {
  //   foreach j in [0:3] {
  //     if (j > i && A[i, j] != A[j, i]) is_symmetric = false;
  //   }
  // }

  // println("is_symmetric =", is_symmetric);
}
`,
  tests: [
    {
      expectedOutput: "is_symmetric = false",
      description: "Should detect A[1,0] != A[0,1] and report false",
    },
  ],
  hint: "Start with is_symmetric = true. foreach i and j — when j > i, if A[i,j] != A[j,i], set the flag to false.",
};
