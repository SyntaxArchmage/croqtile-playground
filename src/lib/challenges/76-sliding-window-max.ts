import type { Challenge } from "./index";

export const challenge76: Challenge = {
  id: "c76",
  title: "Sliding Window Max",
  difficulty: "hard",
  description: `Find the maximum value in each sliding window of size 3.

Given data = [3, 1, 4, 1, 5, 9, 2, 6], there are six windows:

| start | window   | max |
|-------|----------|-----|
| 0     | 3, 1, 4  | 4   |
| 1     | 1, 4, 1  | 4   |
| 2     | 4, 1, 5  | 5   |
| 3     | 1, 5, 9  | 9   |
| 4     | 5, 9, 2  | 9   |
| 5     | 9, 2, 6  | 9   |

Expected output:
\`\`\`
max[0] = 4
max[1] = 4
max[2] = 5
max[3] = 9
max[4] = 9
max[5] = 9
\`\`\`

Use \`foreach start in [0:6]\` for each window origin, then scan the three elements in that window to find the max.`,
  starterCode: `__co__ void sliding_window_max() {
  global int data[8];
  global int max_out[6];
  int window_size = 3;
  int num_windows = 6;

  parallel {i} by [1] {
    data[0] = 3; data[1] = 1; data[2] = 4; data[3] = 1;
    data[4] = 5; data[5] = 9; data[6] = 2; data[7] = 6;
  }

  // TODO: foreach start in [0:6]
  //   int local_max = data[start];
  //   foreach offset in [1:3] { compare data[start + offset] }
  //   max_out[start] = local_max;

  parallel {i} by [6] {
    println("max[", i, "] =", max_out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "max[0] = 4", description: "Window [3,1,4] max is 4" },
    { expectedOutput: "max[3] = 9", description: "Window [1,5,9] max is 9" },
    { expectedOutput: "max[5] = 9", description: "Last window [9,2,6] max is 9" },
    {
      expectedOutput: "max[0] = 4\nmax[1] = 4\nmax[2] = 5\nmax[3] = 9\nmax[4] = 9\nmax[5] = 9",
      description: "Full sliding window max output",
    },
  ],
  hint: "Outer foreach over start in [0:6]. Inner foreach over offset in [0:3] compares data[start + offset] against a running local_max.",
};
