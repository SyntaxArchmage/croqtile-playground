import type { Challenge } from "./index";

export const challenge73: Challenge = {
  id: "c73",
  title: "Array Search",
  difficulty: "medium",
  description: `Perform a linear search for a target value and print its index.

Given data = [10, 20, 30, 40, 50] and target = 30, the value appears at index 2.

Expected output:
\`\`\`
index = 2
\`\`\`

Use a \`foreach\` loop to scan indices sequentially. When \`data[i] == target\`, record the index and stop (or finish the scan — only one match exists here).`,
  starterCode: `__co__ void array_search() {
  global int data[5];
  int target = 30;
  int N = 5;

  parallel {i} by [5] {
    data[i] = (i + 1) * 10;
  }

  // TODO: linear search with foreach
  // int index = -1;
  // foreach i in [0:5] { if (data[i] == target) index = i; }

  // println("index =", index);
}
`,
  tests: [
    {
      expectedOutput: "index = 2",
      description: "Should find 30 at index 2",
    },
  ],
  hint: "Initialize index to -1. foreach over [0:5] and update index when data[i] equals target. Print the found index.",
};
