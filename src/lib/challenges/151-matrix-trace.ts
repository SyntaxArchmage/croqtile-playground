import type { Challenge } from "./index";

export const challenge151: Challenge = {
  id: "c151",
  title: "Matrix Trace",
  difficulty: "easy",
  description: `Compute the **trace** (sum of diagonal elements) of a **4×4** matrix.

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12],
     [13, 14, 15, 16]]
\`\`\`

Trace = M[0,0] + M[1,1] + M[2,2] + M[3,3] = 1 + 6 + 11 + 16 = **34**.

Expected output:
\`\`\`
trace = 34
\`\`\`

Use \`foreach i in [0:4]\` to accumulate \`M[i, i]\`.`,
  starterCode: `__co__ void matrix_trace_4x4() {
  global int M[4, 4];

  parallel {i, j} by [4, 4] {
    M[i, j] = i * 4 + j + 1;
  }

  int trace = 0;

  // TODO: foreach i in [0:4] { trace = trace + M[i, i]; }

  println("trace =", trace);
}
`,
  tests: [
    {
      expectedOutput: "trace = 34",
      description: "Main diagonal sum = 1+6+11+16 = 34",
    },
  ],
  hint: "One foreach loop: trace += M[i, i] for i in [0:4].",
};
