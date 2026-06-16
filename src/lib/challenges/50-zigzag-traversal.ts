import type { Challenge } from "./index";

export const challenge50: Challenge = {
  id: "c50",
  title: "Zigzag Traversal",
  difficulty: "hard",
  description: `Print elements of a 3×4 matrix in zigzag order.

Even rows (0, 2, …) go left-to-right; odd rows (1, 3, …) go right-to-left.

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12]]
\`\`\`

Expected output:
\`\`\`
zig[0] = 1
zig[1] = 2
zig[2] = 3
zig[3] = 4
zig[4] = 8
zig[5] = 7
zig[6] = 6
zig[7] = 5
zig[8] = 9
zig[9] = 10
zig[10] = 11
zig[11] = 12
\`\`\`

Use \`foreach\` over rows and reverse column order on odd rows with \`col = 3 - j\`.`,
  starterCode: `__co__ void zigzag_traversal() {
  int rows = 3;
  int cols = 4;
  global int M[3, 4];
  global int zig[12];

  parallel {i, j} by [3, 4] {
    M[i, j] = i * cols + j + 1;
  }

  // TODO: fill zig[] in row-wise zigzag order
  // int idx = 0;
  // foreach i in [0:rows] {
  //   if (i % 2 == 0) {
  //     foreach j in [0:cols] { zig[idx] = M[i, j]; idx = idx + 1; }
  //   } else {
  //     foreach j in [0:cols] { zig[idx] = M[i, cols - 1 - j]; idx = idx + 1; }
  //   }
  // }

  parallel {k} by [12] {
    println("zig[", k, "] =", zig[k]);
  }
}
`,
  tests: [
    { expectedOutput: "zig[0] = 1", description: "Start at top-left" },
    { expectedOutput: "zig[3] = 4", description: "End of row 0 (left-to-right)" },
    { expectedOutput: "zig[4] = 8", description: "Start of row 1 (right-to-left)" },
    { expectedOutput: "zig[7] = 5", description: "End of row 1" },
    { expectedOutput: "zig[11] = 12", description: "Final element bottom-right" },
    {
      expectedOutput: "zig[0] = 1\nzig[1] = 2\nzig[2] = 3\nzig[3] = 4\nzig[4] = 8\nzig[5] = 7\nzig[6] = 6\nzig[7] = 5\nzig[8] = 9\nzig[9] = 10\nzig[10] = 11\nzig[11] = 12",
      description: "Full zigzag traversal output",
    },
  ],
  hint: "Walk rows with foreach i in [0:3]. On even rows read M[i, j]; on odd rows read M[i, cols - 1 - j]. Increment a running idx into zig[].",
};
