import type { Challenge } from "./index";

export const challenge249: Challenge = {
  id: "c249",
  title: "Array Increment",
  difficulty: "easy",
  description: `Increment each element by **1** using \`parallel\`.

Given data = [10, 20, 30, 40, 50], the result is **[11, 21, 31, 41, 51]**.

Expected output:
\`\`\`
data[0] = 11
data[1] = 21
data[2] = 31
data[3] = 41
data[4] = 51
\`\`\`

Use \`parallel {i} by [5] { data[i] = data[i] + 1; }\` — one thread per element.`,
  starterCode: `__co__ void array_increment() {
  global int data[5];

  parallel {i} by [5] {
    data[i] = (i + 1) * 10;
  }

  // TODO: increment each element by 1 in parallel
  // parallel {i} by [5] { data[i] = data[i] + 1; }

  parallel {i} by [5] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 11", description: "First element incremented to 11" },
    { expectedOutput: "data[2] = 31", description: "Third element incremented to 31" },
    { expectedOutput: "data[4] = 51", description: "Last element incremented to 51" },
    {
      expectedOutput: "data[0] = 11\ndata[1] = 21\ndata[2] = 31\ndata[3] = 41\ndata[4] = 51",
      description: "All five elements incremented by 1",
    },
  ],
  hint: "Launch parallel {i} by [5] and assign data[i] = data[i] + 1. Each thread updates its own index independently.",
};
