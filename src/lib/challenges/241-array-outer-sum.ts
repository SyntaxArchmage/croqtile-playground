import type { Challenge } from "./index";

export const challenge241: Challenge = {
  id: "c241",
  title: "Array Outer Sum",
  difficulty: "medium",
  description: `Build an **outer sum matrix** from two 3-element arrays: \`M[i, j] = a[i] + b[j]\`.

Given a = [1, 2, 3] and b = [4, 5, 6]:

\`\`\`
 5   6   7
 6   7   8
 7   8   9
\`\`\`

Expected output:
\`\`\`
M[0,0] = 5
M[0,2] = 7
M[2,0] = 7
M[2,2] = 9
\`\`\`

Use \`parallel {i, j} by [3, 3]\` — each thread adds one pair of vector elements.`,
  starterCode: `__co__ void array_outer_sum() {
  global int a[3];
  global int b[3];
  global int M[3, 3];

  parallel {i} by [1] {
    a[0] = 1; a[1] = 2; a[2] = 3;
    b[0] = 4; b[1] = 5; b[2] = 6;
  }

  // TODO: parallel {i, j} by [3, 3] { M[i, j] = a[i] + b[j]; }

  parallel {i, j} by [3, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "M[0,0] = 5", description: "a[0] + b[0] = 1 + 4 = 5" },
    { expectedOutput: "M[0,2] = 7", description: "a[0] + b[2] = 1 + 6 = 7" },
    { expectedOutput: "M[2,0] = 7", description: "a[2] + b[0] = 3 + 4 = 7" },
    { expectedOutput: "M[2,2] = 9", description: "a[2] + b[2] = 3 + 6 = 9" },
    {
      expectedOutput: "M[0,0] = 5\nM[0,1] = 6\nM[0,2] = 7\nM[1,0] = 6\nM[1,1] = 7\nM[1,2] = 8\nM[2,0] = 7\nM[2,1] = 8\nM[2,2] = 9",
      description: "Full 3×3 outer sum output",
    },
  ],
  hint: "Each thread (i, j) writes M[i, j] = a[i] + b[j]. All 9 cells are independent.",
};
