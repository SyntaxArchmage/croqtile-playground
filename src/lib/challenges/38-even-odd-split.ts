import type { Challenge } from "./index";

export const challenge38: Challenge = {
  id: "c38",
  title: "Even-Odd Split",
  difficulty: "medium",
  description: `Rearrange an array so that even-indexed elements come first, followed by odd-indexed elements.

Given data = [10, 20, 30, 40, 50, 60], produce [10, 30, 50, 20, 40, 60].

Expected output:
\`\`\`
result[0] = 10
result[1] = 30
result[2] = 50
result[3] = 20
result[4] = 40
result[5] = 60
\`\`\`

Use \`parallel {i} by [6]\` — compute the source index based on whether \`i < N/2\`.`,
  starterCode: `__co__ void even_odd_split() {
  global int data[6];
  global int result[6];

  parallel {i} by [6] {
    data[i] = (i + 1) * 10;
  }

  // TODO: split even-indexed and odd-indexed elements
  // For i < 3: result[i] = data[i * 2]
  // For i >= 3: result[i] = data[(i - 3) * 2 + 1]

  parallel {i} by [6] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 10", description: "First even-index element" },
    { expectedOutput: "result[2] = 50", description: "Third even-index element" },
    { expectedOutput: "result[3] = 20", description: "First odd-index element" },
    {
      expectedOutput: "result[0] = 10\nresult[1] = 30\nresult[2] = 50\nresult[3] = 20\nresult[4] = 40\nresult[5] = 60",
      description: "Full split output",
    },
  ],
  hint: "If i < 3, source is data[i*2] (even indices 0,2,4). If i >= 3, source is data[(i-3)*2 + 1] (odd indices 1,3,5).",
};
