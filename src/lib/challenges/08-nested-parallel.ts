import type { Challenge } from "./index";

export const challenge08: Challenge = {
  id: "c08",
  title: "Nested Parallel",
  difficulty: "hard",
  description: `Use 2D parallel blocks to create a multiplication table.

For a 3x3 grid, compute M[i,j] = (i+1) * (j+1) and print all values row by row.

Expected output:
\`\`\`
M[0,0] = 1
M[0,1] = 2
M[0,2] = 3
M[1,0] = 2
M[1,1] = 4
M[1,2] = 6
M[2,0] = 3
M[2,1] = 6
M[2,2] = 9
\`\`\`

Use \`parallel {i, j} by [3, 3]\` for 2D parallel execution.`,
  starterCode: `__co__ void mult_table() {
  global float M[3, 3];

  // Compute M[i,j] = (i+1) * (j+1) using parallel {i, j} by [3, 3]

  // Print row by row: println("M[", i, ",", j, "] =", M[i, j]);
}
`,
  tests: [
    {
      expectedOutput: "M[0,0] = 1\nM[0,1] = 2\nM[0,2] = 3\nM[1,0] = 2\nM[1,1] = 4\nM[1,2] = 6\nM[2,0] = 3\nM[2,1] = 6\nM[2,2] = 9",
      description: "Should produce 3x3 multiplication table",
    },
  ],
  hint: "Use 2D parallel to get both i and j. The value at (i,j) is the product of (i+1) and (j+1). Print row by row.",
};
