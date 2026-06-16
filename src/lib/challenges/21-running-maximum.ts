import type { Challenge } from "./index";

export const challenge21: Challenge = {
  id: "c21",
  title: "Running Maximum",
  difficulty: "medium",
  description: `Given an array of 8 integers [3, 7, 2, 9, 1, 6, 4, 8], compute the running maximum.

At each index i, running_max[i] = max(data[0], data[1], ..., data[i]).

Expected output:
\`\`\`
running_max[0] = 3
running_max[1] = 7
running_max[2] = 7
running_max[3] = 9
running_max[4] = 9
running_max[5] = 9
running_max[6] = 9
running_max[7] = 9
\`\`\`

Use a foreach sequential loop to maintain a running max variable.`,
  starterCode: `__co__ void running_maximum() {
  global int data[8];
  global int running_max[8];

  // Initialize: [3, 7, 2, 9, 1, 6, 4, 8]
  parallel {i} by [8] {
    data[0] = 3; data[1] = 7; data[2] = 2; data[3] = 9;
    data[4] = 1; data[5] = 6; data[6] = 4; data[7] = 8;
  }

  // TODO: compute running maximum with foreach
  // running_max[0] = data[0]
  // running_max[i] = max(running_max[i-1], data[i])

  parallel {i} by [8] {
    println("running_max[", i, "] =", running_max[i]);
  }
}
`,
  tests: [
    { expectedOutput: "running_max[0] = 3", description: "First element equals itself" },
    { expectedOutput: "running_max[3] = 9", description: "Max jumps to 9 at index 3" },
    { expectedOutput: "running_max[7] = 9", description: "Max stays 9 through end" },
  ],
  hint: "Use foreach to iterate through data sequentially, maintaining a running max variable.",
};
