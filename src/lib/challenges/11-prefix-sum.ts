import type { Challenge } from "./index";

export const challenge11: Challenge = {
  id: "c11",
  title: "Prefix Sum",
  difficulty: "medium",
  description: `Compute the prefix sum (inclusive scan) of an array of 8 elements.

Given data = [1, 2, 3, 4, 5, 6, 7, 8], compute prefix[i] = sum(data[0..i]).

Print each result as: prefix[i] = <value>`,
  starterCode: `__co__ void prefix_sum() {
  global float data[8];
  global float prefix[8];

  // Initialize data
  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  // TODO: compute inclusive prefix sum
  // prefix[0] = data[0]
  // prefix[i] = prefix[i-1] + data[i]

  parallel {i} by [8] {
    println("prefix[", i, "] =", prefix[i]);
  }
}
`,
  tests: [
    { description: "prefix[0] = 1", expectedOutput: "prefix[0] = 1" },
    { description: "prefix[3] = 10", expectedOutput: "prefix[3] = 10" },
    { description: "prefix[7] = 36", expectedOutput: "prefix[7] = 36" },
  ],
  hint: "Use a foreach loop to accumulate values sequentially: prefix[0] = data[0], then prefix[i] = prefix[i-1] + data[i].",
};
