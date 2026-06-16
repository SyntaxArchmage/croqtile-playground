import type { Challenge } from "./index";

export const challenge222: Challenge = {
  id: "c222",
  title: "Matrix Reshape",
  difficulty: "medium",
  description: `Reshape a **2×6** matrix into a **3×4** matrix in **row-major** order using \`parallel\`.

Given 2×6 source:
\`\`\`
1   2   3   4   5   6
7   8   9  10  11  12
\`\`\`

Flatten row-major, then fill 3×4 output:
\`\`\`
1   2   3   4
5   6   7   8
9  10  11  12
\`\`\`

Expected output:
\`\`\`
out[0,0] = 1
out[0,3] = 4
out[1,0] = 5
out[2,3] = 12
\`\`\`

Use \`flat[k] = src[i * 6 + j]\` then \`out[i, j] = flat[i * 4 + j]\`.`,
  starterCode: `__co__ void matrix_reshape() {
  global int src[2, 6];
  global int flat[12];
  global int out[3, 4];

  parallel {i, j} by [2, 6] {
    src[i, j] = i * 6 + j + 1;
  }

  // TODO: flatten src into flat (row-major)
  // parallel {i, j} by [2, 6] {
  //   flat[i * 6 + j] = src[i, j];
  // }

  // TODO: fill out from flat (row-major 3×4)
  // parallel {i, j} by [3, 4] {
  //   out[i, j] = flat[i * 4 + j];
  // }

  parallel {i, j} by [3, 4] {
    println("out[", i, ",", j, "] =", out[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0,0] = 1", description: "Top-left unchanged after reshape" },
    { expectedOutput: "out[0,3] = 4", description: "End of first output row" },
    { expectedOutput: "out[1,0] = 5", description: "Start of second output row" },
    { expectedOutput: "out[2,3] = 12", description: "Bottom-right element is 12" },
    {
      expectedOutput: "out[0,0] = 1\nout[0,1] = 2\nout[0,2] = 3\nout[0,3] = 4\nout[1,0] = 5\nout[1,1] = 6\nout[1,2] = 7\nout[1,3] = 8\nout[2,0] = 9\nout[2,1] = 10\nout[2,2] = 11\nout[2,3] = 12",
      description: "Full reshaped 3×4 matrix output",
    },
  ],
  hint: "Pass 1: flat[i*6+j] = src[i,j]. Pass 2: out[i,j] = flat[i*4+j]. Both passes use parallel {i,j}.",
};
