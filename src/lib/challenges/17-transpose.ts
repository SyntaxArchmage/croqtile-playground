import type { Challenge } from "./index";

export const challenge17: Challenge = {
  id: "c17",
  title: "Matrix Transpose",
  difficulty: "medium",
  description: `Transpose a 3×3 matrix: swap rows and columns so that element [i,j] becomes [j,i].

Given input matrix:
\`\`\`
1  2  3
4  5  6
7  8  9
\`\`\`

Expected output (transposed):
\`\`\`
T[0,0] = 1
T[0,1] = 4
T[0,2] = 7
T[1,0] = 2
T[1,1] = 5
T[1,2] = 8
T[2,0] = 3
T[2,1] = 6
T[2,2] = 9
\`\`\``,
  starterCode: `__co__ void transpose() {
  global float A[3, 3];
  global float T[3, 3];

  // Initialize A = [[1,2,3],[4,5,6],[7,8,9]]
  parallel {i, j} by [3, 3] {
    A[i, j] = (float)(i * 3 + j + 1);
  }

  // TODO: transpose A into T (swap rows and columns)

  // Print transposed matrix
  parallel {i, j} by [3, 3] {
    println("T[", i, ",", j, "] =", T[i, j]);
  }
}
`,
  tests: [
    {
      expectedOutput: "T[0,0] = 1\nT[0,1] = 4\nT[0,2] = 7\nT[1,0] = 2\nT[1,1] = 5\nT[1,2] = 8\nT[2,0] = 3\nT[2,1] = 6\nT[2,2] = 9",
      description: "Should transpose the 3x3 matrix correctly",
    },
  ],
  hint: "Inside a parallel {i,j} by [3,3] block, set T[i,j] = A[j,i] — swap the indices.",
};
