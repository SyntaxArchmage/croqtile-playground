import type { Challenge } from "./index";

export const challenge59: Challenge = {
  id: "c59",
  title: "Array Fill",
  difficulty: "easy",
  description: `Fill an array of 8 elements with the constant value **42** using \`parallel\`.

Expected output:
\`\`\`
data[0] = 42
data[1] = 42
data[2] = 42
data[3] = 42
data[4] = 42
data[5] = 42
data[6] = 42
data[7] = 42
\`\`\`

Use \`parallel {i} by [8] { data[i] = 42; }\` — one thread per element, all writing the same constant.`,
  starterCode: `__co__ void array_fill() {
  global int data[8];

  // TODO: fill every element with 42 in parallel
  // parallel {i} by [8] { data[i] = 42; }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 42", description: "First element filled with 42" },
    { expectedOutput: "data[4] = 42", description: "Middle element filled with 42" },
    { expectedOutput: "data[7] = 42", description: "Last element filled with 42" },
    {
      expectedOutput: "data[0] = 42\ndata[1] = 42\ndata[2] = 42\ndata[3] = 42\ndata[4] = 42\ndata[5] = 42\ndata[6] = 42\ndata[7] = 42",
      description: "All eight elements filled with 42",
    },
  ],
  hint: "Launch parallel {i} by [8] and assign data[i] = 42 inside the block. Every thread writes the same constant to its own index.",
};
