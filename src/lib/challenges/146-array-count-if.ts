import type { Challenge } from "./index";

export const challenge146: Challenge = {
  id: "c146",
  title: "Array Count If",
  difficulty: "easy",
  description: `Count how many elements are **greater than a threshold** using \`foreach\`.

Given data = [3, 7, 2, 9, 1, 8, 4] and threshold = 5, three elements exceed 5 (7, 9, 8).

Expected output:
\`\`\`
count = 3
\`\`\`

Use a \`foreach\` loop with a counter — increment when \`data[i] > threshold\`.`,
  starterCode: `__co__ void array_count_if() {
  global int data[7];
  int threshold = 5;

  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = 2; data[3] = 9;
    data[4] = 1; data[5] = 8; data[6] = 4;
  }

  // TODO: count elements greater than threshold

  // println("count =", count);
}
`,
  tests: [
    {
      expectedOutput: "count = 3",
      description: "Should count three values greater than 5",
    },
  ],
  hint: "Start count at 0. foreach over all indices and add 1 whenever data[i] is greater than threshold.",
};
