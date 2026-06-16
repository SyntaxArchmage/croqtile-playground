import type { Challenge } from "./index";

export const challenge171: Challenge = {
  id: "c171",
  title: "Parallel Normalize",
  difficulty: "hard",
  description: `Normalize an array so the elements **sum to 1** using a sequential sum pass and a parallel divide pass.

Given \`data = [2, 4, 6, 8]\`, the sum is 20. Each element becomes \`data[i] / sum\`:

| i | data[i] | norm[i] |
|---|---------|---------|
| 0 | 2       | 0.1     |
| 1 | 4       | 0.2     |
| 2 | 6       | 0.3     |
| 3 | 8       | 0.4     |

Expected output:
\`\`\`
norm[0] = 0.1
norm[1] = 0.2
norm[2] = 0.3
norm[3] = 0.4
\`\`\`

**Steps:** \`foreach\` to compute total, then \`parallel {i} by [4]\` to divide.`,
  starterCode: `__co__ void parallel_normalize() {
  global float data[4];
  global float norm[4];
  float total = 0.0f;

  parallel {i} by [4] {
    data[i] = (float)((i + 1) * 2);
  }

  // TODO: foreach i in [0:4] { total = total + data[i]; }

  // TODO: parallel {i} by [4] { norm[i] = data[i] / total; }

  parallel {i} by [4] {
    println("norm[", i, "] =", norm[i]);
  }
}
`,
  tests: [
    { expectedOutput: "norm[0] = 0.1", description: "norm[0] = 2/20 = 0.1" },
    { expectedOutput: "norm[2] = 0.3", description: "norm[2] = 6/20 = 0.3" },
    { expectedOutput: "norm[3] = 0.4", description: "norm[3] = 8/20 = 0.4" },
    {
      expectedOutput: "norm[0] = 0.1\nnorm[1] = 0.2\nnorm[2] = 0.3\nnorm[3] = 0.4",
      description: "All normalized values sum to 1",
    },
  ],
  hint: "First foreach: total += data[i]. Then parallel {i} by [4]: norm[i] = data[i] / total.",
};
