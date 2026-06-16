import type { Challenge } from "./index";

export const challenge203: Challenge = {
  id: "c203",
  title: "Parallel Index Of",
  difficulty: "medium",
  description: `Find the **index of the first occurrence** of a target value in an array.

Given data = [5, 3, 7, 3, 9] and target = 3, the first match is at index **1**.

Expected output:
\`\`\`
index = 1
\`\`\`

Use a sequential \`foreach\` loop to scan indices left-to-right. Stop updating once found, or only update when the index is still -1.`,
  starterCode: `__co__ void parallel_index_of() {
  global int data[5];
  int target = 3;
  int index = -1;

  parallel {i} by [1] {
    data[0] = 5; data[1] = 3; data[2] = 7; data[3] = 3; data[4] = 9;
  }

  // TODO: foreach i in [0:5] {
  //   if (index == -1 && data[i] == target) { index = i; }
  // }

  println("index =", index);
}
`,
  tests: [
    {
      expectedOutput: "index = 1",
      description: "First occurrence of 3 is at index 1",
    },
  ],
  hint: "Initialize index to -1. foreach over [0:5]: if index is still -1 and data[i] equals target, set index = i.",
};
