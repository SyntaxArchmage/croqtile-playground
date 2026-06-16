import type { Challenge } from "./index";

export const challenge183: Challenge = {
  id: "c183",
  title: "Matrix Minor",
  difficulty: "hard",
  description: `Extract a **2×2 minor** from a 3×3 matrix by removing row **1** and column **1**.

Given:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

Remove row 1 and column 1 to get:
\`\`\`
minor = [[1, 3],
         [7, 9]]
\`\`\`

Expected output:
\`\`\`
minor[0,0] = 1
minor[0,1] = 3
minor[1,0] = 7
minor[1,1] = 9
\`\`\`

Use \`parallel {i, j} by [2, 2]\` with index remapping: skip the removed row and column.`,
  starterCode: `__co__ void matrix_minor() {
  global int M[3, 3];
  global int minor[2, 2];
  int skip_row = 1;
  int skip_col = 1;

  parallel {i, j} by [3, 3] {
    M[i, j] = i * 3 + j + 1;
  }

  // TODO: parallel {i, j} by [2, 2] {
  //   int src_row = i;
  //   int src_col = j;
  //   if (src_row >= skip_row) { src_row = src_row + 1; }
  //   if (src_col >= skip_col) { src_col = src_col + 1; }
  //   minor[i, j] = M[src_row, src_col];
  // }

  parallel {i, j} by [2, 2] {
    println("minor[", i, ",", j, "] =", minor[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "minor[0,0] = 1", description: "Top-left minor element is M[0,0] = 1" },
    { expectedOutput: "minor[0,1] = 3", description: "Top-right minor element is M[0,2] = 3" },
    { expectedOutput: "minor[1,0] = 7", description: "Bottom-left minor element is M[2,0] = 7" },
    { expectedOutput: "minor[1,1] = 9", description: "Bottom-right minor element is M[2,2] = 9" },
    {
      expectedOutput: "minor[0,0] = 1\nminor[0,1] = 3\nminor[1,0] = 7\nminor[1,1] = 9",
      description: "Full 2×2 minor output",
    },
  ],
  hint: "Each thread (i,j) maps to source row/col by adding 1 when i or j >= skip index. Copy M[src_row, src_col] into minor[i, j].",
};
