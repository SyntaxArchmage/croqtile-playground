import type { Challenge } from "./index";

export const challenge52: Challenge = {
  id: "c52",
  title: "Spiral Count",
  difficulty: "medium",
  description: `Generate a 3×3 matrix and print its values in clockwise spiral order.

Given:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

Spiral order (clockwise from top-left): 1, 2, 3, 6, 9, 8, 7, 4, 5.

Expected output:
\`\`\`
spiral[0] = 1
spiral[1] = 2
spiral[2] = 3
spiral[3] = 6
spiral[4] = 9
spiral[5] = 8
spiral[6] = 7
spiral[7] = 4
spiral[8] = 5
\`\`\`

Walk the outer ring clockwise, then read the center. Use \`foreach\` loops with layer boundaries.`,
  starterCode: `__co__ void spiral_count() {
  int n = 3;
  global int M[3, 3];
  global int spiral[9];

  parallel {i, j} by [3, 3] {
    M[i, j] = i * n + j + 1;
  }

  // TODO: fill spiral[] in clockwise order
  // int idx = 0;
  // int top = 0; int bottom = 2; int left = 0; int right = 2;
  // foreach j in [left:right+1] { spiral[idx] = M[top, j]; idx = idx + 1; }
  // foreach i in [top+1:bottom+1] { spiral[idx] = M[i, right]; idx = idx + 1; }
  // foreach j in [right-1:left-1:-1] { spiral[idx] = M[bottom, j]; idx = idx + 1; }
  // foreach i in [bottom-1:top:-1] { spiral[idx] = M[i, left]; idx = idx + 1; }
  // spiral[idx] = M[1, 1];

  parallel {k} by [9] {
    println("spiral[", k, "] =", spiral[k]);
  }
}
`,
  tests: [
    { expectedOutput: "spiral[0] = 1", description: "Start at top-left" },
    { expectedOutput: "spiral[2] = 3", description: "End of top row" },
    { expectedOutput: "spiral[3] = 6", description: "Down right column" },
    { expectedOutput: "spiral[4] = 9", description: "Bottom-right corner" },
    { expectedOutput: "spiral[8] = 5", description: "Center element last" },
    {
      expectedOutput: "spiral[0] = 1\nspiral[1] = 2\nspiral[2] = 3\nspiral[3] = 6\nspiral[4] = 9\nspiral[5] = 8\nspiral[6] = 7\nspiral[7] = 4\nspiral[8] = 5",
      description: "Full spiral traversal output",
    },
  ],
  hint: "Trace the outer ring: top row left-to-right, right column top-to-bottom, bottom row right-to-left, left column bottom-to-top. Append the center M[1,1] last.",
};
