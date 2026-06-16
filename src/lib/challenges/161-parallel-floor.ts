import type { Challenge } from "./index";

export const challenge161: Challenge = {
  id: "c161",
  title: "Parallel Floor",
  difficulty: "easy",
  description: `Compute the **floor** of each floating-point element using \`parallel\`.

Given data = [1.2, 2.0, 2.7, 3.1, 4.0]:

| data[i] | floor |
|---------|-------|
| 1.2     | 1     |
| 2.0     | 2     |
| 2.7     | 2     |
| 3.1     | 3     |
| 4.0     | 4     |

Expected output:
\`\`\`
floor[0] = 1
floor[1] = 2
floor[2] = 2
floor[3] = 3
floor[4] = 4
\`\`\`

Cast each element to \`int\` to truncate toward zero.`,
  starterCode: `__co__ void parallel_floor() {
  global float data[5];
  global int floor[5];

  parallel {i} by [1] {
    data[0] = 1.2f; data[1] = 2.0f; data[2] = 2.7f;
    data[3] = 3.1f; data[4] = 4.0f;
  }

  // TODO: parallel {i} by [5] { floor[i] = (int)data[i]; }

  parallel {i} by [5] {
    println("floor[", i, "] =", floor[i]);
  }
}
`,
  tests: [
    { expectedOutput: "floor[0] = 1", description: "floor(1.2) = 1" },
    { expectedOutput: "floor[1] = 2", description: "floor(2.0) = 2" },
    { expectedOutput: "floor[2] = 2", description: "floor(2.7) = 2" },
    { expectedOutput: "floor[3] = 3", description: "floor(3.1) = 3" },
    {
      expectedOutput: "floor[0] = 1\nfloor[1] = 2\nfloor[2] = 2\nfloor[3] = 3\nfloor[4] = 4",
      description: "All floor values correct",
    },
  ],
  hint: "Each thread: floor[i] = (int)data[i]. Casting float to int truncates the fractional part.",
};
