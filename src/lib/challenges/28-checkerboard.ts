import type { Challenge } from "./index";

export const challenge28: Challenge = {
  id: "c28",
  title: "Checkerboard Pattern",
  difficulty: "easy",
  description: `Fill a 4x4 matrix with a checkerboard pattern using nested parallel blocks.

Each cell gets 1 if the sum of its row and column indices is even, 0 otherwise.

Expected output:
\`\`\`
M[0,0] = 1
M[0,1] = 0
M[0,2] = 1
M[0,3] = 0
M[1,0] = 0
M[1,1] = 1
M[1,2] = 0
M[1,3] = 1
M[2,0] = 1
M[2,1] = 0
M[2,2] = 1
M[2,3] = 0
M[3,0] = 0
M[3,1] = 1
M[3,2] = 0
M[3,3] = 1
\`\`\`

Use \`(i + j) % 2 == 0\` to determine the value.`,
  starterCode: `__co__ void checkerboard() {
  int N = 4;
  global int M[16];

  parallel {i} by [4] {
    parallel {j} by [4] {
      // TODO: M[i * N + j] = ??? based on (i + j) % 2
    }
  }

  foreach i in [0:4] {
    foreach j in [0:4] {
      println("M[" + i + "," + j + "] =", M[i * N + j]);
    }
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 1", description: "Corner (0,0) is 1 (even sum)" },
    { expectedOutput: "M[0,1] = 0", description: "(0,1) is 0 (odd sum)" },
    { expectedOutput: "M[1,1] = 1", description: "(1,1) is 1 (even sum)" },
    { expectedOutput: "M[3,3] = 1", description: "Corner (3,3) is 1 (even sum)" },
  ],
  hint: "Use a conditional: if ((i + j) % 2 == 0) { M[i * N + j] = 1; } else { M[i * N + j] = 0; }.",
};
