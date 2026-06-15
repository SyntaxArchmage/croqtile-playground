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
  // Assign each element individually (values don't follow a simple index formula)
  data[0] = 7.0f;
  // data[1] = ...
  // ...

  // Track the minimum: start with data[0], then scan the rest with foreach

  // Print: println("min =", min_val);
}
`,
  tests: [
    {
      expectedOutput: "min = 1",
      description: "Should find minimum value = 1",
    },
  ],
  hint: "Initialize min_val from data[0], then loop over indices 1 through 5 and update min_val whenever you find a smaller element.",
};
