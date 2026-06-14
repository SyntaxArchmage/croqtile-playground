import type { Challenge } from "./index";

export const challenge12: Challenge = {
  id: "ch12",
  title: "Broadcast Add",
  difficulty: "easy",
  description: `Add a scalar value to every element of an array using parallel execution.

Given data = [0, 10, 20, 30] and scalar = 5, compute result[i] = data[i] + scalar.

Print each result as: result[i] = <value>`,
  starterCode: `__co__ void broadcast_add() {
  global float data[4];
  global float result[4];

  parallel {i} by [4] {
    data[i] = (float)(i * 10);
  }

  float scalar = 5.0f;

  // TODO: add scalar to each element in parallel
  // result[i] = data[i] + scalar

  parallel {i} by [4] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { description: "result[0] = 5", expectedOutput: "result[0] = 5" },
    { description: "result[1] = 15", expectedOutput: "result[1] = 15" },
    { description: "result[3] = 35", expectedOutput: "result[3] = 35" },
  ],
  hint: "Use a parallel block: parallel {i} by [4] { result[i] = data[i] + scalar; }",
};
