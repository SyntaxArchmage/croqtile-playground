import type { Challenge } from "./index";

export const challenge136: Challenge = {
  id: "c136",
  title: "Array Group By Sign",
  difficulty: "medium",
  description: `Rearrange an array so **negatives** come first, then **zeros**, then **positives** (stable within each group).

Given data = [2, -1, 0, 3, -2, 0]:

| group     | values    |
|-----------|-----------|
| negatives | -1, -2    |
| zeros     | 0, 0      |
| positives | 2, 3      |

Expected output:
\`\`\`
neg = 2
zero = 2
pos = 2
result[0] = -1
result[1] = -2
result[2] = 0
result[3] = 0
result[4] = 2
result[5] = 3
\`\`\`

**Pass 1** — \`foreach\` count each sign class. **Pass 2** — \`parallel\` placement by rank within class.`,
  starterCode: `__co__ void array_group_by_sign() {
  global int data[6];
  global int result[6];

  parallel {i} by [1] {
    data[0] = 2; data[1] = -1; data[2] = 0;
    data[3] = 3; data[4] = -2; data[5] = 0;
  }

  // TODO: pass 1 — foreach count neg, zero, pos
  // int neg = 0; int zero = 0; int pos = 0;
  // foreach i in [0:6] {
  //   if (data[i] < 0) neg = neg + 1;
  //   else if (data[i] == 0) zero = zero + 1;
  //   else pos = pos + 1;
  // }

  // TODO: pass 2 — parallel placement using rank within each class
  // parallel {i} by [6] { ... }

  // println("neg =", neg);
  // println("zero =", zero);
  // println("pos =", pos);
  // parallel {i} by [6] { println("result[", i, "] =", result[i]); }
}
`,
  tests: [
    { expectedOutput: "neg = 2", description: "Two negative elements" },
    { expectedOutput: "zero = 2", description: "Two zero elements" },
    { expectedOutput: "pos = 2", description: "Two positive elements" },
    { expectedOutput: "result[0] = -1", description: "Negatives at front" },
    { expectedOutput: "result[2] = 0", description: "Zeros after negatives" },
    { expectedOutput: "result[4] = 2", description: "Positives at end" },
    {
      expectedOutput: "neg = 2\nzero = 2\npos = 2\nresult[0] = -1\nresult[1] = -2\nresult[2] = 0\nresult[3] = 0\nresult[4] = 2\nresult[5] = 3",
      description: "Full group-by-sign output",
    },
  ],
  hint: "Pass 1: foreach count neg/zero/pos. Pass 2: parallel {i} — foreach j in [0:i] for rank within class, write to result[rank], result[neg + rank], or result[neg + zero + rank].",
};
