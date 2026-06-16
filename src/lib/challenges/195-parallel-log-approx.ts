import type { Challenge } from "./index";

export const challenge195: Challenge = {
  id: "c195",
  title: "Parallel Log Approx",
  difficulty: "medium",
  description: `Approximate **log₂** of each element using a bit-trick loop in \`parallel\`.

Given data = [1, 2, 4, 8, 16] (powers of 2):

| data[i] | log₂(data[i]) |
|---------|---------------|
| 1       | 0             |
| 2       | 1             |
| 4       | 2             |
| 8       | 3             |
| 16      | 4             |

**Bit trick:** repeatedly divide by 2 and count iterations until value reaches 1.

Expected output:
\`\`\`
log2[0] = 0
log2[1] = 1
log2[2] = 2
log2[3] = 3
log2[4] = 4
\`\`\`

Use \`parallel {i} by [5]\` with a \`while\` loop dividing by 2.`,
  starterCode: `__co__ void parallel_log_approx() {
  global int data[5];
  global int log2[5];

  parallel {i} by [1] {
    data[0] = 1; data[1] = 2; data[2] = 4; data[3] = 8; data[4] = 16;
  }

  // TODO: parallel {i} by [5] {
  //   int v = data[i];
  //   int count = 0;
  //   while (v > 1) {
  //     v = v / 2;
  //     count = count + 1;
  //   }
  //   log2[i] = count;
  // }

  parallel {i} by [5] {
    println("log2[", i, "] =", log2[i]);
  }
}
`,
  tests: [
    { expectedOutput: "log2[0] = 0", description: "log₂(1) = 0" },
    { expectedOutput: "log2[1] = 1", description: "log₂(2) = 1" },
    { expectedOutput: "log2[3] = 3", description: "log₂(8) = 3" },
    { expectedOutput: "log2[4] = 4", description: "log₂(16) = 4" },
    {
      expectedOutput: "log2[0] = 0\nlog2[1] = 1\nlog2[2] = 2\nlog2[3] = 3\nlog2[4] = 4",
      description: "All log₂ approximations correct",
    },
  ],
  hint: "Inside parallel {i} by [5]: set v=data[i], count=0, while v>1 divide v by 2 and increment count. Store count in log2[i].",
};
