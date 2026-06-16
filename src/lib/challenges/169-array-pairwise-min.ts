import type { Challenge } from "./index";

export const challenge169: Challenge = {
  id: "c169",
  title: "Array Pairwise Min",
  difficulty: "medium",
  description: `Compute the **minimum of each adjacent pair** in an array using \`parallel\`.

Given data = [7, 2, 9, 1, 5, 3] (6 elements → 3 pairs):

| pair | min |
|------|-----|
| (7, 2)  | 2 |
| (9, 1)  | 1 |
| (5, 3)  | 3 |

Expected output:
\`\`\`
min[0] = 2
min[1] = 1
min[2] = 3
\`\`\`

Use \`parallel {p} by [3]\` with \`min[p] = min(data[2*p], data[2*p + 1])\`.`,
  starterCode: `__co__ void array_pairwise_min() {
  global int data[6];
  global int min[3];

  parallel {i} by [1] {
    data[0] = 7; data[1] = 2; data[2] = 9;
    data[3] = 1; data[4] = 5; data[5] = 3;
  }

  // TODO: parallel {p} by [3] {
  //   int a = data[2 * p];
  //   int b = data[2 * p + 1];
  //   if (a < b) { min[p] = a; } else { min[p] = b; }
  // }

  parallel {p} by [3] {
    println("min[", p, "] =", min[p]);
  }
}
`,
  tests: [
    { expectedOutput: "min[0] = 2", description: "min(7, 2) = 2" },
    { expectedOutput: "min[1] = 1", description: "min(9, 1) = 1" },
    { expectedOutput: "min[2] = 3", description: "min(5, 3) = 3" },
    {
      expectedOutput: "min[0] = 2\nmin[1] = 1\nmin[2] = 3",
      description: "All pairwise minima correct",
    },
  ],
  hint: "Each thread p reads data[2*p] and data[2*p+1], then stores the smaller value in min[p].",
};
