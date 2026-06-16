import type { Challenge } from "./index";

export const challenge106: Challenge = {
  id: "c106",
  title: "Dot Product",
  difficulty: "easy",
  description: `Compute the dot product of two 3-element vectors using \`foreach\` accumulation.

Given:
- A = [2, 3, 4]
- B = [1, 0, 5]

dot(A, B) = 2*1 + 3*0 + 4*5 = 2 + 0 + 20 = **22**

Expected output:
\`\`\`
dot = 22
\`\`\``,
  starterCode: `__co__ void dot_product() {
  global int A[3];
  global int B[3];

  parallel {i} by [1] {
    A[0] = 2; A[1] = 3; A[2] = 4;
    B[0] = 1; B[1] = 0; B[2] = 5;
  }

  int result = 0;
  // TODO: foreach k in [0:3] { result = result + A[k] * B[k]; }

  println("dot =", result);
}
`,
  tests: [
    { expectedOutput: "dot = 22", description: "Dot product = 2*1 + 3*0 + 4*5 = 22" },
  ],
  hint: "Initialize result = 0, then foreach k in [0:3] accumulate result = result + A[k] * B[k].",
};
