import type { Challenge } from "./index";

export const challenge54: Challenge = {
  id: "c54",
  title: "Parallel Sort Check",
  difficulty: "medium",
  description: `Check whether an array is sorted in non-decreasing order using \`parallel\` comparisons and a shared flag.

Given data = [1, 2, 5, 4, 7], adjacent pair (5, 4) is out of order.

Expected output:
\`\`\`
is_sorted = false
\`\`\`

Launch one thread per adjacent pair. If any thread finds \`data[i] > data[i+1]\`, set \`is_sorted\` to \`false\`.`,
  starterCode: `__co__ void parallel_sort_check() {
  global int data[5];

  parallel {i} by [1] {
    data[0] = 1; data[1] = 2; data[2] = 5;
    data[3] = 4; data[4] = 7;
  }

  // TODO: check adjacent pairs in parallel with a flag
  // bool is_sorted = true;
  // parallel {i} by [4] {
  //   if (data[i] > data[i + 1]) is_sorted = false;
  // }

  // println("is_sorted =", is_sorted);
}
`,
  tests: [
    {
      expectedOutput: "is_sorted = false",
      description: "Should detect out-of-order pair (5, 4)",
    },
  ],
  hint: "Initialize is_sorted to true. Launch parallel {i} by [4] — each thread compares data[i] and data[i+1]. Set the flag to false when data[i] > data[i+1].",
};
