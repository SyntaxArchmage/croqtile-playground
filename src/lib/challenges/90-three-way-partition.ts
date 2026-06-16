import type { Challenge } from "./index";

export const challenge90: Challenge = {
  id: "c90",
  title: "Three-Way Partition",
  difficulty: "hard",
  description: `Partition an array into **negatives**, then **zeros**, then **positives**.

Given data = [-3, 1, 0, -1, 0, 2, -2] (7 elements), produce result = [-3, -1, -2, 0, 0, 1, 2].

**Pass 1** — \`foreach\` counting: **neg = 3**, **zero = 2**, **pos = 2**

**Pass 2** — \`parallel\` placement: each thread \`i\` computes its rank within its value class and writes to the correct bucket.

Expected output:
\`\`\`
neg = 3
zero = 2
pos = 2
result[0] = -3
result[1] = -1
result[2] = -2
result[3] = 0
result[4] = 0
result[5] = 1
result[6] = 2
\`\`\``,
  starterCode: `__co__ void three_way_partition() {
  global int data[7];
  global int result[7];

  parallel {i} by [1] {
    data[0] = -3; data[1] = 1;  data[2] = 0;
    data[3] = -1; data[4] = 0;  data[5] = 2;  data[6] = -2;
  }

  // TODO: pass 1 — foreach count negatives, zeros, positives
  // int neg = 0; int zero = 0; int pos = 0;
  // foreach i in [0:7] {
  //   if (data[i] < 0) neg = neg + 1;
  //   else if (data[i] == 0) zero = zero + 1;
  //   else pos = pos + 1;
  // }

  // TODO: pass 2 — parallel placement using rank within each class
  // parallel {i} by [7] {
  //   int rank = 0;
  //   if (data[i] < 0) {
  //     foreach j in [0:i] { if (data[j] < 0) rank = rank + 1; }
  //     result[rank] = data[i];
  //   } else if (data[i] == 0) {
  //     foreach j in [0:i] { if (data[j] == 0) rank = rank + 1; }
  //     result[neg + rank] = data[i];
  //   } else {
  //     foreach j in [0:i] { if (data[j] > 0) rank = rank + 1; }
  //     result[neg + zero + rank] = data[i];
  //   }
  // }

  // println("neg =", neg);
  // println("zero =", zero);
  // println("pos =", pos);
  // foreach i in [0:7] { println("result[", i, "] =", result[i]); }
}
`,
  tests: [
    { expectedOutput: "neg = 3", description: "Three negative elements" },
    { expectedOutput: "zero = 2", description: "Two zero elements" },
    { expectedOutput: "pos = 2", description: "Two positive elements" },
    { expectedOutput: "result[0] = -3", description: "First negative at front" },
    { expectedOutput: "result[3] = 0", description: "Zeros start after negatives" },
    { expectedOutput: "result[5] = 1", description: "Positives at end" },
    {
      expectedOutput: "neg = 3\nzero = 2\npos = 2\nresult[0] = -3\nresult[1] = -1\nresult[2] = -2\nresult[3] = 0\nresult[4] = 0\nresult[5] = 1\nresult[6] = 2",
      description: "Full three-way partition output",
    },
  ],
  hint: "Pass 1: foreach and count neg/zero/pos. Pass 2: parallel {i} by [7] — for each element, foreach j in [0:i] to compute rank within its class, then write to result[rank], result[neg + rank], or result[neg + zero + rank].",
};
