import type { Challenge } from "./index";

export const challenge191: Challenge = {
  id: "c191",
  title: "Array Segment Sum",
  difficulty: "medium",
  description: `Sum **segments of length 4** from an array.

Given data = [1, 2, 3, 4, 5, 6, 7, 8] (8 elements → 2 segments):

| segment | elements      | sum |
|---------|---------------|-----|
| 0       | 1, 2, 3, 4    | 10  |
| 1       | 5, 6, 7, 8    | 30  |

Expected output:
\`\`\`
seg_sum[0] = 10
seg_sum[1] = 30
\`\`\`

Use \`parallel {s} by [2]\` with \`foreach\` over the 4 elements in each segment.`,
  starterCode: `__co__ void array_segment_sum() {
  global int data[8];
  global int seg_sum[2];
  int seg_len = 4;

  parallel {i} by [1] {
    data[0] = 1; data[1] = 2; data[2] = 3; data[3] = 4;
    data[4] = 5; data[5] = 6; data[6] = 7; data[7] = 8;
  }

  // TODO: parallel {s} by [2] {
  //   int sum = 0;
  //   foreach k in [0:seg_len] {
  //     sum = sum + data[s * seg_len + k];
  //   }
  //   seg_sum[s] = sum;
  // }

  parallel {s} by [2] {
    println("seg_sum[", s, "] =", seg_sum[s]);
  }
}
`,
  tests: [
    { expectedOutput: "seg_sum[0] = 10", description: "Segment 0: 1+2+3+4 = 10" },
    { expectedOutput: "seg_sum[1] = 30", description: "Segment 1: 5+6+7+8 = 30" },
    {
      expectedOutput: "seg_sum[0] = 10\nseg_sum[1] = 30",
      description: "All segment sums correct",
    },
  ],
  hint: "Each thread s: sum over foreach k in [0:seg_len], add data[s*seg_len + k]. Store in seg_sum[s].",
};
