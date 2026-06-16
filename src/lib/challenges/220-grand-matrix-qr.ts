import type { Challenge } from "./index";

export const challenge220: Challenge = {
  id: "c220",
  title: "Grand Challenge: Matrix QR",
  difficulty: "hard",
  description: `Perform **QR decomposition** of a 2×2 matrix using **Gram-Schmidt** with shared memory and DMA.

Given:
\`\`\`
A = [[0, 2],
     [2, 0]]
\`\`\`

**Gram-Schmidt steps:**
1. \`a1 = [0, 2]\`, \`r11 = 2\`, \`q1 = [0, 1]\`
2. \`a2 = [2, 0]\`, \`r12 = dot(a2, q1) = 0\`, \`a2_orth = [2, 0]\`, \`r22 = 2\`, \`q2 = [1, 0]\`
3. \`Q = [q1 | q2]\`, \`R = [[r11, r12], [0, r22]]\`

Expected output:
\`\`\`
Q[0,0] = 0
Q[1,0] = 1
Q[0,1] = 1
Q[1,1] = 0
R[0,0] = 2
R[0,1] = 0
R[1,1] = 2
\`\`\`

Use integer norms (no square root needed for this matrix). DMA A into shared memory before the sequential Gram-Schmidt pass.`,
  starterCode: `__co__ void grand_matrix_qr() {
  global int A[2, 2];
  global int Q[2, 2];
  global int R[2, 2];
  shared int buf[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 0; A[0, 1] = 2;
    A[1, 0] = 2; A[1, 1] = 0;
  }

  // TODO: DMA A into shared buf

  // TODO: Gram-Schmidt on columns of buf
  // int a1x = buf[0, 0]; int a1y = buf[1, 0];
  // int r11 = 2;  // magnitude of a1
  // Q[0,0] = 0; Q[1,0] = 1;
  //
  // int a2x = buf[0, 1]; int a2y = buf[1, 1];
  // int r12 = a2x * Q[0,0] + a2y * Q[1,0];
  // int v2x = a2x; int v2y = a2y;
  // int r22 = 2;
  // Q[0,1] = 1; Q[1,1] = 0;
  //
  // R[0,0] = r11; R[0,1] = r12; R[1,1] = r22;

  parallel {i, j} by [2, 2] {
    println("Q[", i, ",", j, "] =", Q[i, j]);
  }
  println("R[0,0] =", R[0, 0]);
  println("R[0,1] =", R[0, 1]);
  println("R[1,1] =", R[1, 1]);
}
`,
  tests: [
    { expectedOutput: "Q[0,0] = 0", description: "First orthonormal basis vector x-component" },
    { expectedOutput: "Q[1,0] = 1", description: "First orthonormal basis vector y-component" },
    { expectedOutput: "Q[0,1] = 1", description: "Second orthonormal basis vector x-component" },
    { expectedOutput: "Q[1,1] = 0", description: "Second orthonormal basis vector y-component" },
    { expectedOutput: "R[0,0] = 2", description: "R diagonal entry r11 = 2" },
    { expectedOutput: "R[0,1] = 0", description: "R upper entry r12 = 0" },
    { expectedOutput: "R[1,1] = 2", description: "R diagonal entry r22 = 2" },
    {
      expectedOutput: "Q[0,0] = 0\nQ[0,1] = 1\nQ[1,0] = 1\nQ[1,1] = 0\nR[0,0] = 2\nR[0,1] = 0\nR[1,1] = 2",
      description: "Full Q and R factor output",
    },
  ],
  hint: "DMA A to shared buf. Column 1: q1 = a1/||a1|| = [0,1], r11=2. Column 2: r12=dot(a2,q1)=0, q2=[1,0], r22=2. Fill R with r11, r12, r22.",
};
