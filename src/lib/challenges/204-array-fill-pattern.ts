import type { Challenge } from "./index";

export const challenge204: Challenge = {
  id: "c204",
  title: "Array Fill Pattern",
  difficulty: "easy",
  description: `Fill an array of 9 elements with the repeating pattern **[1, 2, 3, 1, 2, 3, ...]** using \`parallel\`.

Expected output:
\`\`\`
data[0] = 1
data[1] = 2
data[2] = 3
data[3] = 1
data[4] = 2
data[5] = 3
data[6] = 1
data[7] = 2
data[8] = 3
\`\`\`

Use \`parallel {i} by [9]\` with \`data[i] = (i % 3) + 1\`.`,
  starterCode: `__co__ void array_fill_pattern() {
  global int data[9];

  // TODO: fill with repeating pattern [1, 2, 3, ...]
  // parallel {i} by [9] { data[i] = (i % 3) + 1; }

  parallel {i} by [9] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 1", description: "Pattern starts with 1" },
    { expectedOutput: "data[2] = 3", description: "First cycle ends with 3" },
    { expectedOutput: "data[3] = 1", description: "Pattern repeats at index 3" },
    { expectedOutput: "data[8] = 3", description: "Last element completes third cycle" },
    {
      expectedOutput: "data[0] = 1\ndata[1] = 2\ndata[2] = 3\ndata[3] = 1\ndata[4] = 2\ndata[5] = 3\ndata[6] = 1\ndata[7] = 2\ndata[8] = 3",
      description: "Full repeating 1-2-3 pattern output",
    },
  ],
  hint: "parallel {i} by [9] { data[i] = (i % 3) + 1; } — index modulo 3 cycles through 0, 1, 2, then add 1.",
};
