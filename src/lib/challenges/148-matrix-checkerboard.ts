import type { Challenge } from "./index";

export const challenge148: Challenge = {
  id: "c148",
  title: "Matrix Checkerboard",
  difficulty: "medium",
  description: `Fill a 4×4 matrix with a **checkerboard pattern** (0s and 1s) using nested \`parallel\` blocks.

Each cell gets 1 if \`(i + j) % 2 == 0\`, otherwise 0.

Expected output (first row and corners):
\`\`\`
M[0,0] = 1
M[0,1] = 0
M[1,0] = 0
M[1,1] = 1
M[3,3] = 1
\`\`\`

Use \`parallel {i} by [4]\` with nested \`parallel {j} by [4]\` to fill \`M[i, j]\`.`,
  starterCode: `__co__ void matrix_checkerboard() {
  global int M[4, 4];

  parallel {i} by [4] {
    parallel {j} by [4] {
      // TODO: M[i, j] = 1 if (i + j) % 2 == 0, else 0
    }
  }

  foreach i in [0:4] {
    foreach j in [0:4] {
      println("M[", i, ",", j, "] =", M[i, j]);
    }
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 1", description: "Corner (0,0) is 1 (even sum)" },
    { expectedOutput: "M[0,1] = 0", description: "(0,1) is 0 (odd sum)" },
    { expectedOutput: "M[1,0] = 0", description: "(1,0) is 0 (odd sum)" },
    { expectedOutput: "M[1,1] = 1", description: "(1,1) is 1 (even sum)" },
    { expectedOutput: "M[3,3] = 1", description: "Corner (3,3) is 1 (even sum)" },
  ],
  hint: "In nested parallel blocks, use if ((i + j) % 2 == 0) { M[i, j] = 1; } else { M[i, j] = 0; }.",
};
