import type { Challenge } from "./index";

export const challenge224: Challenge = {
  id: "c224",
  title: "Array Mean",
  difficulty: "easy",
  description: `Compute the **arithmetic mean** of an array.

Given data = [2, 4, 6, 8, 10]:

\`\`\`
mean = (2 + 4 + 6 + 8 + 10) / 5 = 30 / 5 = 6
\`\`\`

Expected output:
\`\`\`
mean = 6
\`\`\`

Use a sequential \`foreach\` loop to accumulate the sum, then divide by the array length.`,
  starterCode: `__co__ void array_mean() {
  global int data[5];

  parallel {i} by [5] {
    data[i] = (i + 1) * 2;
  }

  // TODO: accumulate sum with foreach
  // int sum = 0;
  // foreach i in [0:5] { sum = sum + data[i]; }
  // int mean = sum / 5;

  // println("mean =", mean);
}
`,
  tests: [
    {
      expectedOutput: "mean = 6",
      description: "Arithmetic mean of [2,4,6,8,10] is 6",
    },
  ],
  hint: "foreach i in [0:5] accumulate sum += data[i]. Then mean = sum / 5.",
};
