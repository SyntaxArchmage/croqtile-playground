import type { Challenge } from "./index";

export const challenge248: Challenge = {
  id: "c248",
  title: "Matrix Ones",
  difficulty: "easy",
  description: `Create a 3×3 **all-ones matrix** using \`parallel\`.

Expected matrix:
\`\`\`
M = [[1, 1, 1],
     [1, 1, 1],
     [1, 1, 1]]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 1
M[1,1] = 1
M[2,2] = 1
\`\`\`

Use \`parallel {i, j} by [3, 3] { M[i, j] = 1; }\` — every cell gets the value 1.`,
  starterCode: `__co__ void matrix_ones() {
  global int M[3, 3];

  // TODO: fill every element with 1 in parallel
  // parallel {i, j} by [3, 3] { M[i, j] = 1; }

  parallel {i, j} by [3, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 1", description: "Top-left is 1" },
    { expectedOutput: "M[1,1] = 1", description: "Center is 1" },
    { expectedOutput: "M[2,2] = 1", description: "Bottom-right is 1" },
    {
      expectedOutput: "M[0,0] = 1\nM[0,1] = 1\nM[0,2] = 1\nM[1,0] = 1\nM[1,1] = 1\nM[1,2] = 1\nM[2,0] = 1\nM[2,1] = 1\nM[2,2] = 1",
      description: "Full 3×3 all-ones matrix",
    },
  ],
  hint: "Launch parallel {i, j} by [3, 3] and assign M[i, j] = 1. Every thread writes the same constant.",
};
