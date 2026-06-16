import type { Challenge } from "./index";

export const challenge207: Challenge = {
  id: "c207",
  title: "Parallel Reciprocal",
  difficulty: "easy",
  description: `Compute **1/x** for each element in parallel. Print **0** when \`x == 0\`.

Given data = [2, 4, 0, 8]:

| data[i] | reciprocal |
|---------|------------|
| 2       | 0.5        |
| 4       | 0.25       |
| 0       | 0          |
| 8       | 0.125      |

Expected output:
\`\`\`
recip[0] = 0.5
recip[1] = 0.25
recip[2] = 0
recip[3] = 0.125
\`\`\`

Use \`parallel {i} by [4]\` with a conditional: if \`data[i] == 0\` then 0, else \`1.0f / data[i]\`.`,
  starterCode: `__co__ void parallel_reciprocal() {
  global float data[4];
  global float recip[4];

  parallel {i} by [1] {
    data[0] = 2.0f; data[1] = 4.0f; data[2] = 0.0f; data[3] = 8.0f;
  }

  // TODO: parallel {i} by [4] {
  //   if (data[i] == 0.0f) { recip[i] = 0.0f; }
  //   else { recip[i] = 1.0f / data[i]; }
  // }

  parallel {i} by [4] {
    println("recip[", i, "] =", recip[i]);
  }
}
`,
  tests: [
    { expectedOutput: "recip[0] = 0.5", description: "1/2 = 0.5" },
    { expectedOutput: "recip[1] = 0.25", description: "1/4 = 0.25" },
    { expectedOutput: "recip[2] = 0", description: "Zero input yields 0" },
    { expectedOutput: "recip[3] = 0.125", description: "1/8 = 0.125" },
    {
      expectedOutput: "recip[0] = 0.5\nrecip[1] = 0.25\nrecip[2] = 0\nrecip[3] = 0.125",
      description: "Full reciprocal output with zero guard",
    },
  ],
  hint: "parallel {i} by [4]: if data[i] is zero, recip[i]=0; otherwise recip[i] = 1.0f / data[i].",
};
