import type { Challenge } from "./index";

export const challenge215: Challenge = {
  id: "c215",
  title: "Matrix Is Zero",
  difficulty: "easy",
  description: `Check whether **every element** in a 3×3 matrix is zero.

Given matrix (all zeros):
\`\`\`
0  0  0
0  0  0
0  0  0
\`\`\`

Expected output:
\`\`\`
all_zero = true
\`\`\`

Use a \`foreach\` loop with a flag — start with \`all_zero = true\` and set it to \`false\` when any element is non-zero.`,
  starterCode: `__co__ void matrix_is_zero() {
  global int M[3, 3];

  parallel {i, j} by [3, 3] {
    M[i, j] = 0;
  }

  // TODO: scan with foreach and a flag variable
  // bool all_zero = true;
  // foreach i in [0:3] {
  //   foreach j in [0:3] {
  //     if (M[i, j] != 0) { all_zero = false; }
  //   }
  // }

  // println("all_zero =", all_zero);
}
`,
  tests: [
    {
      expectedOutput: "all_zero = true",
      description: "All-zero matrix reports all_zero = true",
    },
  ],
  hint: "Initialize all_zero to true. Nested foreach over rows and columns — set the flag to false whenever M[i,j] != 0.",
};
