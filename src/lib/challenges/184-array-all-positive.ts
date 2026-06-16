import type { Challenge } from "./index";

export const challenge184: Challenge = {
  id: "c184",
  title: "Array All Positive",
  difficulty: "easy",
  description: `Check whether **every element** in an array is strictly positive.

Given data = [3, 5, 2, 8, 4, 6] — all values are greater than zero.

Expected output:
\`\`\`
all_positive = true
\`\`\`

Use a \`foreach\` loop with a flag variable — start with \`all_positive = true\` and set it to \`false\` when you find an element less than or equal to zero.`,
  starterCode: `__co__ void array_all_positive() {
  global int data[6];

  parallel {i} by [1] {
    data[0] = 3; data[1] = 5; data[2] = 2;
    data[3] = 8; data[4] = 4; data[5] = 6;
  }

  // TODO: scan with foreach and a flag variable
  // bool all_positive = true;
  // foreach i in [0:6] { if (data[i] <= 0) all_positive = false; }

  // println("all_positive =", all_positive);
}
`,
  tests: [
    {
      expectedOutput: "all_positive = true",
      description: "All elements are positive — report all_positive = true",
    },
  ],
  hint: "Initialize all_positive to true, then foreach over all indices — set the flag to false whenever data[i] <= 0.",
};
