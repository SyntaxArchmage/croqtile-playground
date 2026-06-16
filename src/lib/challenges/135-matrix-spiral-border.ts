import type { Challenge } from "./index";

export const challenge135: Challenge = {
  id: "c135",
  title: "Matrix Spiral Border",
  difficulty: "hard",
  description: `Print the **border** of a 4×4 matrix in **clockwise spiral** order (outer ring only).

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12],
     [13, 14, 15, 16]]
\`\`\`

Spiral border: 1→2→3→4→8→12→16→15→14→13→9→5 (12 elements, interior skipped).

Expected output:
\`\`\`
border[0] = 1
border[1] = 2
border[2] = 3
border[3] = 4
border[4] = 8
border[5] = 12
border[6] = 16
border[7] = 15
border[8] = 14
border[9] = 13
border[10] = 9
border[11] = 5
\`\`\`

Walk top row, right column, bottom row (reverse), left column (reverse) with \`foreach\` loops.`,
  starterCode: `__co__ void matrix_spiral_border() {
  int n = 4;
  global int M[4, 4];
  global int border[12];

  parallel {i, j} by [4, 4] {
    M[i, j] = i * n + j + 1;
  }

  // TODO: fill border[] in clockwise spiral order
  // int idx = 0;
  // int top = 0; int bottom = 3; int left = 0; int right = 3;
  // foreach j in [left:right+1] { border[idx] = M[top, j]; idx = idx + 1; }
  // foreach i in [top+1:bottom+1] { border[idx] = M[i, right]; idx = idx + 1; }
  // foreach j in [right-1:left-1:-1] { border[idx] = M[bottom, j]; idx = idx + 1; }
  // foreach i in [bottom-1:top:-1] { border[idx] = M[i, left]; idx = idx + 1; }

  parallel {k} by [12] {
    println("border[", k, "] =", border[k]);
  }
}
`,
  tests: [
    { expectedOutput: "border[0] = 1", description: "Start at top-left" },
    { expectedOutput: "border[3] = 4", description: "End of top row" },
    { expectedOutput: "border[4] = 8", description: "Down right column" },
    { expectedOutput: "border[6] = 16", description: "Bottom-right corner" },
    { expectedOutput: "border[11] = 5", description: "Up left column to finish" },
    {
      expectedOutput: "border[0] = 1\nborder[1] = 2\nborder[2] = 3\nborder[3] = 4\nborder[4] = 8\nborder[5] = 12\nborder[6] = 16\nborder[7] = 15\nborder[8] = 14\nborder[9] = 13\nborder[10] = 9\nborder[11] = 5",
      description: "Full spiral border output",
    },
  ],
  hint: "Trace the outer ring: top row left-to-right, right column top-to-bottom, bottom row right-to-left, left column bottom-to-top. Stop before revisiting corners.",
};
