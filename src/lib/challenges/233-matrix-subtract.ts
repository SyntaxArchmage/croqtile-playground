import type { Challenge } from "./index";

export const challenge233: Challenge = {
  id: "c233",
  title: "Matrix Subtract",
  difficulty: "easy",
  description: `Subtract two 3×3 matrices element-wise using \`parallel\`.

\`\`\`
A = [[9, 8, 7],    B = [[1, 2, 3],    C = A - B
     [6, 5, 4],         [4, 5, 6],
     [3, 2, 1]]         [7, 8, 9]]
\`\`\`

Expected output:
\`\`\`
C[0,0] = 8
C[1,1] = 0
C[2,2] = -8
\`\`\`

Use \`parallel {i, j} by [3, 3]\` so each thread computes one element of C.`,
  starterCode: `__co__ void matrix_subtract() {
  global int A[3, 3];
  global int B[3, 3];
  global int C[3, 3];

  parallel {i, j} by [3, 3] {
    A[0, 0] = 9; A[0, 1] = 8; A[0, 2] = 7;
    A[1, 0] = 6; A[1, 1] = 5; A[1, 2] = 4;
    A[2, 0] = 3; A[2, 1] = 2; A[2, 2] = 1;
    B[0, 0] = 1; B[0, 1] = 2; B[0, 2] = 3;
    B[1, 0] = 4; B[1, 1] = 5; B[1, 2] = 6;
    B[2, 0] = 7; B[2, 1] = 8; B[2, 2] = 9;
  }

  // TODO: C[i, j] = A[i, j] - B[i, j] in parallel

  parallel {i, j} by [3, 3] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0,0] = 8", description: "Top-left: 9 - 1 = 8" },
    { expectedOutput: "C[1,1] = 0", description: "Center: 5 - 5 = 0" },
    { expectedOutput: "C[2,2] = -8", description: "Bottom-right: 1 - 9 = -8" },
    {
      expectedOutput: "C[0,0] = 8\nC[0,1] = 6\nC[0,2] = 4\nC[1,0] = 2\nC[1,1] = 0\nC[1,2] = -2\nC[2,0] = -4\nC[2,1] = -6\nC[2,2] = -8",
      description: "Full 3×3 matrix subtract output",
    },
  ],
  hint: "Launch parallel {i, j} by [3, 3] and assign C[i, j] = A[i, j] - B[i, j]. Each thread handles one matrix cell.",
};
