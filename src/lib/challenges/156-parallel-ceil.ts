import type { Challenge } from "./index";

export const challenge156: Challenge = {
  id: "c156",
  title: "Parallel Ceil",
  difficulty: "easy",
  description: `Compute the **ceiling** of each floating-point element using \`parallel\`.

Given data = [1.2, 2.0, 2.7, 3.1, 4.0]:

| data[i] | ceil |
|---------|------|
| 1.2     | 2    |
| 2.0     | 2    |
| 2.7     | 3    |
| 3.1     | 4    |
| 4.0     | 4    |

Expected output:
\`\`\`
ceil[0] = 2
ceil[1] = 2
ceil[2] = 3
ceil[3] = 4
ceil[4] = 4
\`\`\`

Cast to \`int\`, then add 1 when the value has a fractional part (\`data[i] > (float)truncated\`).`,
  starterCode: `__co__ void parallel_ceil() {
  global float data[5];
  global int ceil[5];

  parallel {i} by [1] {
    data[0] = 1.2f; data[1] = 2.0f; data[2] = 2.7f;
    data[3] = 3.1f; data[4] = 4.0f;
  }

  // TODO: parallel {i} by [5] {
  //   int t = (int)data[i];
  //   if (data[i] > (float)t) { ceil[i] = t + 1; }
  //   else { ceil[i] = t; }
  // }

  parallel {i} by [5] {
    println("ceil[", i, "] =", ceil[i]);
  }
}
`,
  tests: [
    { expectedOutput: "ceil[0] = 2", description: "ceil(1.2) = 2" },
    { expectedOutput: "ceil[1] = 2", description: "ceil(2.0) = 2" },
    { expectedOutput: "ceil[2] = 3", description: "ceil(2.7) = 3" },
    { expectedOutput: "ceil[3] = 4", description: "ceil(3.1) = 4" },
    {
      expectedOutput: "ceil[0] = 2\nceil[1] = 2\nceil[2] = 3\nceil[3] = 4\nceil[4] = 4",
      description: "All ceiling values correct",
    },
  ],
  hint: "Each thread: t = (int)data[i]; if data[i] > (float)t then ceil[i] = t + 1 else ceil[i] = t.",
};
