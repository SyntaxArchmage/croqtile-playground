import type { Challenge } from "./index";

export const challenge06: Challenge = {
  id: "c06",
  title: "Matrix Trace",
  difficulty: "hard",
  description: `Compute the trace (sum of diagonal elements) of a 4x4 matrix.

Initialize a 4x4 matrix where M[i,j] = i * 4 + j + 1:
\`\`\`
 1  2  3  4
 5  6  7  8
 9 10 11 12
13 14 15 16
\`\`\`

The trace is M[0,0] + M[1,1] + M[2,2] + M[3,3] = 1 + 6 + 11 + 16 = 34.

Expected output:
\`\`\`
trace = 34
\`\`\``,
  starterCode: `__co__ void matrix_trace() {
  global float M[4, 4];

  // Initialize M[i,j] = i * 4 + j + 1 using parallel {i, j} by [4, 4]

  // Compute trace: sum of diagonal elements M[k,k]
  float trace = 0.0f;

  println("trace =", trace);
}
`,
  tests: [
    {
      expectedOutput: "trace = 34",
      description: "Should compute matrix trace = 34",
    },
  ],
  hint: "The diagonal elements are where the row and column indices are equal. Sum them with a foreach loop.",
};
