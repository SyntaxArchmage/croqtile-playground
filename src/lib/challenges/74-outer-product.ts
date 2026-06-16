import type { Challenge } from "./index";

export const challenge74: Challenge = {
  id: "c74",
  title: "Outer Product",
  difficulty: "hard",
  description: `Compute the outer product of two 3-element vectors.

Given a = [1, 2, 3] and b = [4, 5, 6], the outer product M[i, j] = a[i] * b[j] is a 3×3 matrix:

\`\`\`
 4   5   6
 8  10  12
12  15  18
\`\`\`

Expected output:
\`\`\`
M[0,0] = 4
M[0,1] = 5
M[0,2] = 6
M[1,0] = 8
M[1,1] = 10
M[1,2] = 12
M[2,0] = 12
M[2,1] = 15
M[2,2] = 18
\`\`\`

Use \`parallel {i, j} by [3, 3]\` — each thread multiplies one pair of vector elements.`,
  starterCode: `__co__ void outer_product() {
  global int a[3];
  global int b[3];
  global int M[3, 3];

  parallel {i} by [3] {
    a[0] = 1; a[1] = 2; a[2] = 3;
    b[0] = 4; b[1] = 5; b[2] = 6;
  }

  // TODO: parallel {i, j} by [3, 3] { M[i, j] = a[i] * b[j]; }

  parallel {i, j} by [3, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 4", description: "a[0] * b[0] = 1 * 4 = 4" },
    { expectedOutput: "M[1,2] = 12", description: "a[1] * b[2] = 2 * 6 = 12" },
    { expectedOutput: "M[2,2] = 18", description: "a[2] * b[2] = 3 * 6 = 18" },
    {
      expectedOutput: "M[0,0] = 4\nM[0,1] = 5\nM[0,2] = 6\nM[1,0] = 8\nM[1,1] = 10\nM[1,2] = 12\nM[2,0] = 12\nM[2,1] = 15\nM[2,2] = 18",
      description: "Full 3×3 outer product output",
    },
  ],
  hint: "Each thread (i, j) writes M[i, j] = a[i] * b[j]. No reduction needed — every cell is independent.",
};
