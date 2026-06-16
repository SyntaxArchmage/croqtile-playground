import type { Challenge } from "./index";

export const challenge96: Challenge = {
  id: "c96",
  title: "Array Difference",
  difficulty: "medium",
  description: `Compute element-wise difference of two arrays using \`parallel\`.

Given A = [10, 20, 30, 40] and B = [1, 5, 8, 15], compute \`diff[i] = A[i] - B[i]\`.

Expected output:
\`\`\`
diff[0] = 9
diff[1] = 15
diff[2] = 22
diff[3] = 25
\`\`\`

Use \`parallel {i} by [4]\` — one thread per element subtracts independently.`,
  starterCode: `__co__ void array_difference() {
  global int A[4];
  global int B[4];
  global int diff[4];

  parallel {i} by [4] { A[i] = (i + 1) * 10; }
  parallel {i} by [4] { B[i] = i + 1; }

  // TODO: compute diff[i] = A[i] - B[i] in parallel
  // parallel {i} by [4] { diff[i] = A[i] - B[i]; }

  parallel {i} by [4] {
    println("diff[", i, "] =", diff[i]);
  }
}
`,
  tests: [
    { expectedOutput: "diff[0] = 9", description: "10 - 1 = 9" },
    { expectedOutput: "diff[1] = 15", description: "20 - 5 = 15" },
    { expectedOutput: "diff[2] = 22", description: "30 - 8 = 22" },
    { expectedOutput: "diff[3] = 25", description: "40 - 15 = 25" },
    {
      expectedOutput: "diff[0] = 9\ndiff[1] = 15\ndiff[2] = 22\ndiff[3] = 25",
      description: "Full array difference output",
    },
  ],
  hint: "Launch parallel {i} by [4] and assign diff[i] = A[i] - B[i]. Each thread handles one index independently.",
};
