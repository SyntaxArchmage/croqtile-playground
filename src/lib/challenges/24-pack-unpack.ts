import type { Challenge } from "./index";

export const challenge24: Challenge = {
  id: "c24",
  title: "Pack & Unpack",
  difficulty: "easy",
  description: `Pack two arrays A and B into a single interleaved array C, then unpack back.

Given:
- A = [10, 20, 30, 40]
- B = [11, 21, 31, 41]

Packed (interleaved): C = [10, 11, 20, 21, 30, 31, 40, 41]

Print the packed array.

Expected output:
\`\`\`
C[0] = 10
C[1] = 11
C[2] = 20
C[3] = 21
C[4] = 30
C[5] = 31
C[6] = 40
C[7] = 41
\`\`\``,
  starterCode: `__co__ void pack_unpack() {
  global float A[4];
  global float B[4];
  global float C[8];

  parallel {i} by [4] {
    A[i] = (float)((i + 1) * 10);
    B[i] = (float)((i + 1) * 10 + 1);
  }

  // TODO: interleave A and B into C
  // C[i*2] = A[i], C[i*2 + 1] = B[i]

  parallel {i} by [8] {
    println("C[", i, "] =", C[i]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0] = 10", description: "First element from A" },
    { expectedOutput: "C[1] = 11", description: "First element from B" },
    { expectedOutput: "C[0] = 10\nC[1] = 11\nC[2] = 20\nC[3] = 21\nC[4] = 30\nC[5] = 31\nC[6] = 40\nC[7] = 41", description: "Full interleaved output" },
  ],
  hint: "Use parallel {i} by [4] and set C[i*2] = A[i] and C[i*2+1] = B[i].",
};
