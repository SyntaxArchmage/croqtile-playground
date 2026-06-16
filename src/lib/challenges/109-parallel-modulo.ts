import type { Challenge } from "./index";

export const challenge109: Challenge = {
  id: "c109",
  title: "Parallel Modulo",
  difficulty: "easy",
  description: `Compute element-wise modulo of an array by a constant using \`parallel\`.

Given data = [10, 17, 23, 30, 45] and divisor = **7**, store \`data[i] % 7\` in \`result[i]\`.

Expected values: [3, 3, 2, 2, 3]

Expected output:
\`\`\`
result[0] = 3
result[1] = 3
result[2] = 2
result[3] = 2
result[4] = 3
\`\`\``,
  starterCode: `__co__ void parallel_modulo() {
  global int data[5];
  global int result[5];
  int divisor = 7;

  parallel {i} by [1] {
    data[0] = 10; data[1] = 17; data[2] = 23; data[3] = 30; data[4] = 45;
  }

  // TODO: result[i] = data[i] % divisor in parallel {i} by [5]

  parallel {i} by [5] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 3", description: "10 % 7 = 3" },
    { expectedOutput: "result[2] = 2", description: "23 % 7 = 2" },
    { expectedOutput: "result[4] = 3", description: "45 % 7 = 3" },
    {
      expectedOutput: "result[0] = 3\nresult[1] = 3\nresult[2] = 2\nresult[3] = 2\nresult[4] = 3",
      description: "All modulo results correct",
    },
  ],
  hint: "parallel {i} by [5] { result[i] = data[i] % divisor; } — one thread per element.",
};
