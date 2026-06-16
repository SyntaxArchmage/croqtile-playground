import type { Challenge } from "./index";

export const challenge124: Challenge = {
  id: "c124",
  title: "Parallel Min Index",
  difficulty: "hard",
  description: `Find the **index** and **value** of the minimum element in an array.

Given data = [8, 3, 5, 1, 9, 2], the minimum is **1** at index **3**.

Expected output:
\`\`\`
Min index: 3, value: 1
\`\`\`

Use a sequential \`foreach\` loop to track both the best value and its index. When you find a new minimum, update both trackers.`,
  starterCode: `__co__ void parallel_min_index() {
  global int data[6];

  parallel {i} by [1] {
    data[0] = 8; data[1] = 3; data[2] = 5;
    data[3] = 1; data[4] = 9; data[5] = 2;
  }

  // TODO: scan with foreach, tracking min value and its index
  // int min_idx = 0;
  // int min_val = data[0];
  // foreach i in [0:6] {
  //   if (data[i] < min_val) { min_val = data[i]; min_idx = i; }
  // }

  // println("Min index:", min_idx, ", value:", min_val);
}
`,
  tests: [
    {
      expectedOutput: "Min index: 3, value: 1",
      description: "Should report index 3 and value 1",
    },
  ],
  hint: "Initialize min_val from data[0] and min_idx to 0. In foreach, when data[i] < min_val, update both min_val and min_idx.",
};
