import type { Challenge } from "./index";

export const challenge133: Challenge = {
  id: "c133",
  title: "Array Moving Sum",
  difficulty: "medium",
  description: `Compute a **moving sum** with window size 2: each output is the sum of two adjacent elements.

Given data = [10, 20, 30, 40, 50]:

| i | data[i] + data[i+1] | move[i] |
|---|---------------------|---------|
| 0 | 10 + 20             | 30      |
| 1 | 20 + 30             | 50      |
| 2 | 30 + 40             | 70      |
| 3 | 40 + 50             | 90      |

Expected output:
\`\`\`
move[0] = 30
move[1] = 50
move[2] = 70
move[3] = 90
\`\`\`

Use \`parallel {i} by [4]\` — each thread sums one adjacent pair.`,
  starterCode: `__co__ void array_moving_sum() {
  global int data[5];
  global int move[4];

  parallel {i} by [5] {
    data[i] = (i + 1) * 10;
  }

  // TODO: move[i] = data[i] + data[i + 1] in parallel {i} by [4]

  parallel {i} by [4] {
    println("move[", i, "] =", move[i]);
  }
}
`,
  tests: [
    { expectedOutput: "move[0] = 30", description: "10 + 20 = 30" },
    { expectedOutput: "move[1] = 50", description: "20 + 30 = 50" },
    { expectedOutput: "move[3] = 90", description: "40 + 50 = 90" },
    {
      expectedOutput: "move[0] = 30\nmove[1] = 50\nmove[2] = 70\nmove[3] = 90",
      description: "Full moving sum output",
    },
  ],
  hint: "Each thread i computes move[i] = data[i] + data[i + 1]. There are N-1 windows for an N-element array.",
};
