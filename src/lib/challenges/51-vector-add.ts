import type { Challenge } from "./index";

export const challenge51: Challenge = {
  id: "c51",
  title: "Vector Add",
  difficulty: "easy",
  description: `Add two arrays element-wise using \`parallel\`.

Given A = [10, 20, 30, 40] and B = [1, 2, 3, 4], compute sum[i] = A[i] + B[i].

Expected output:
\`\`\`
sum[0] = 11
sum[1] = 22
sum[2] = 33
sum[3] = 44
\`\`\`

Use \`parallel {i} by [4]\` — one thread per element.`,
  starterCode: `__co__ void vector_add() {
  global int A[4];
  global int B[4];
  global int sum[4];

  parallel {i} by [4] { A[i] = (i + 1) * 10; }
  parallel {i} by [4] { B[i] = i + 1; }

  // TODO: compute sum[i] = A[i] + B[i] in parallel
  // parallel {i} by [4] { sum[i] = A[i] + B[i]; }

  parallel {i} by [4] {
    println("sum[", i, "] =", sum[i]);
  }
}
`,
  tests: [
    { expectedOutput: "sum[0] = 11", description: "First element: 10 + 1" },
    { expectedOutput: "sum[2] = 33", description: "Third element: 30 + 3" },
    { expectedOutput: "sum[3] = 44", description: "Last element: 40 + 4" },
    {
      expectedOutput: "sum[0] = 11\nsum[1] = 22\nsum[2] = 33\nsum[3] = 44",
      description: "Full vector add output",
    },
  ],
  hint: "Launch parallel {i} by [4] and assign sum[i] = A[i] + B[i]. Each thread handles one index independently.",
};
