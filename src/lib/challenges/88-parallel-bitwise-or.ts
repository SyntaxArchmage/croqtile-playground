import type { Challenge } from "./index";

export const challenge88: Challenge = {
  id: "c88",
  title: "Parallel Bitwise OR",
  difficulty: "medium",
  description: `Compute element-wise bitwise OR of two arrays using \`parallel\`.

Given A = [12, 5, 0, 15] and B = [10, 3, 7, 8], compute \`out[i] = A[i] | B[i]\`.

Expected output:
\`\`\`
out[0] = 14
out[1] = 7
out[2] = 7
out[3] = 15
\`\`\`

Use \`parallel {i} by [4]\` — one thread per element applies the \`|\` operator.`,
  starterCode: `__co__ void parallel_bitwise_or() {
  global int A[4];
  global int B[4];
  global int out[4];

  parallel {i} by [1] {
    A[0] = 12; A[1] = 5;  A[2] = 0;  A[3] = 15;
    B[0] = 10; B[1] = 3;  B[2] = 7;  B[3] = 8;
  }

  // TODO: compute out[i] = A[i] | B[i] in parallel
  // parallel {i} by [4] { out[i] = A[i] | B[i]; }

  parallel {i} by [4] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 14", description: "12 | 10 = 14" },
    { expectedOutput: "out[1] = 7", description: "5 | 3 = 7" },
    { expectedOutput: "out[2] = 7", description: "0 | 7 = 7" },
    { expectedOutput: "out[3] = 15", description: "15 | 8 = 15" },
    {
      expectedOutput: "out[0] = 14\nout[1] = 7\nout[2] = 7\nout[3] = 15",
      description: "Full bitwise OR output",
    },
  ],
  hint: "Launch parallel {i} by [4] and assign out[i] = A[i] | B[i]. Each thread handles one index independently.",
};
