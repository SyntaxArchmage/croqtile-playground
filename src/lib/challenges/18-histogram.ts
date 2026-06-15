import type { Challenge } from "./index";

export const challenge18: Challenge = {
  id: "c18",
  title: "Histogram Count",
  difficulty: "hard",
  description: `Given an array of 12 integers representing categories (0-3), count how many values fall into each category.

Input: [0, 1, 2, 3, 1, 2, 0, 3, 2, 1, 0, 2]

Expected output:
\`\`\`
bin[0] = 3
bin[1] = 3
bin[2] = 4
bin[3] = 2
\`\`\`

Hint: You cannot safely use parallel writes to accumulate counts — use a sequential \`foreach\` loop for the counting step.`,
  starterCode: `__co__ void histogram() {
  global int data[12];
  global int bins[4];

  // Initialize data = [0, 1, 2, 3, 1, 2, 0, 3, 2, 1, 0, 2]
  parallel {i} by [1] {
    data[0] = 0; data[1] = 1; data[2] = 2; data[3] = 3;
    data[4] = 1; data[5] = 2; data[6] = 0; data[7] = 3;
    data[8] = 2; data[9] = 1; data[10] = 0; data[11] = 2;
  }

  // Initialize bins to 0
  parallel {i} by [4] {
    bins[i] = 0;
  }

  // TODO: Count occurrences of each category

  // Print results
  parallel {i} by [4] {
    println("bin[", i, "] =", bins[i]);
  }
}
`,
  tests: [
    {
      expectedOutput: "bin[0] = 3\nbin[1] = 3\nbin[2] = 4\nbin[3] = 2",
      description: "Should count category occurrences correctly",
    },
  ],
  hint: "Use foreach to iterate over data sequentially. For each element, increment bins[data[i]]. Sequential access avoids race conditions.",
};
