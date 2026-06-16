import type { Challenge } from "./index";

export const challenge42: Challenge = {
  id: "c42",
  title: "Matrix Flatten",
  difficulty: "medium",
  description: `Flatten a 2×3 matrix into a 1D array, outputting each element in row-major order.

Given matrix:
\`\`\`
1  2  3
4  5  6
\`\`\`

Expected output:
\`\`\`
flat[0] = 1
flat[1] = 2
flat[2] = 3
flat[3] = 4
flat[4] = 5
flat[5] = 6
\`\`\`

Use \`parallel {i, j} by [2, 3]\` and map each element to \`flat[i * 3 + j]\`.`,
  starterCode: `__co__ void matrix_flatten() {
  global int matrix[2, 3];
  global int flat[6];

  parallel {i, j} by [2, 3] {
    matrix[i, j] = i * 3 + j + 1;
  }

  // TODO: flatten matrix into flat in row-major order
  // parallel {i, j} by [2, 3] {
  //   flat[i * 3 + j] = matrix[i, j];
  // }

  parallel {i} by [6] {
    println("flat[", i, "] =", flat[i]);
  }
}
`,
  tests: [
    { expectedOutput: "flat[0] = 1", description: "First element from top-left" },
    { expectedOutput: "flat[2] = 3", description: "End of first row" },
    { expectedOutput: "flat[3] = 4", description: "Start of second row" },
    {
      expectedOutput: "flat[0] = 1\nflat[1] = 2\nflat[2] = 3\nflat[3] = 4\nflat[4] = 5\nflat[5] = 6",
      description: "Full flattened output",
    },
  ],
  hint: "Each (i, j) maps to flat[i * 3 + j] = matrix[i, j]. Row-major order walks rows left-to-right, top-to-bottom.",
};
