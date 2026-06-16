import type { Challenge } from "./index";

export const challenge218: Challenge = {
  id: "c218",
  title: "Matrix Column Sort",
  difficulty: "hard",
  description: `Sort each **column** of a 3×3 matrix in non-decreasing order using sequential \`foreach\` bubble sort.

Given:
\`\`\`
M = [[9, 2, 7],
     [5, 8, 1],
     [3, 6, 4]]
\`\`\`

After sorting each column independently:
\`\`\`
M = [[3, 2, 1],
     [5, 6, 4],
     [9, 8, 7]]
\`\`\`

Expected output:
\`\`\`
M[0,0] = 3
M[2,0] = 9
M[0,2] = 1
M[2,2] = 7
\`\`\`

For each column, run multiple \`foreach\` passes comparing adjacent rows and swapping when out of order.`,
  starterCode: `__co__ void matrix_column_sort() {
  global int M[3, 3];

  parallel {i, j} by [1, 1] {
    M[0, 0] = 9; M[0, 1] = 2; M[0, 2] = 7;
    M[1, 0] = 5; M[1, 1] = 8; M[1, 2] = 1;
    M[2, 0] = 3; M[2, 1] = 6; M[2, 2] = 4;
  }

  // TODO: bubble-sort each column with nested foreach loops
  // foreach c in [0:3] {
  //   foreach pass in [0:3] {
  //     foreach r in [0:2] {
  //       if (M[r, c] > M[r + 1, c]) {
  //         int tmp = M[r, c];
  //         M[r, c] = M[r + 1, c];
  //         M[r + 1, c] = tmp;
  //       }
  //     }
  //   }
  // }

  parallel {i, j} by [3, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 3", description: "Column 0 sorted ascending at row 0" },
    { expectedOutput: "M[2,0] = 9", description: "Column 0 sorted ascending at row 2" },
    { expectedOutput: "M[0,2] = 1", description: "Column 2 sorted ascending at row 0" },
    { expectedOutput: "M[2,2] = 7", description: "Column 2 sorted ascending at row 2" },
    {
      expectedOutput: "M[0,0] = 3\nM[0,1] = 2\nM[0,2] = 1\nM[1,0] = 5\nM[1,1] = 6\nM[1,2] = 4\nM[2,0] = 9\nM[2,1] = 8\nM[2,2] = 7",
      description: "Full column-sorted 3×3 matrix output",
    },
  ],
  hint: "foreach c in [0:3] for each column. Inside, run foreach pass in [0:3] and foreach r in [0:2] — swap M[r,c] and M[r+1,c] when M[r,c] > M[r+1,c].",
};
