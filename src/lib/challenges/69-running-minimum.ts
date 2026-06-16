import type { Challenge } from "./index";

export const challenge69: Challenge = {
  id: "c69",
  title: "Running Minimum",
  difficulty: "medium",
  description: `Given an array of 8 integers [3, 7, 2, 9, 1, 6, 4, 8], compute the **running minimum**.

At each index i, running_min[i] = min(data[0], data[1], ..., data[i]).

Expected output:
\`\`\`
running_min[0] = 3
running_min[1] = 3
running_min[2] = 2
running_min[3] = 2
running_min[4] = 1
running_min[5] = 1
running_min[6] = 1
running_min[7] = 1
\`\`\`

Use a \`foreach\` sequential loop to maintain a running min variable.`,
  starterCode: `__co__ void running_minimum() {
  global int data[8];
  global int running_min[8];

  parallel {i} by [8] {
    data[0] = 3; data[1] = 7; data[2] = 2; data[3] = 9;
    data[4] = 1; data[5] = 6; data[6] = 4; data[7] = 8;
  }

  // TODO: compute running minimum with foreach
  // int min_so_far = data[0];
  // foreach i in [0:8] {
  //   if (data[i] < min_so_far) { min_so_far = data[i]; }
  //   running_min[i] = min_so_far;
  // }

  parallel {i} by [8] {
    println("running_min[", i, "] =", running_min[i]);
  }
}
`,
  tests: [
    { expectedOutput: "running_min[0] = 3", description: "First element equals itself" },
    { expectedOutput: "running_min[2] = 2", description: "Min drops to 2 at index 2" },
    { expectedOutput: "running_min[4] = 1", description: "Min drops to 1 at index 4" },
    { expectedOutput: "running_min[7] = 1", description: "Min stays 1 through end" },
  ],
  hint: "Use foreach to iterate through data sequentially. Track min_so_far; update when data[i] is smaller, then store in running_min[i].",
};
