import type { Challenge } from "./index";

export const challenge35: Challenge = {
  id: "c35",
  title: "Count Evens",
  difficulty: "easy",
  description: `Count how many even numbers appear in an array.

Given data = [1, 2, 3, 4, 5, 6, 7, 8], four elements are even (2, 4, 6, 8).

Expected output:
\`\`\`
count = 4
\`\`\`

Use a \`foreach\` loop with a counter — increment when \`data[i] % 2 == 0\`.`,
  starterCode: `__co__ void count_evens() {
  global int data[8];

  // Initialize: [1, 2, 3, 4, 5, 6, 7, 8]
  parallel {i} by [8] {
    data[i] = i + 1;
  }

  // TODO: count evens with foreach
  // int count = 0;
  // foreach i in [0:8] { if (data[i] % 2 == 0) count = count + 1; }

  // println("count =", count);
}
`,
  tests: [
    {
      expectedOutput: "count = 4",
      description: "Should count four even values in [1..8]",
    },
  ],
  hint: "Start count at 0, then foreach over all indices and add 1 whenever data[i] is divisible by 2.",
};
