import type { Challenge } from "./index";

export const challenge188: Challenge = {
  id: "c188",
  title: "Parallel Abs Diff",
  difficulty: "easy",
  description: `Compute the **absolute difference** of two arrays element-wise using \`parallel\`.

Given A = [10, 5, 8, 3] and B = [3, 9, 2, 7]:

| i | |A[i] - B[i]| |
|---|--------------|
| 0 | |10 - 3| = 7  |
| 1 | |5 - 9| = 4   |
| 2 | |8 - 2| = 6   |
| 3 | |3 - 7| = 4   |

Expected output:
\`\`\`
diff[0] = 7
diff[1] = 4
diff[2] = 6
diff[3] = 4
\`\`\`

Use \`parallel {i} by [4]\` with \`if/else\` to compute absolute value of the difference.`,
  starterCode: `__co__ void parallel_abs_diff() {
  global int A[4];
  global int B[4];
  global int diff[4];

  parallel {i} by [1] {
    A[0] = 10; A[1] = 5; A[2] = 8; A[3] = 3;
    B[0] = 3; B[1] = 9; B[2] = 2; B[3] = 7;
  }

  // TODO: parallel {i} by [4] {
  //   int d = A[i] - B[i];
  //   if (d < 0) { diff[i] = -d; } else { diff[i] = d; }
  // }

  parallel {i} by [4] {
    println("diff[", i, "] =", diff[i]);
  }
}
`,
  tests: [
    { expectedOutput: "diff[0] = 7", description: "|10 - 3| = 7" },
    { expectedOutput: "diff[1] = 4", description: "|5 - 9| = 4" },
    { expectedOutput: "diff[2] = 6", description: "|8 - 2| = 6" },
    {
      expectedOutput: "diff[0] = 7\ndiff[1] = 4\ndiff[2] = 6\ndiff[3] = 4",
      description: "All absolute differences correct",
    },
  ],
  hint: "Inside parallel {i} by [4]: compute d = A[i] - B[i], then if d < 0 set diff[i] = -d else diff[i] = d.",
};
