import type { Challenge } from "./index";

export const challenge19: Challenge = {
  id: "c19",
  title: "Swap Adjacent Pairs",
  difficulty: "easy",
  description: `Swap adjacent pairs of elements in an array of 8 values.

Given: [1, 2, 3, 4, 5, 6, 7, 8]
After swapping pairs: [2, 1, 4, 3, 6, 5, 8, 7]

Expected output:
\`\`\`
data[0] = 2
data[1] = 1
data[2] = 4
data[3] = 3
data[4] = 6
data[5] = 5
data[6] = 8
data[7] = 7
\`\`\``,
  starterCode: `__co__ void swap_pairs() {
  global float data[8];

  // Initialize data = [1, 2, 3, 4, 5, 6, 7, 8]
  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  // TODO: swap adjacent pairs
  // Hint: process pairs (0,1), (2,3), (4,5), (6,7)

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 2", description: "First pair swapped: data[0] = 2" },
    { expectedOutput: "data[1] = 1", description: "First pair swapped: data[1] = 1" },
    { expectedOutput: "data[0] = 2\ndata[1] = 1\ndata[2] = 4\ndata[3] = 3\ndata[4] = 6\ndata[5] = 5\ndata[6] = 8\ndata[7] = 7", description: "All pairs swapped correctly" },
  ],
  hint: "Use parallel {i} by [4] to process 4 pairs. Each thread i swaps data[i*2] and data[i*2+1] using a temp variable.",
};
