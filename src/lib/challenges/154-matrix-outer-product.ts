import type { Challenge } from "./index";

export const challenge154: Challenge = {
  id: "c154",
  title: "Matrix Outer Product",
  difficulty: "hard",
  description: `Compute the **outer product** of two 4-element vectors as a **4×4** matrix.

Given a = [1, 2, 3, 4] and b = [2, 3, 4, 5], compute \`M[i, j] = a[i] * b[j]\`:

\`\`\`
 2   3   4   5
 4   6   8  10
 6   9  12  15
 8  12  16  20
\`\`\`

Expected output:
\`\`\`
M[0,0] = 2
M[0,3] = 5
M[3,0] = 8
M[3,3] = 20
\`\`\`

Use \`parallel {i, j} by [4, 4]\` — each thread multiplies one pair of vector elements.`,
  starterCode: `__co__ void matrix_outer_product() {
  global int a[4];
  global int b[4];
  global int M[4, 4];

  parallel {i} by [1] {
    a[0] = 1; a[1] = 2; a[2] = 3; a[3] = 4;
    b[0] = 2; b[1] = 3; b[2] = 4; b[3] = 5;
  }

  // TODO: parallel {i, j} by [4, 4] { M[i, j] = a[i] * b[j]; }

  parallel {i, j} by [4, 4] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 2", description: "a[0] * b[0] = 1 * 2 = 2" },
    { expectedOutput: "M[0,3] = 5", description: "a[0] * b[3] = 1 * 5 = 5" },
    { expectedOutput: "M[3,0] = 8", description: "a[3] * b[0] = 4 * 2 = 8" },
    { expectedOutput: "M[3,3] = 20", description: "a[3] * b[3] = 4 * 5 = 20" },
    {
      expectedOutput: "M[0,0] = 2\nM[0,1] = 3\nM[0,2] = 4\nM[0,3] = 5\nM[1,0] = 4\nM[1,1] = 6\nM[1,2] = 8\nM[1,3] = 10\nM[2,0] = 6\nM[2,1] = 9\nM[2,2] = 12\nM[2,3] = 15\nM[3,0] = 8\nM[3,1] = 12\nM[3,2] = 16\nM[3,3] = 20",
      description: "Full 4×4 outer product output",
    },
  ],
  hint: "Each thread (i, j) writes M[i, j] = a[i] * b[j]. All 16 cells are independent.",
};
