import type { Challenge } from "./index";

export const challenge32: Challenge = {
  id: "c32",
  title: "Matrix Multiply",
  difficulty: "hard",
  description: `Multiply two 2×2 matrices.

\`\`\`
A = [[1, 2],    B = [[5, 6],    C = A × B
     [3, 4]]         [7, 8]]
\`\`\`

Expected output:
\`\`\`
C[0,0] = 19
C[0,1] = 22
C[1,0] = 43
C[1,1] = 50
\`\`\`

Use \`parallel {i, j}\` for the outer dimensions and \`foreach k\` for the inner dot-product reduction.`,
  starterCode: `__co__ void matrix_multiply() {
  global float A[2, 2];
  global float B[2, 2];
  global float C[2, 2];

  // Initialize A = [[1,2],[3,4]] and B = [[5,6],[7,8]]
  parallel {i, j} by [2, 2] {
    A[0, 0] = 1.0f; A[0, 1] = 2.0f; A[1, 0] = 3.0f; A[1, 1] = 4.0f;
    B[0, 0] = 5.0f; B[0, 1] = 6.0f; B[1, 0] = 7.0f; B[1, 1] = 8.0f;
  }

  // TODO: parallel {i, j} with foreach k reduction
  // float sum = 0.0f;
  // foreach k in [0:2] { sum = sum + A[i, k] * B[k, j]; }
  // C[i, j] = sum;

  parallel {i, j} by [2, 2] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0,0] = 19", description: "Top-left: 1*5 + 2*7 = 19" },
    { expectedOutput: "C[0,1] = 22", description: "Top-right: 1*6 + 2*8 = 22" },
    { expectedOutput: "C[1,0] = 43", description: "Bottom-left: 3*5 + 4*7 = 43" },
    { expectedOutput: "C[1,1] = 50", description: "Bottom-right: 3*6 + 4*8 = 50" },
    {
      expectedOutput: "C[0,0] = 19\nC[0,1] = 22\nC[1,0] = 43\nC[1,1] = 50",
      description: "Full 2×2 matrix multiply output",
    },
  ],
  hint: "Each thread (i, j) accumulates sum over k: sum += A[i,k] * B[k,j]. The inner k loop must be foreach, not parallel.",
};
