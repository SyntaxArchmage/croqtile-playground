import type { Challenge } from "./index";

export const challenge129: Challenge = {
  id: "c129",
  title: "Array Zip Sum",
  difficulty: "medium",
  description: `Compute \`a[i] + b[N - 1 - i]\` for each position using \`parallel\`.

Given A = [10, 20, 30, 40] and B = [1, 2, 3, 4] with N = 4:

| i | A[i] | B[N-1-i] | zip[i] |
|---|------|----------|--------|
| 0 | 10   | 4        | 14     |
| 1 | 20   | 3        | 23     |
| 2 | 30   | 2        | 32     |
| 3 | 40   | 1        | 41     |

Expected output:
\`\`\`
zip[0] = 14
zip[1] = 23
zip[2] = 32
zip[3] = 41
\`\`\`

Use \`parallel {i} by [4]\` — each thread sums one element from A with the mirrored element from B.`,
  starterCode: `__co__ void array_zip_sum() {
  int N = 4;
  global int A[4];
  global int B[4];
  global int zip[4];

  parallel {i} by [4] { A[i] = (i + 1) * 10; }
  parallel {i} by [4] { B[i] = i + 1; }

  // TODO: zip[i] = A[i] + B[N - 1 - i] in parallel {i} by [4]

  parallel {i} by [4] {
    println("zip[", i, "] =", zip[i]);
  }
}
`,
  tests: [
    { expectedOutput: "zip[0] = 14", description: "10 + 4 = 14" },
    { expectedOutput: "zip[1] = 23", description: "20 + 3 = 23" },
    { expectedOutput: "zip[2] = 32", description: "30 + 2 = 32" },
    { expectedOutput: "zip[3] = 41", description: "40 + 1 = 41" },
    {
      expectedOutput: "zip[0] = 14\nzip[1] = 23\nzip[2] = 32\nzip[3] = 41",
      description: "Full zip sum output",
    },
  ],
  hint: "Each thread i computes zip[i] = A[i] + B[N - 1 - i]. The B index mirrors around the center.",
};
