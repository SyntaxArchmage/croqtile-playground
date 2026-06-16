import type { Challenge } from "./index";

export const challenge71: Challenge = {
  id: "c71",
  title: "Sum of Squares",
  difficulty: "easy",
  description: `Compute the sum of squares for an array using \`foreach\`.

Given data = [1, 2, 3, 4], compute 1² + 2² + 3² + 4² = 30.

Expected output:
\`\`\`
sum = 30
\`\`\`

Use a sequential \`foreach\` loop to accumulate \`data[i] * data[i]\` into a running total.`,
  starterCode: `__co__ void sum_of_squares() {
  global int data[4];

  parallel {i} by [4] {
    data[i] = i + 1;
  }

  // TODO: foreach loop — sum += data[i] * data[i]

  // println("sum =", sum);
}
`,
  tests: [
    {
      expectedOutput: "sum = 30",
      description: "Should sum squares of [1, 2, 3, 4]",
    },
  ],
  hint: "Start sum at 0, then foreach i in [0:4] add data[i] * data[i]. Print the final sum.",
};
