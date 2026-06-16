import type { Challenge } from "./index";

export const challenge176: Challenge = {
  id: "c176",
  title: "Parallel Min",
  difficulty: "easy",
  description: `Find the **minimum of each element pair** from two arrays using \`parallel\`.

Given A = [8, 3, 5, 9] and B = [2, 7, 1, 4]:

| i | min(A[i], B[i]) |
|---|-----------------|
| 0 | min(8, 2) = 2   |
| 1 | min(3, 7) = 3   |
| 2 | min(5, 1) = 1   |
| 3 | min(9, 4) = 4   |

Expected output:
\`\`\`
min[0] = 2
min[1] = 3
min[2] = 1
min[3] = 4
\`\`\`

Use \`parallel {i} by [4]\` with an \`if/else\` to pick the smaller value.`,
  starterCode: `__co__ void parallel_min() {
  global int A[4];
  global int B[4];
  global int min[4];

  parallel {i} by [1] {
    A[0] = 8; A[1] = 3; A[2] = 5; A[3] = 9;
    B[0] = 2; B[1] = 7; B[2] = 1; B[3] = 4;
  }

  // TODO: parallel {i} by [4] {
  //   if (A[i] < B[i]) { min[i] = A[i]; } else { min[i] = B[i]; }
  // }

  parallel {i} by [4] {
    println("min[", i, "] =", min[i]);
  }
}
`,
  tests: [
    { expectedOutput: "min[0] = 2", description: "min(8, 2) = 2" },
    { expectedOutput: "min[1] = 3", description: "min(3, 7) = 3" },
    { expectedOutput: "min[2] = 1", description: "min(5, 1) = 1" },
    { expectedOutput: "min[3] = 4", description: "min(9, 4) = 4" },
    {
      expectedOutput: "min[0] = 2\nmin[1] = 3\nmin[2] = 1\nmin[3] = 4",
      description: "All pairwise minima correct",
    },
  ],
  hint: "Inside parallel {i} by [4]: if A[i] < B[i] then min[i] = A[i], else min[i] = B[i].",
};
