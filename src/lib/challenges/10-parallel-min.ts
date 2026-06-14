import type { Challenge } from "./index";

export const challenge10: Challenge = {
  id: "c10",
  title: "Find Minimum",
  difficulty: "easy",
  description: `Find the minimum value in a 6-element array.

Initialize data = [7, 2, 9, 1, 5, 3]

Expected output:
\`\`\`
min = 1
\`\`\`

Use a foreach loop to scan the array and track the minimum.`,
  starterCode: `__co__ void find_min() {
  global float data[6];

  // Initialize: data = [7, 2, 9, 1, 5, 3]
  // (Can't use parallel for specific values, set each manually)

  // Find the minimum value

  // Print: println("min =", min_val);
}
`,
  tests: [
    {
      expectedOutput: "min = 1",
      description: "Should find minimum value = 1",
    },
  ],
  hint: "Set data values individually, then: float min_val = data[0]; foreach i in [1:6] { if (data[i] < min_val) min_val = data[i]; }",
};
