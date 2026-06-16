import type { Challenge } from "./index";

export const challenge67: Challenge = {
  id: "c67",
  title: "Parallel Decrement",
  difficulty: "easy",
  description: `Decrement each element by **1** using \`parallel\`.

Given data = [10, 20, 30, 40, 50, 60, 70, 80], the result is **[9, 19, 29, 39, 49, 59, 69, 79]**.

Expected output:
\`\`\`
data[0] = 9
data[1] = 19
data[2] = 29
data[3] = 39
data[4] = 49
data[5] = 59
data[6] = 69
data[7] = 79
\`\`\`

Use \`parallel {i} by [8] { data[i] = data[i] - 1; }\` — one thread per element.`,
  starterCode: `__co__ void parallel_decrement() {
  global int data[8];

  parallel {i} by [8] {
    data[i] = (i + 1) * 10;
  }

  // TODO: decrement each element by 1 in parallel
  // parallel {i} by [8] { data[i] = data[i] - 1; }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 9", description: "First element decremented to 9" },
    { expectedOutput: "data[4] = 49", description: "Middle element decremented to 49" },
    { expectedOutput: "data[7] = 79", description: "Last element decremented to 79" },
    {
      expectedOutput: "data[0] = 9\ndata[1] = 19\ndata[2] = 29\ndata[3] = 39\ndata[4] = 49\ndata[5] = 59\ndata[6] = 69\ndata[7] = 79",
      description: "All eight elements decremented by 1",
    },
  ],
  hint: "Launch parallel {i} by [8] and assign data[i] = data[i] - 1. Each thread updates its own index independently.",
};
