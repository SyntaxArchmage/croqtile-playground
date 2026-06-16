import type { Challenge } from "./index";

export const challenge117: Challenge = {
  id: "c117",
  title: "Matrix Identity Check",
  difficulty: "hard",
  description: `Check whether a 3×3 matrix is the **identity matrix** — 1 on the diagonal and 0 elsewhere.

Given:
\`\`\`
M = [[1, 0, 0],
     [0, 2, 0],
     [0, 0, 1]]
\`\`\`

Element \`M[1,1] = 2\` should be 1, so the matrix is **not** identity.

Expected output:
\`\`\`
is_identity = false
\`\`\`

Use \`foreach\` loops over \`i\` and \`j\`: diagonal entries must be 1, off-diagonal entries must be 0.`,
  starterCode: `__co__ void matrix_identity_check() {
  global int M[3, 3];

  parallel {i, j} by [1, 1] {
    M[0, 0] = 1; M[0, 1] = 0; M[0, 2] = 0;
    M[1, 0] = 0; M[1, 1] = 2; M[1, 2] = 0;
    M[2, 0] = 0; M[2, 1] = 0; M[2, 2] = 1;
  }

  // TODO: check identity with foreach and a flag
  // bool is_identity = true;
  // foreach i in [0:3] {
  //   foreach j in [0:3] {
  //     if (i == j && M[i, j] != 1) is_identity = false;
  //     if (i != j && M[i, j] != 0) is_identity = false;
  //   }
  // }

  // println("is_identity =", is_identity);
}
`,
  tests: [
    {
      expectedOutput: "is_identity = false",
      description: "Should detect M[1,1] = 2 and report false",
    },
  ],
  hint: "Start with is_identity = true. foreach i and j: require M[i,j]==1 when i==j, and M[i,j]==0 when i!=j.",
};
