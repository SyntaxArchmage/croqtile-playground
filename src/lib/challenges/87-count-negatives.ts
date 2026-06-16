import type { Challenge } from "./index";

export const challenge87: Challenge = {
  id: "c87",
  title: "Count Negatives",
  difficulty: "easy",
  description: `Count how many elements are negative using \`foreach\`.

Given data = [3, -1, 0, -5, 2, -2, 4], three elements are negative (-1, -5, -2).

Expected output:
\`\`\`
count = 3
\`\`\`

Use a \`foreach\` loop with a counter — increment when \`data[i] < 0\`.`,
  starterCode: `__co__ void count_negatives() {
  global int data[7];

  parallel {i} by [1] {
    data[0] = 3;  data[1] = -1; data[2] = 0;
    data[3] = -5; data[4] = 2;  data[5] = -2; data[6] = 4;
  }

  // TODO: count negatives with foreach
  // int count = 0;
  // foreach i in [0:7] { if (data[i] < 0) count = count + 1; }

  // println("count =", count);
}
`,
  tests: [
    {
      expectedOutput: "count = 3",
      description: "Should count three negative values",
    },
  ],
  hint: "Start count at 0, then foreach over all indices and add 1 whenever data[i] is less than 0.",
};
