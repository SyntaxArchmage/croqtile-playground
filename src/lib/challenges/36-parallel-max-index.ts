import type { Challenge } from "./index";

export const challenge36: Challenge = {
  id: "c36",
  title: "Parallel Max Index",
  difficulty: "hard",
  description: `Find the index and value of the maximum element in an array.

Given data = [3, 7, 2, 9, 1, 6, 4, 8], the maximum is 9 at index 3.

Expected output:
\`\`\`
Max index: 3, value: 9
\`\`\`

Use a sequential \`foreach\` loop to track both the best value and its index. When you find a new maximum, update both trackers.`,
  starterCode: `__co__ void parallel_max_index() {
  global int data[8];

  // Initialize: [3, 7, 2, 9, 1, 6, 4, 8]
  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = 2; data[3] = 9;
    data[4] = 1; data[5] = 6; data[6] = 4; data[7] = 8;
  }

  // TODO: scan with foreach, tracking max value and its index
  // int max_idx = 0;
  // int max_val = data[0];
  // foreach i in [0:8] {
  //   if (data[i] > max_val) { max_val = data[i]; max_idx = i; }
  // }

  // println("Max index:", max_idx, ", value:", max_val);
}
`,
  tests: [
    {
      expectedOutput: "Max index: 3, value: 9",
      description: "Should report index 3 and value 9",
    },
  ],
  hint: "Initialize max_val from data[0] and max_idx to 0. In foreach, when data[i] > max_val, update both max_val and max_idx.",
};
