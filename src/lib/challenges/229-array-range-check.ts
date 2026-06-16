import type { Challenge } from "./index";

export const challenge229: Challenge = {
  id: "c229",
  title: "Array Range Check",
  difficulty: "medium",
  description: `Check whether **every element** lies in the closed interval **[lo, hi]**.

Given data = [3, 5, 7, 4, 6], **lo = 2**, **hi = 8** — all values are within range.

Expected output:
\`\`\`
in_range = true
\`\`\`

Use a \`foreach\` loop with a flag: start with \`in_range = true\` and set it to \`false\` when any element falls outside [lo, hi].`,
  starterCode: `__co__ void array_range_check() {
  global int data[5];
  int lo = 2;
  int hi = 8;

  parallel {i} by [1] {
    data[0] = 3; data[1] = 5; data[2] = 7; data[3] = 4; data[4] = 6;
  }

  // TODO: scan with foreach and a flag variable
  // bool in_range = true;
  // foreach i in [0:5] {
  //   if (data[i] < lo || data[i] > hi) { in_range = false; }
  // }

  // println("in_range =", in_range);
}
`,
  tests: [
    {
      expectedOutput: "in_range = true",
      description: "All elements in [2, 8] — report in_range = true",
    },
  ],
  hint: "Initialize in_range to true, then foreach over all indices — set false whenever data[i] < lo or data[i] > hi.",
};
