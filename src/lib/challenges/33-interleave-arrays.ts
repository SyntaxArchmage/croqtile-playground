import type { Challenge } from "./index";

export const challenge33: Challenge = {
  id: "c33",
  title: "Interleave Arrays",
  difficulty: "easy",
  description: `Interleave two arrays into a single output array.

Given:
- A = [1, 2, 3, 4]
- B = [10, 20, 30, 40]

Produce C = [A[0], B[0], A[1], B[1], A[2], B[2], A[3], B[3]] = [1, 10, 2, 20, 3, 30, 4, 40]

Expected output:
\`\`\`
C[0] = 1
C[1] = 10
C[2] = 2
C[3] = 20
C[4] = 3
C[5] = 30
C[6] = 4
C[7] = 40
\`\`\`

Use \`parallel {i} by [4]\` — each thread writes one pair of interleaved elements.`,
  starterCode: `__co__ void interleave_arrays() {
  global float A[4];
  global float B[4];
  global float C[8];

  parallel {i} by [4] {
    A[i] = (float)(i + 1);
    B[i] = (float)((i + 1) * 10);
  }

  // TODO: interleave A and B into C with parallel
  // C[i*2] = A[i]; C[i*2 + 1] = B[i];

  parallel {i} by [8] {
    println("C[", i, "] =", C[i]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0] = 1", description: "First element from A" },
    { expectedOutput: "C[1] = 10", description: "First element from B" },
    {
      expectedOutput: "C[0] = 1\nC[1] = 10\nC[2] = 2\nC[3] = 20\nC[4] = 3\nC[5] = 30\nC[6] = 4\nC[7] = 40",
      description: "Full interleaved output",
    },
  ],
  hint: "Each thread i writes two slots: C[i*2] = A[i] and C[i*2+1] = B[i].",
};
