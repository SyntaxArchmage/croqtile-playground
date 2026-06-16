import type { Challenge } from "./index";

export const challenge83: Challenge = {
  id: "c83",
  title: "Batch Max",
  difficulty: "medium",
  description: `Find the maximum value in each batch of 4 elements from a 12-element array.

Given data = [3, 7, 1, 9, 2, 5, 8, 4, 6, 1, 3, 10], there are 3 batches:

| batch | elements      | max |
|-------|---------------|-----|
| 0     | 3, 7, 1, 9    | 9   |
| 1     | 2, 5, 8, 4    | 8   |
| 2     | 6, 1, 3, 10   | 10  |

Expected output:
\`\`\`
max[0] = 9
max[1] = 8
max[2] = 10
\`\`\`

Use \`foreach batch in [0:3]\` and scan the four elements starting at \`batch * 4\`.`,
  starterCode: `__co__ void batch_max() {
  global int data[12];
  global int max_out[3];
  int batch_size = 4;
  int num_batches = 3;

  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = 1; data[3] = 9;
    data[4] = 2; data[5] = 5; data[6] = 8; data[7] = 4;
    data[8] = 6; data[9] = 1; data[10] = 3; data[11] = 10;
  }

  // TODO: foreach batch in [0:3]
  //   int local_max = data[batch * batch_size];
  //   foreach offset in [1:4] { compare data[batch * batch_size + offset] }
  //   max_out[batch] = local_max;

  parallel {i} by [3] {
    println("max[", i, "] =", max_out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "max[0] = 9", description: "Batch 0 max is 9" },
    { expectedOutput: "max[1] = 8", description: "Batch 1 max is 8" },
    { expectedOutput: "max[2] = 10", description: "Batch 2 max is 10" },
    {
      expectedOutput: "max[0] = 9\nmax[1] = 8\nmax[2] = 10",
      description: "All batch maxima correct",
    },
  ],
  hint: "Outer foreach over batch in [0:3]. Inner foreach over offset in [0:4] compares data[batch * 4 + offset] against a running local_max.",
};
