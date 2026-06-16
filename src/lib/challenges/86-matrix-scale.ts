import type { Challenge } from "./index";

export const challenge86: Challenge = {
  id: "c86",
  title: "Matrix Scale",
  difficulty: "easy",
  description: `Scale every element of a 2×3 matrix by 2 using nested \`parallel\`.

Initial matrix:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6]]
\`\`\`

After scaling by 2:
\`\`\`
M = [[2, 4, 6],
     [8, 10, 12]]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 2
M[0,1] = 4
M[0,2] = 6
M[1,0] = 8
M[1,1] = 10
M[1,2] = 12
\`\`\`

Use \`parallel {i, j} by [2, 3]\` so each thread scales one cell.`,
  starterCode: `__co__ void matrix_scale() {
  global int M[2, 3];

  parallel {i, j} by [2, 3] {
    M[0, 0] = 1; M[0, 1] = 2; M[0, 2] = 3;
    M[1, 0] = 4; M[1, 1] = 5; M[1, 2] = 6;
  }

  // TODO: M[i, j] = M[i, j] * 2 in parallel

  parallel {i, j} by [2, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 2", description: "Top-left scaled: 1 × 2 = 2" },
    { expectedOutput: "M[1,2] = 12", description: "Bottom-right scaled: 6 × 2 = 12" },
    {
      expectedOutput: "M[0,0] = 2\nM[0,1] = 4\nM[0,2] = 6\nM[1,0] = 8\nM[1,1] = 10\nM[1,2] = 12",
      description: "Full scaled 2×3 matrix",
    },
  ],
  hint: "Launch parallel {i, j} by [2, 3] and assign M[i, j] = M[i, j] * 2. Each thread handles one matrix cell.",
};
