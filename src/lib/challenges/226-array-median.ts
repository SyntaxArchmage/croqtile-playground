import type { Challenge } from "./index";

export const challenge226: Challenge = {
  id: "c226",
  title: "Array Median",
  difficulty: "hard",
  description: `Find the **median** of an **odd-length** array.

Given data = [9, 1, 5, 3, 7] (length 5), sort to [1, 3, 5, 7, 9]. The median is the middle element at index **2**:

\`\`\`
median = 5
\`\`\`

Expected output:
\`\`\`
median = 5
\`\`\`

**Pass 1:** copy \`data\` into \`sorted\`.
**Pass 2:** bubble-sort \`sorted\` with nested \`foreach\` loops.
**Pass 3:** read \`sorted[n / 2]\` as the median.`,
  starterCode: `__co__ void array_median() {
  global int data[5];
  global int sorted[5];
  int n = 5;

  parallel {i} by [1] {
    data[0] = 9; data[1] = 1; data[2] = 5; data[3] = 3; data[4] = 7;
  }

  // TODO: copy data into sorted
  // foreach i in [0:n] { sorted[i] = data[i]; }

  // TODO: bubble sort sorted with foreach i and foreach j loops

  int median = 0;
  // TODO: median = sorted[n / 2];

  println("median =", median);
}
`,
  tests: [
    { expectedOutput: "median = 5", description: "Median of [9,1,5,3,7] is 5" },
  ],
  hint: "Copy to sorted, bubble-sort with foreach i/j, then median = sorted[n / 2] for odd-length arrays.",
};
