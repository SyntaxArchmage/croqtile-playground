import type { Challenge } from "./index";

export const challenge91: Challenge = {
  id: "c91",
  title: "Element-wise Max",
  difficulty: "easy",
  description: `Compute element-wise maximum of two arrays using \`parallel\` and \`if/else\`.

Given A = [3, 7, 2, 9] and B = [5, 4, 8, 1], compute \`out[i] = max(A[i], B[i])\`.

Expected output:
\`\`\`
out[0] = 5
out[1] = 7
out[2] = 8
out[3] = 9
\`\`\`

Use \`parallel {i} by [4]\` — each thread picks the larger value with an \`if/else\`.`,
  starterCode: `__co__ void element_wise_max() {
  global int A[4];
  global int B[4];
  global int out[4];

  parallel {i} by [1] {
    A[0] = 3; A[1] = 7; A[2] = 2; A[3] = 9;
    B[0] = 5; B[1] = 4; B[2] = 8; B[3] = 1;
  }

  // TODO: compute out[i] = max(A[i], B[i]) in parallel with if/else
  // parallel {i} by [4] {
  //   if (A[i] > B[i]) out[i] = A[i];
  //   else out[i] = B[i];
  // }

  parallel {i} by [4] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 5", description: "max(3, 5) = 5" },
    { expectedOutput: "out[1] = 7", description: "max(7, 4) = 7" },
    { expectedOutput: "out[2] = 8", description: "max(2, 8) = 8" },
    { expectedOutput: "out[3] = 9", description: "max(9, 1) = 9" },
    {
      expectedOutput: "out[0] = 5\nout[1] = 7\nout[2] = 8\nout[3] = 9",
      description: "Full element-wise max output",
    },
  ],
  hint: "Launch parallel {i} by [4]. Inside each thread, use if (A[i] > B[i]) out[i] = A[i]; else out[i] = B[i];",
};
