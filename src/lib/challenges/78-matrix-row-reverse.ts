import type { Challenge } from "./index";

export const challenge78: Challenge = {
  id: "c78",
  title: "Matrix Row Reverse",
  difficulty: "medium",
  description: `Reverse each row of a 2×4 matrix using \`parallel\`.

Initial matrix:
\`\`\`
M = [[1, 2, 3, 4],
     [5, 6, 7, 8]]
\`\`\`

After reversing each row:
\`\`\`
M = [[4, 3, 2, 1],
     [8, 7, 6, 5]]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 4
M[0,1] = 3
M[0,2] = 2
M[0,3] = 1
M[1,0] = 8
M[1,1] = 7
M[1,2] = 6
M[1,3] = 5
\`\`\`

Copy the matrix to a shared buffer with DMA, then use \`parallel {i, j} by [2, 4]\` to write \`M[i, j] = buf[i, 3 - j]\`.`,
  starterCode: `__co__ void matrix_row_reverse() {
  global int M[2, 4];
  shared int buf[2, 4];

  parallel {i} by [1] {
    M[0, 0] = 1; M[0, 1] = 2; M[0, 2] = 3; M[0, 3] = 4;
    M[1, 0] = 5; M[1, 1] = 6; M[1, 2] = 7; M[1, 3] = 8;
  }

  // TODO: DMA to buf, then reverse each row in parallel
  // dma(M[0:2, 0:4], buf[0:2, 0:4]);
  // parallel {i, j} by [2, 4] { M[i, j] = buf[i, 3 - j]; }

  parallel {i, j} by [2, 4] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 4", description: "Row 0 reversed: first column is 4" },
    { expectedOutput: "M[0,3] = 1", description: "Row 0 reversed: last column is 1" },
    { expectedOutput: "M[1,0] = 8", description: "Row 1 reversed: first column is 8" },
    {
      expectedOutput: "M[0,0] = 4\nM[0,1] = 3\nM[0,2] = 2\nM[0,3] = 1\nM[1,0] = 8\nM[1,1] = 7\nM[1,2] = 6\nM[1,3] = 5",
      description: "Full row-reversed matrix",
    },
  ],
  hint: "DMA the matrix into shared buf, then parallel {i, j} by [2, 4] sets M[i, j] = buf[i, 3 - j]. Each row reverses independently.",
};
