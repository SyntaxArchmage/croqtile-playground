import type { Challenge } from "./index";

export const challenge95: Challenge = {
  id: "c95",
  title: "Row-wise Sort",
  difficulty: "hard",
  description: `Sort each row of a 2×4 matrix in non-decreasing order using sequential \`foreach\` comparisons (bubble sort).

Given:
\`\`\`
Row 0: [40, 10, 30, 20]
Row 1: [80, 50, 70, 60]
\`\`\`

After sorting each row independently:
\`\`\`
Row 0: [10, 20, 30, 40]
Row 1: [50, 60, 70, 80]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 10
M[0,1] = 20
M[0,2] = 30
M[0,3] = 40
M[1,0] = 50
M[1,1] = 60
M[1,2] = 70
M[1,3] = 80
\`\`\`

For each row, run multiple \`foreach\` passes comparing adjacent elements and swapping when out of order.`,
  starterCode: `__co__ void row_wise_sort() {
  global int M[2, 4];

  parallel {i, j} by [1, 1] {
    M[0, 0] = 40; M[0, 1] = 10; M[0, 2] = 30; M[0, 3] = 20;
    M[1, 0] = 80; M[1, 1] = 50; M[1, 2] = 70; M[1, 3] = 60;
  }

  // TODO: bubble-sort each row with nested foreach loops
  // foreach r in [0:2] {
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

  parallel {i, j} by [2, 4] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 10", description: "Row 0 sorted ascending at column 0" },
    { expectedOutput: "M[0,3] = 40", description: "Row 0 sorted ascending at column 3" },
    { expectedOutput: "M[1,0] = 50", description: "Row 1 sorted ascending at column 0" },
    { expectedOutput: "M[1,3] = 80", description: "Row 1 sorted ascending at column 3" },
    {
      expectedOutput: "M[0,0] = 10\nM[0,1] = 20\nM[0,2] = 30\nM[0,3] = 40\nM[1,0] = 50\nM[1,1] = 60\nM[1,2] = 70\nM[1,3] = 80",
      description: "Full row-wise sorted matrix output",
    },
  ],
  hint: "foreach r in [0:2] for each row. Inside, run foreach pass in [0:4] and foreach j in [0:3] — swap M[r,j] and M[r,j+1] when M[r,j] > M[r,j+1].",
};
