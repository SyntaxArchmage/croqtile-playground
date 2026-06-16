import type { Challenge } from "./index";

export const challenge144: Challenge = {
  id: "c144",
  title: "Parallel Swap Adjacent",
  difficulty: "easy",
  description: `Swap adjacent pairs in an array using \`parallel\`.

Given: [1, 2, 3, 4, 5, 6, 7, 8]

After swapping pairs (a[0]↔a[1], a[2]↔a[3], ...):
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
  starterCode: `__co__ void parallel_swap_adjacent() {
  global int data[8];

  parallel {i} by [8] {
    data[i] = i + 1;
  }

  // TODO: swap adjacent pairs in parallel
  // parallel {i} by [4] {
  //   int a = i * 2;
  //   int b = a + 1;
  //   int tmp = data[a];
  //   data[a] = data[b];
  //   data[b] = tmp;
  // }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 2", description: "First pair swapped: data[0] = 2" },
    { expectedOutput: "data[1] = 1", description: "First pair swapped: data[1] = 1" },
    {
      expectedOutput: "data[0] = 2\ndata[1] = 1\ndata[2] = 4\ndata[3] = 3\ndata[4] = 6\ndata[5] = 5\ndata[6] = 8\ndata[7] = 7",
      description: "All adjacent pairs swapped correctly",
    },
  ],
  hint: "Use parallel {i} by [4]. Each thread i swaps data[i*2] and data[i*2+1] using a temporary variable.",
};
