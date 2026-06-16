import type { Challenge } from "./index";

export const challenge205: Challenge = {
  id: "c205",
  title: "Matrix Hadamard",
  difficulty: "medium",
  description: `Compute the **Hadamard (element-wise) product** of two 2×2 matrices using \`parallel\`.

Given:
\`\`\`
A = [[1, 2],    B = [[5, 6],    C[i,j] = A[i,j] × B[i,j]
     [3, 4]]         [7, 8]]
\`\`\`

| C[i,j] | computation | value |
|--------|-------------|-------|
| C[0,0] | 1 × 5       | 5     |
| C[0,1] | 2 × 6       | 12    |
| C[1,0] | 3 × 7       | 21    |
| C[1,1] | 4 × 8       | 32    |

Expected output:
\`\`\`
C[0,0] = 5
C[0,1] = 12
C[1,0] = 21
C[1,1] = 32
\`\`\``,
  starterCode: `__co__ void matrix_hadamard() {
  global int A[2, 2];
  global int B[2, 2];
  global int C[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 1; A[0, 1] = 2; A[1, 0] = 3; A[1, 1] = 4;
    B[0, 0] = 5; B[0, 1] = 6; B[1, 0] = 7; B[1, 1] = 8;
  }

  // TODO: parallel {i, j} by [2, 2] {
  //   C[i, j] = A[i, j] * B[i, j];
  // }

  parallel {i, j} by [2, 2] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0,0] = 5", description: "Hadamard C[0,0] = 1×5 = 5" },
    { expectedOutput: "C[0,1] = 12", description: "Hadamard C[0,1] = 2×6 = 12" },
    { expectedOutput: "C[1,0] = 21", description: "Hadamard C[1,0] = 3×7 = 21" },
    { expectedOutput: "C[1,1] = 32", description: "Hadamard C[1,1] = 4×8 = 32" },
    {
      expectedOutput: "C[0,0] = 5\nC[0,1] = 12\nC[1,0] = 21\nC[1,1] = 32",
      description: "Full 2×2 Hadamard product output",
    },
  ],
  hint: "parallel {i, j} by [2, 2] { C[i, j] = A[i, j] * B[i, j]; } — multiply matching positions, no reduction needed.",
};
