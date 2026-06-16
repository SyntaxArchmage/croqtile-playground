import type { Challenge } from "./index";

export const challenge230: Challenge = {
  id: "c230",
  title: "Matrix Add",
  difficulty: "easy",
  description: `Add two 3×3 matrices element-wise using \`parallel\`.

\`\`\`
A = [[1, 2, 3],    B = [[9, 8, 7],    C = A + B
     [4, 5, 6],         [6, 5, 4],
     [7, 8, 9]]         [3, 2, 1]]
\`\`\`

Expected output:
\`\`\`
C[0,0] = 10
C[1,1] = 10
C[2,2] = 10
\`\`\`

Use \`parallel {i, j} by [3, 3]\` so each thread computes one element of C.`,
  starterCode: `__co__ void matrix_add() {
  global int A[3, 3];
  global int B[3, 3];
  global int C[3, 3];

  parallel {i, j} by [3, 3] {
    A[0, 0] = 1; A[0, 1] = 2; A[0, 2] = 3;
    A[1, 0] = 4; A[1, 1] = 5; A[1, 2] = 6;
    A[2, 0] = 7; A[2, 1] = 8; A[2, 2] = 9;
    B[0, 0] = 9; B[0, 1] = 8; B[0, 2] = 7;
    B[1, 0] = 6; B[1, 1] = 5; B[1, 2] = 4;
    B[2, 0] = 3; B[2, 1] = 2; B[2, 2] = 1;
  }

  // TODO: C[i, j] = A[i, j] + B[i, j] in parallel

  parallel {i, j} by [3, 3] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0,0] = 10", description: "Top-left: 1 + 9 = 10" },
    { expectedOutput: "C[1,1] = 10", description: "Center: 5 + 5 = 10" },
    { expectedOutput: "C[2,2] = 10", description: "Bottom-right: 9 + 1 = 10" },
    {
      expectedOutput: "C[0,0] = 10\nC[0,1] = 10\nC[0,2] = 10\nC[1,0] = 10\nC[1,1] = 10\nC[1,2] = 10\nC[2,0] = 10\nC[2,1] = 10\nC[2,2] = 10",
      description: "Full 3×3 matrix add output",
    },
  ],
  hint: "Launch parallel {i, j} by [3, 3] and assign C[i, j] = A[i, j] + B[i, j]. Each thread handles one matrix cell.",
};
