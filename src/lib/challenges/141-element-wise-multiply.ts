import type { Challenge } from "./index";

export const challenge141: Challenge = {
  id: "c141",
  title: "Element-wise Multiply",
  difficulty: "easy",
  description: `Multiply corresponding elements of two arrays in parallel.

Given A = [2, 3, 4, 5] and B = [10, 20, 30, 40], compute \`C[i] = A[i] * B[i]\`.

Expected output:
\`\`\`
C[0] = 20
C[1] = 60
C[2] = 120
C[3] = 200
\`\`\`

Use \`parallel {i} by [4]\` — one thread per index multiplies the pair.`,
  starterCode: `__co__ void element_wise_multiply() {
  global int A[4];
  global int B[4];
  global int C[4];

  parallel {i} by [1] {
    A[0] = 2; A[1] = 3; A[2] = 4; A[3] = 5;
    B[0] = 10; B[1] = 20; B[2] = 30; B[3] = 40;
  }

  // TODO: compute C[i] = A[i] * B[i] in parallel

  parallel {i} by [4] {
    println("C[", i, "] =", C[i]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0] = 20", description: "2 * 10 = 20" },
    { expectedOutput: "C[1] = 60", description: "3 * 20 = 60" },
    { expectedOutput: "C[3] = 200", description: "5 * 40 = 200" },
    {
      expectedOutput: "C[0] = 20\nC[1] = 60\nC[2] = 120\nC[3] = 200",
      description: "Full element-wise multiply output",
    },
  ],
  hint: "Launch parallel {i} by [4] and assign C[i] = A[i] * B[i]. Each thread handles one index independently.",
};
