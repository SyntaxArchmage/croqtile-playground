import type { Challenge } from "./index";

export const challenge55: Challenge = {
  id: "c55",
  title: "Matrix Identity",
  difficulty: "easy",
  description: `Create and print a 3×3 identity matrix using \`parallel\` and conditionals.

An identity matrix has 1 on the diagonal and 0 elsewhere:
\`\`\`
I = [[1, 0, 0],
     [0, 1, 0],
     [0, 0, 1]]
\`\`\`

Expected output:
\`\`\`
I[0, 0] = 1
I[0, 1] = 0
I[0, 2] = 0
I[1, 0] = 0
I[1, 1] = 1
I[1, 2] = 0
I[2, 0] = 0
I[2, 1] = 0
I[2, 2] = 1
\`\`\`

Use \`parallel {i, j} by [3, 3]\` — set \`I[i, j] = 1\` when \`i == j\`, otherwise \`0\`.`,
  starterCode: `__co__ void matrix_identity() {
  global int I[3, 3];

  // TODO: fill identity matrix with parallel {i, j} and if (i == j)

  parallel {i, j} by [3, 3] {
    println("I[", i, ", ", j, "] =", I[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "I[0, 0] = 1", description: "Diagonal element is 1" },
    { expectedOutput: "I[0, 1] = 0", description: "Off-diagonal element is 0" },
    { expectedOutput: "I[1, 1] = 1", description: "Center diagonal is 1" },
    { expectedOutput: "I[2, 2] = 1", description: "Last diagonal is 1" },
    {
      expectedOutput: "I[0, 0] = 1\nI[0, 1] = 0\nI[0, 2] = 0\nI[1, 0] = 0\nI[1, 1] = 1\nI[1, 2] = 0\nI[2, 0] = 0\nI[2, 1] = 0\nI[2, 2] = 1",
      description: "Full 3×3 identity matrix",
    },
  ],
  hint: "Inside parallel {i, j} by [3, 3], use if (i == j) { I[i, j] = 1; } else { I[i, j] = 0; }.",
};
