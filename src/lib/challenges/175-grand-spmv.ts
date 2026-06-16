import type { Challenge } from "./index";

export const challenge175: Challenge = {
  id: "c175",
  title: "Grand Challenge: SpMV",
  difficulty: "hard",
  description: `Sparse matrix-vector multiply in **CSR format** using shared memory and DMA.

3×3 sparse matrix:
\`\`\`
A = [[1, 0, 2],
     [0, 3, 0],
     [4, 0, 5]]
\`\`\`

CSR arrays:
- \`values\` = [1, 2, 3, 4, 5]
- \`col_indices\` = [0, 2, 1, 0, 2]
- \`row_ptr\` = [0, 2, 3, 5]

Vector \`x = [10, 20, 30]\`:
- \`y[0] = 1×10 + 2×30 = 70\`
- \`y[1] = 3×20 = 60\`
- \`y[2] = 4×10 + 5×30 = 190\`

Expected output:
\`\`\`
y[0] = 70
y[1] = 60
y[2] = 190
\`\`\`

**Steps:** DMA CSR arrays into shared memory, then \`parallel {row} by [3]\` to dot each row with \`x\`.`,
  starterCode: `__co__ void grand_spmv() {
  global int values[5];
  global int col_indices[5];
  global int row_ptr[4];
  global int x[3];
  global int y[3];
  shared int s_values[5];
  shared int s_col[5];
  shared int s_row_ptr[4];
  shared int s_x[3];

  parallel {i} by [1] {
    values[0] = 1; values[1] = 2; values[2] = 3;
    values[3] = 4; values[4] = 5;
    col_indices[0] = 0; col_indices[1] = 2; col_indices[2] = 1;
    col_indices[3] = 0; col_indices[4] = 2;
    row_ptr[0] = 0; row_ptr[1] = 2; row_ptr[2] = 3; row_ptr[3] = 5;
    x[0] = 10; x[1] = 20; x[2] = 30;
  }

  // TODO: DMA values, col_indices, row_ptr, x into shared arrays

  // TODO: parallel {row} by [3] {
  //   int sum = 0;
  //   foreach k in [s_row_ptr[row]:s_row_ptr[row + 1]] {
  //     sum = sum + s_values[k] * s_x[s_col[k]];
  //   }
  //   y[row] = sum;
  // }

  parallel {row} by [3] {
    println("y[", row, "] =", y[row]);
  }
}
`,
  tests: [
    { expectedOutput: "y[0] = 70", description: "Row 0: 1×10 + 2×30 = 70" },
    { expectedOutput: "y[1] = 60", description: "Row 1: 3×20 = 60" },
    { expectedOutput: "y[2] = 190", description: "Row 2: 4×10 + 5×30 = 190" },
    {
      expectedOutput: "y[0] = 70\ny[1] = 60\ny[2] = 190",
      description: "Full SpMV output",
    },
  ],
  hint: "DMA CSR data into shared memory. Each thread row: foreach k in [row_ptr[row]:row_ptr[row+1]], sum += values[k]*x[col[k]]. Store in y[row].",
};
