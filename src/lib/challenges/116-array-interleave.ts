import type { Challenge } from "./index";

export const challenge116: Challenge = {
  id: "c116",
  title: "Array Interleave",
  difficulty: "medium",
  description: `Interleave two arrays into a single output array: **[a0, b0, a1, b1, ...]**.

Given:
- A = [10, 20, 30]
- B = [1, 2, 3]

Produce C = [10, 1, 20, 2, 30, 3].

Expected output:
\`\`\`
C[0] = 10
C[1] = 1
C[2] = 20
C[3] = 2
C[4] = 30
C[5] = 3
\`\`\`

Use \`parallel {i} by [3]\` — each thread writes one pair: \`C[i*2] = A[i]\` and \`C[i*2 + 1] = B[i]\`.`,
  starterCode: `__co__ void array_interleave() {
  global int A[3];
  global int B[3];
  global int C[6];

  parallel {i} by [1] {
    A[0] = 10; A[1] = 20; A[2] = 30;
    B[0] = 1; B[1] = 2; B[2] = 3;
  }

  // TODO: interleave A and B into C with parallel
  // parallel {i} by [3] {
  //   C[i * 2] = A[i];
  //   C[i * 2 + 1] = B[i];
  // }

  parallel {i} by [6] {
    println("C[", i, "] =", C[i]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0] = 10", description: "First element from A" },
    { expectedOutput: "C[1] = 1", description: "First element from B" },
    { expectedOutput: "C[4] = 30", description: "Last element from A" },
    {
      expectedOutput: "C[0] = 10\nC[1] = 1\nC[2] = 20\nC[3] = 2\nC[4] = 30\nC[5] = 3",
      description: "Full interleaved output",
    },
  ],
  hint: "Each thread i writes two slots: C[i*2] = A[i] and C[i*2+1] = B[i].",
};
