import type { Challenge } from "./index";

export const challenge41: Challenge = {
  id: "c41",
  title: "Running Sum",
  difficulty: "easy",
  description: `Compute the running sum (cumulative total) of an array using a \`foreach\` loop.

Given data = [2, 3, 1, 4, 2, 5], compute running[i] = sum(data[0..i]).

Expected output:
\`\`\`
running[0] = 2
running[1] = 5
running[2] = 6
running[3] = 10
running[4] = 12
running[5] = 17
\`\`\`

Print each cumulative sum as: running[i] = <value>`,
  starterCode: `__co__ void running_sum() {
  global int data[6];
  global int running[6];

  parallel {i} by [6] {
    data[0] = 2; data[1] = 3; data[2] = 1;
    data[3] = 4; data[4] = 2; data[5] = 5;
  }

  // TODO: compute running sum with foreach
  // running[0] = data[0]
  // foreach i in [1:6] { running[i] = running[i-1] + data[i]; }

  parallel {i} by [6] {
    println("running[", i, "] =", running[i]);
  }
}
`,
  tests: [
    { expectedOutput: "running[0] = 2", description: "First element equals itself" },
    { expectedOutput: "running[2] = 6", description: "Cumulative sum at index 2" },
    { expectedOutput: "running[5] = 17", description: "Final cumulative sum" },
    {
      expectedOutput: "running[0] = 2\nrunning[1] = 5\nrunning[2] = 6\nrunning[3] = 10\nrunning[4] = 12\nrunning[5] = 17",
      description: "Full running sum output",
    },
  ],
  hint: "Set running[0] = data[0], then foreach i in [1:6] { running[i] = running[i-1] + data[i]; }.",
};
