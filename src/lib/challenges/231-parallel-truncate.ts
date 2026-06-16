import type { Challenge } from "./index";

export const challenge231: Challenge = {
  id: "c231",
  title: "Parallel Truncate",
  difficulty: "easy",
  description: `Truncate each floating-point element to its **integer part** using \`parallel\`.

Given data = [3.7, -2.3, 5.0, 0.9, -1.1]:

| data[i] | truncate |
|---------|----------|
| 3.7     | 3        |
| -2.3    | -2       |
| 5.0     | 5        |
| 0.9     | 0        |
| -1.1    | -1       |

Expected output:
\`\`\`
trunc[0] = 3
trunc[1] = -2
trunc[2] = 5
trunc[3] = 0
trunc[4] = -1
\`\`\`

Cast each element to \`int\` to drop the fractional part.`,
  starterCode: `__co__ void parallel_truncate() {
  global float data[5];
  global int trunc[5];

  parallel {i} by [1] {
    data[0] = 3.7f; data[1] = -2.3f; data[2] = 5.0f;
    data[3] = 0.9f; data[4] = -1.1f;
  }

  // TODO: parallel {i} by [5] { trunc[i] = (int)data[i]; }

  parallel {i} by [5] {
    println("trunc[", i, "] =", trunc[i]);
  }
}
`,
  tests: [
    { expectedOutput: "trunc[0] = 3", description: "truncate(3.7) = 3" },
    { expectedOutput: "trunc[1] = -2", description: "truncate(-2.3) = -2" },
    { expectedOutput: "trunc[2] = 5", description: "truncate(5.0) = 5" },
    {
      expectedOutput: "trunc[0] = 3\ntrunc[1] = -2\ntrunc[2] = 5\ntrunc[3] = 0\ntrunc[4] = -1",
      description: "All truncated values correct",
    },
  ],
  hint: "Each thread: trunc[i] = (int)data[i]. Casting float to int drops the fractional part.",
};
