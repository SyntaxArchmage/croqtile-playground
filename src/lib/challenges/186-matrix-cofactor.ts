import type { Challenge } from "./index";

export const challenge186: Challenge = {
  id: "c186",
  title: "Matrix Cofactor",
  difficulty: "hard",
  description: `Compute the **cofactor matrix** of a 2×2 matrix.

Given:
\`\`\`
A = [[2, 1],
     [3, 4]]
\`\`\`

Cofactor formula: \`C[i,j] = (-1)^(i+j) × A[1-i, 1-j]\`

| C[i,j] | sign | value |
|--------|------|-------|
| C[0,0] | +    | 4     |
| C[0,1] | -    | -3    |
| C[1,0] | -    | -1    |
| C[1,1] | +    | 2     |

Expected output:
\`\`\`
C[0,0] = 4
C[0,1] = -3
C[1,0] = -1
C[1,1] = 2
\`\`\`

Use \`parallel {i, j} by [2, 2]\` with sign flips based on \`(i + j) % 2\`.`,
  starterCode: `__co__ void matrix_cofactor() {
  global int A[2, 2];
  global int C[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 2; A[0, 1] = 1;
    A[1, 0] = 3; A[1, 1] = 4;
  }

  // TODO: parallel {i, j} by [2, 2] {
  //   int minor = A[1 - i, 1 - j];
  //   if ((i + j) % 2 == 0) { C[i, j] = minor; }
  //   else { C[i, j] = -minor; }
  // }

  parallel {i, j} by [2, 2] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0,0] = 4", description: "Cofactor C[0,0] = +A[1,1] = 4" },
    { expectedOutput: "C[0,1] = -3", description: "Cofactor C[0,1] = -A[1,0] = -3" },
    { expectedOutput: "C[1,0] = -1", description: "Cofactor C[1,0] = -A[0,1] = -1" },
    { expectedOutput: "C[1,1] = 2", description: "Cofactor C[1,1] = +A[0,0] = 2" },
    {
      expectedOutput: "C[0,0] = 4\nC[0,1] = -3\nC[1,0] = -1\nC[1,1] = 2",
      description: "Full 2×2 cofactor matrix output",
    },
  ],
  hint: "Each thread (i,j): minor = A[1-i, 1-j]. If (i+j) is even, C[i,j]=minor; else C[i,j]=-minor.",
};
