import type { Challenge } from "./index";

export const challenge77: Challenge = {
  id: "c77",
  title: "Parallel Double",
  difficulty: "easy",
  description: `Double each element in an array using \`parallel\`.

Given data = [5, 10, 15, 20, 25, 30, 35, 40], the result is **[10, 20, 30, 40, 50, 60, 70, 80]**.

Expected output:
\`\`\`
data[0] = 10
data[1] = 20
data[2] = 30
data[3] = 40
data[4] = 50
data[5] = 60
data[6] = 70
data[7] = 80
\`\`\`

Use \`parallel {i} by [8] { data[i] = data[i] * 2; }\` — one thread per element.`,
  starterCode: `__co__ void parallel_double() {
  global int data[8];

  parallel {i} by [8] {
    data[i] = (i + 1) * 5;
  }

  // TODO: double each element in parallel
  // parallel {i} by [8] { data[i] = data[i] * 2; }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 10", description: "First element doubled to 10" },
    { expectedOutput: "data[4] = 50", description: "Middle element doubled to 50" },
    { expectedOutput: "data[7] = 80", description: "Last element doubled to 80" },
    {
      expectedOutput: "data[0] = 10\ndata[1] = 20\ndata[2] = 30\ndata[3] = 40\ndata[4] = 50\ndata[5] = 60\ndata[6] = 70\ndata[7] = 80",
      description: "All eight elements doubled",
    },
  ],
  hint: "Launch parallel {i} by [8] and assign data[i] = data[i] * 2. Each thread updates its own index independently.",
};
