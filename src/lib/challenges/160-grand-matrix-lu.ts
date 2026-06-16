import type { Challenge } from "./index";

export const challenge160: Challenge = {
  id: "c160",
  title: "Grand Challenge: Matrix LU",
  difficulty: "hard",
  description: `Extract the **unit lower-triangular factor L** from a lower-triangular matrix using shared memory and DMA.

Given lower-triangular matrix A (3×3):
\`\`\`
A = [[4,  0,  0],
     [8,  4,  0],
     [12, 8,  4]]
\`\`\`

For a lower-triangular A, the LU factor L has **1 on the diagonal** and \`L[i,j] = A[i,j] / A[j,j]\` for \`i > j\`:

\`\`\`
L = [[1, 0, 0],
     [2, 1, 0],
     [3, 2, 1]]
\`\`\`

Expected output:
\`\`\`
L[0,0] = 1
L[1,0] = 2
L[1,1] = 1
L[2,0] = 3
L[2,1] = 2
L[2,2] = 1
\`\`\`

**Steps:** DMA A into shared memory, then use \`parallel {i, j} by [3, 3]\` with \`if (i >= j)\` to compute L.`,
  starterCode: `__co__ void grand_matrix_lu() {
  global int A[3, 3];
  global int L[3, 3];
  shared int buf[3, 3];

  parallel {i, j} by [3, 3] {
    A[i, j] = 0;
    if (i == j) { A[i, j] = 4; }
    if (i == 1 && j == 0) { A[i, j] = 8; }
    if (i == 2 && j == 0) { A[i, j] = 12; }
    if (i == 2 && j == 1) { A[i, j] = 8; }
  }

  // TODO: DMA A into shared buf

  // TODO: parallel {i, j} by [3, 3] {
  //   if (i >= j) {
  //     if (i == j) { L[i, j] = 1; }
  //     else { L[i, j] = buf[i, j] / buf[j, j]; }
  //   }
  // }

  parallel {i, j} by [3, 3] {
    if (i >= j) {
      println("L[", i, ",", j, "] =", L[i, j]);
    }
  }
}
`,
  tests: [
    { expectedOutput: "L[0,0] = 1", description: "Unit diagonal: L[0,0] = 1" },
    { expectedOutput: "L[1,0] = 2", description: "L[1,0] = A[1,0]/A[0,0] = 8/4 = 2" },
    { expectedOutput: "L[2,0] = 3", description: "L[2,0] = A[2,0]/A[0,0] = 12/4 = 3" },
    { expectedOutput: "L[2,1] = 2", description: "L[2,1] = A[2,1]/A[1,1] = 8/4 = 2" },
    { expectedOutput: "L[2,2] = 1", description: "Unit diagonal: L[2,2] = 1" },
    {
      expectedOutput: "L[0,0] = 1\nL[1,0] = 2\nL[1,1] = 1\nL[2,0] = 3\nL[2,1] = 2\nL[2,2] = 1",
      description: "Full unit lower-triangular L factor",
    },
  ],
  hint: "DMA A into shared buf. parallel {i,j}: if i==j then L[i,j]=1 else if i>j then L[i,j]=buf[i,j]/buf[j,j]. Print only i>=j cells.",
};
