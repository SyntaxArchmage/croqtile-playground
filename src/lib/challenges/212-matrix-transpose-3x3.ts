import type { Challenge } from "./index";

export const challenge212: Challenge = {
  id: "c212",
  title: "Matrix Transpose 3×3",
  difficulty: "medium",
  description: `Transpose a **3×3** matrix: swap rows and columns so that \`T[i, j] = A[j, i]\`.

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
\`\`\`

Use \`parallel {i, j} by [3, 3]\` to copy each element with swapped indices.`,
  starterCode: `__co__ void matrix_transpose_3x3() {
  global int A[3, 3];
  global int T[3, 3];

  parallel {i, j} by [3, 3] {
    A[i, j] = i * 3 + j + 1;
  }

  // TODO: transpose A into T with parallel {i, j} by [3, 3]
  // T[i, j] = A[j, i];

  parallel {i, j} by [3, 3] {
    println("T[", i, ",", j, "] =", T[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "T[0,0] = 1", description: "Diagonal stays unchanged: T[0,0] = 1" },
    { expectedOutput: "T[0,1] = 4", description: "T[0,1] = A[1,0] = 4 (row-col swap)" },
    { expectedOutput: "T[2,0] = 3", description: "T[2,0] = A[0,2] = 3 (row-col swap)" },
    {
      expectedOutput: "T[0,0] = 1\nT[0,1] = 4\nT[0,2] = 7\nT[1,0] = 2\nT[1,1] = 5\nT[1,2] = 8\nT[2,0] = 3\nT[2,1] = 6\nT[2,2] = 9",
      description: "Full 3×3 transposed matrix output",
    },
  ],
  hint: "Inside parallel {i,j} by [3,3], set T[i,j] = A[j,i] — swap the indices.",
};
