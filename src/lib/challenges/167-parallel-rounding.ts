import type { Challenge } from "./index";

export const challenge167: Challenge = {
  id: "c167",
  title: "Parallel Rounding",
  difficulty: "easy",
  description: `Round each floating-point element to the **nearest integer** using \`parallel\`.

Given data = [1.2, 1.5, 2.7, 3.1, 4.0]:

| data[i] | round |
|---------|-------|
| 1.2     | 1     |
| 1.5     | 2     |
| 2.7     | 3     |
| 3.1     | 3     |
| 4.0     | 4     |

Add **0.5** before truncating: \`round[i] = (int)(data[i] + 0.5f)\`.

Expected output:
\`\`\`
round[0] = 1
round[1] = 2
round[2] = 3
round[3] = 3
round[4] = 4
\`\`\``,
  starterCode: `__co__ void parallel_rounding() {
  global float data[5];
  global int round[5];

  parallel {i} by [1] {
    data[0] = 1.2f; data[1] = 1.5f; data[2] = 2.7f;
    data[3] = 3.1f; data[4] = 4.0f;
  }

  // TODO: parallel {i} by [5] { round[i] = (int)(data[i] + 0.5f); }

  parallel {i} by [5] {
    println("round[", i, "] =", round[i]);
  }
}
`,
  tests: [
    { expectedOutput: "round[0] = 1", description: "round(1.2) = 1" },
    { expectedOutput: "round[1] = 2", description: "round(1.5) = 2" },
    { expectedOutput: "round[2] = 3", description: "round(2.7) = 3" },
    { expectedOutput: "round[3] = 3", description: "round(3.1) = 3" },
    {
      expectedOutput: "round[0] = 1\nround[1] = 2\nround[2] = 3\nround[3] = 3\nround[4] = 4",
      description: "All rounded values correct",
    },
  ],
  hint: "Each thread: round[i] = (int)(data[i] + 0.5f). Adding 0.5 before truncation rounds to nearest integer.",
};
