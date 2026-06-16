import type { Challenge } from "./index";

export const challenge72: Challenge = {
  id: "c72",
  title: "Matrix Add",
  difficulty: "easy",
  description: `Add two 2×2 matrices element-wise using \`parallel\`.

\`\`\`
A = [[1, 2],    B = [[5, 6],    C = A + B
     [3, 4]]         [7, 8]]
\`\`\`

Expected output:
\`\`\`
C[0,0] = 6
C[0,1] = 8
C[1,0] = 10
C[1,1] = 12
\`\`\`

Use \`parallel {i, j} by [2, 2]\` so each thread computes one element of C.`,
  starterCode: `__co__ void matrix_add() {
  global int A[2, 2];
  global int B[2, 2];
  global int C[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 1; A[0, 1] = 2; A[1, 0] = 3; A[1, 1] = 4;
    B[0, 0] = 5; B[0, 1] = 6; B[1, 0] = 7; B[1, 1] = 8;
  }

  // TODO: C[i, j] = A[i, j] + B[i, j] in parallel

  parallel {i, j} by [2, 2] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0,0] = 6", description: "Top-left: 1 + 5 = 6" },
    { expectedOutput: "C[1,1] = 12", description: "Bottom-right: 4 + 8 = 12" },
    {
      expectedOutput: "C[0,0] = 6\nC[0,1] = 8\nC[1,0] = 10\nC[1,1] = 12",
      description: "Full 2×2 matrix add output",
    },
  ],
  hint: "Launch parallel {i, j} by [2, 2] and assign C[i, j] = A[i, j] + B[i, j]. Each thread handles one matrix cell.",
};
