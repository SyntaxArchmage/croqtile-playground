import type { Challenge } from "./index";

export const challenge234: Challenge = {
  id: "c234",
  title: "Parallel Wrap",
  difficulty: "medium",
  description: `Wrap each value into the range **[0, N)** using modulo arithmetic in \`parallel\`.

Given data = [-1, 3, 7, 10] and **N = 5**:

| data[i] | wrap to [0, 5) |
|---------|----------------|
| -1      | 4              |
| 3       | 3              |
| 7       | 2              |
| 10      | 0              |

Use the formula \`((data[i] % N) + N) % N\` to handle negative values.

Expected output:
\`\`\`
out[0] = 4
out[1] = 3
out[2] = 2
out[3] = 0
\`\`\``,
  starterCode: `__co__ void parallel_wrap() {
  global int data[4];
  global int out[4];
  int N = 5;

  parallel {i} by [1] {
    data[0] = -1; data[1] = 3; data[2] = 7; data[3] = 10;
  }

  // TODO: parallel {i} by [4] {
  //   out[i] = ((data[i] % N) + N) % N;
  // }

  parallel {i} by [4] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 4", description: "-1 wraps to 4 mod 5" },
    { expectedOutput: "out[1] = 3", description: "3 wraps to 3 mod 5" },
    { expectedOutput: "out[2] = 2", description: "7 wraps to 2 mod 5" },
    { expectedOutput: "out[3] = 0", description: "10 wraps to 0 mod 5" },
    {
      expectedOutput: "out[0] = 4\nout[1] = 3\nout[2] = 2\nout[3] = 0",
      description: "Full parallel wrap output",
    },
  ],
  hint: "parallel {i} by [4] { out[i] = ((data[i] % N) + N) % N; } — the double-mod handles negatives.",
};
