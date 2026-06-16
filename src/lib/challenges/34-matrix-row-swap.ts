import type { Challenge } from "./index";

export const challenge34: Challenge = {
  id: "c34",
  title: "Matrix Row Swap",
  difficulty: "medium",
  description: `Swap rows 0 and 1 of a 2×3 matrix using DMA.

Initial matrix:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6]]
\`\`\`

After swapping rows 0 and 1:
\`\`\`
M = [[4, 5, 6],
     [1, 2, 3]]
\`\`\`

Use a shared row buffer and three DMA transfers: save row 0, copy row 1 → row 0, restore buffer → row 1.

Expected output:
\`\`\`
M[0,0] = 4
M[0,1] = 5
M[0,2] = 6
M[1,0] = 1
M[1,1] = 2
M[1,2] = 3
\`\`\``,
  starterCode: `__co__ void matrix_row_swap() {
  global float M[2, 3];
  shared float row_buf[3];

  // Initialize M = [[1,2,3],[4,5,6]]
  parallel {i, j} by [2, 3] {
    M[0, 0] = 1.0f; M[0, 1] = 2.0f; M[0, 2] = 3.0f;
    M[1, 0] = 4.0f; M[1, 1] = 5.0f; M[1, 2] = 6.0f;
  }

  // TODO: swap rows with DMA and a shared buffer
  // dma(M[0, 0:3], row_buf[0:3]);
  // dma(M[1, 0:3], M[0, 0:3]);
  // dma(row_buf[0:3], M[1, 0:3]);

  parallel {i, j} by [2, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 4", description: "Row 0 now holds former row 1" },
    { expectedOutput: "M[1,0] = 1", description: "Row 1 now holds former row 0" },
    {
      expectedOutput: "M[0,0] = 4\nM[0,1] = 5\nM[0,2] = 6\nM[1,0] = 1\nM[1,1] = 2\nM[1,2] = 3",
      description: "Full swapped matrix",
    },
  ],
  hint: "Copy row 0 to row_buf, then row 1 to row 0, then row_buf back to row 1 — each step is a dma of the row slice M[row, 0:3].",
};
