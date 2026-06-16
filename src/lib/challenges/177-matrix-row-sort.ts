import type { Challenge } from "./index";

export const challenge177: Challenge = {
  id: "c177",
  title: "Matrix Row Sort",
  difficulty: "hard",
  description: `Sort each row of a **3×4** matrix in non-decreasing order using sequential \`foreach\` bubble sort.

Given:
\`\`\`
Row 0: [15,  8, 12,  3]
Row 1: [22,  6, 18, 10]
Row 2: [ 5, 20,  7, 14]
\`\`\`

After sorting each row independently:
\`\`\`
Row 0: [ 3,  8, 12, 15]
Row 1: [ 6, 10, 18, 22]
Row 2: [ 5,  7, 14, 20]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 3
M[0,3] = 15
M[1,0] = 6
M[1,3] = 22
M[2,0] = 5
M[2,3] = 20
\`\`\`

For each row, run multiple \`foreach\` passes comparing adjacent elements and swapping when out of order.`,
  starterCode: `__co__ void matrix_row_sort() {
  global int M[3, 4];

  parallel {i, j} by [1, 1] {
    M[0, 0] = 15; M[0, 1] = 8; M[0, 2] = 12; M[0, 3] = 3;
    M[1, 0] = 22; M[1, 1] = 6; M[1, 2] = 18; M[1, 3] = 10;
    M[2, 0] = 5; M[2, 1] = 20; M[2, 2] = 7; M[2, 3] = 14;
  }

  // TODO: bubble-sort each row with nested foreach loops
  // foreach r in [0:3] {
  //   foreach pass in [0:4] {
  //     foreach j in [0:3] {
  //       if (M[r, j] > M[r, j + 1]) {
  //         int tmp = M[r, j];
  //         M[r, j] = M[r, j + 1];
  //         M[r, j + 1] = tmp;
  //       }
  //     }
  //   }
  // }

  parallel {i, j} by [3, 4] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 3", description: "Row 0 sorted ascending at column 0" },
    { expectedOutput: "M[0,3] = 15", description: "Row 0 sorted ascending at column 3" },
    { expectedOutput: "M[1,0] = 6", description: "Row 1 sorted ascending at column 0" },
    { expectedOutput: "M[1,3] = 22", description: "Row 1 sorted ascending at column 3" },
    { expectedOutput: "M[2,0] = 5", description: "Row 2 sorted ascending at column 0" },
    { expectedOutput: "M[2,3] = 20", description: "Row 2 sorted ascending at column 3" },
    {
      expectedOutput: "M[0,0] = 3\nM[0,1] = 8\nM[0,2] = 12\nM[0,3] = 15\nM[1,0] = 6\nM[1,1] = 10\nM[1,2] = 18\nM[1,3] = 22\nM[2,0] = 5\nM[2,1] = 7\nM[2,2] = 14\nM[2,3] = 20",
      description: "Full row-wise sorted 3×4 matrix output",
    },
  ],
  hint: "foreach r in [0:3] for each row. Inside, run foreach pass in [0:4] and foreach j in [0:3] — swap M[r,j] and M[r,j+1] when M[r,j] > M[r,j+1].",
};
