import type { Challenge } from "./index";

export const challenge31: Challenge = {
  id: "c31",
  title: "All Positive",
  difficulty: "easy",
  description: `Check whether every element in an array is positive.

Given data = [3, 7, -1, 5, 2, 8, 4, 6], determine if any element is negative.

Expected output:
\`\`\`
has_negative = true
\`\`\`

Use a \`foreach\` loop with a flag variable — start with \`has_negative = false\` and set it to \`true\` when you find an element less than zero.`,
  starterCode: `__co__ void all_positive() {
  global int data[8];

  // Initialize: [3, 7, -1, 5, 2, 8, 4, 6]
  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = -1; data[3] = 5;
    data[4] = 2; data[5] = 8; data[6] = 4; data[7] = 6;
  }

  // TODO: scan with foreach and a flag variable
  // bool has_negative = false;
  // foreach i in [0:8] { if (data[i] < 0) has_negative = true; }

  // println("has_negative =", has_negative);
}
`,
  tests: [
    {
      expectedOutput: "has_negative = true",
      description: "Should detect -1 and report has_negative = true",
    },
  ],
  hint: "Initialize has_negative to false, then foreach over all indices — set the flag to true whenever data[i] < 0.",
};
