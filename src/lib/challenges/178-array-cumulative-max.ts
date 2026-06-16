import type { Challenge } from "./index";

export const challenge178: Challenge = {
  id: "c178",
  title: "Array Cumulative Max",
  difficulty: "medium",
  description: `Compute the **running maximum prefix** of an array.

Given data = [3, 7, 2, 9, 1, 6, 4, 8], at each index i:

\`cum_max[i] = max(data[0], data[1], ..., data[i])\`

Expected output:
\`\`\`
cum_max[0] = 3
cum_max[1] = 7
cum_max[2] = 7
cum_max[3] = 9
cum_max[4] = 9
cum_max[5] = 9
cum_max[6] = 9
cum_max[7] = 9
\`\`\`

Use a \`foreach\` sequential loop to maintain a running max variable.`,
  starterCode: `__co__ void array_cumulative_max() {
  global int data[8];
  global int cum_max[8];

  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = 2; data[3] = 9;
    data[4] = 1; data[5] = 6; data[6] = 4; data[7] = 8;
  }

  // TODO: compute cumulative max with foreach
  // int max_so_far = data[0];
  // foreach i in [0:8] {
  //   if (data[i] > max_so_far) { max_so_far = data[i]; }
  //   cum_max[i] = max_so_far;
  // }

  parallel {i} by [8] {
    println("cum_max[", i, "] =", cum_max[i]);
  }
}
`,
  tests: [
    { expectedOutput: "cum_max[0] = 3", description: "First element equals itself" },
    { expectedOutput: "cum_max[3] = 9", description: "Max jumps to 9 at index 3" },
    { expectedOutput: "cum_max[7] = 9", description: "Max stays 9 through end" },
    {
      expectedOutput: "cum_max[0] = 3\ncum_max[1] = 7\ncum_max[2] = 7\ncum_max[3] = 9\ncum_max[4] = 9\ncum_max[5] = 9\ncum_max[6] = 9\ncum_max[7] = 9",
      description: "Full cumulative max prefix output",
    },
  ],
  hint: "Use foreach to iterate through data sequentially. Track max_so_far; update when data[i] is larger, then store in cum_max[i].",
};
