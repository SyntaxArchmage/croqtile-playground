import type { Challenge } from "./index";

export const challenge115: Challenge = {
  id: "c115",
  title: "Sliding Window Maximum",
  difficulty: "hard",
  description: `Find the maximum value in each sliding window of size **3**.

Given data = [8, 2, 7, 4, 6, 1, 9], there are five windows:

| start | window   | max |
|-------|----------|-----|
| 0     | 8, 2, 7  | 8   |
| 1     | 2, 7, 4  | 7   |
| 2     | 7, 4, 6  | 7   |
| 3     | 4, 6, 1  | 6   |
| 4     | 6, 1, 9  | 9   |

Expected output:
\`\`\`
max[0] = 8
max[1] = 7
max[2] = 7
max[3] = 6
max[4] = 9
\`\`\`

Use \`foreach start in [0:5]\` for each window origin, then scan the three elements to find the max.`,
  starterCode: `__co__ void sliding_window_maximum() {
  global int data[7];
  global int max_out[5];
  int window_size = 3;
  int num_windows = 5;

  parallel {i} by [1] {
    data[0] = 8; data[1] = 2; data[2] = 7; data[3] = 4;
    data[4] = 6; data[5] = 1; data[6] = 9;
  }

  // TODO: foreach start in [0:5]
  //   int local_max = data[start];
  //   foreach offset in [1:3] { compare data[start + offset] }
  //   max_out[start] = local_max;

  parallel {i} by [5] {
    println("max[", i, "] =", max_out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "max[0] = 8", description: "Window [8,2,7] max is 8" },
    { expectedOutput: "max[1] = 7", description: "Window [2,7,4] max is 7" },
    { expectedOutput: "max[4] = 9", description: "Last window [6,1,9] max is 9" },
    {
      expectedOutput: "max[0] = 8\nmax[1] = 7\nmax[2] = 7\nmax[3] = 6\nmax[4] = 9",
      description: "Full sliding window max output",
    },
  ],
  hint: "Outer foreach over start in [0:5]. Inner foreach over offset in [0:3] compares data[start + offset] against a running local_max.",
};
