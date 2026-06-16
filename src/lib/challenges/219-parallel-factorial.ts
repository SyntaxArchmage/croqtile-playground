import type { Challenge } from "./index";

export const challenge219: Challenge = {
  id: "c219",
  title: "Parallel Factorial",
  difficulty: "hard",
  description: `Compute **N!** for each array element. Each factorial is computed **sequentially** inside a \`parallel\` thread.

Given data = [0, 1, 2, 3, 4, 5]:

| i | data[i] | fact[i] |
|---|---------|---------|
| 0 | 0       | 1       |
| 1 | 1       | 1       |
| 2 | 2       | 2       |
| 3 | 3       | 6       |
| 4 | 4       | 24      |
| 5 | 5       | 120     |

Expected output:
\`\`\`
fact[0] = 1
fact[1] = 1
fact[2] = 2
fact[3] = 6
fact[4] = 24
fact[5] = 120
\`\`\`

Each thread runs a \`foreach\` loop multiplying from 1 up to \`data[i]\`. Treat \`0! = 1\`.`,
  starterCode: `__co__ void parallel_factorial() {
  global int data[6];
  global int fact[6];

  parallel {i} by [6] {
    data[i] = i;
  }

  // TODO: compute factorial per element in parallel {i} by [6]
  // int n = data[i];
  // int result = 1;
  // foreach k in [1:n + 1] {
  //   result = result * k;
  // }
  // fact[i] = result;

  parallel {i} by [6] {
    println("fact[", i, "] =", fact[i]);
  }
}
`,
  tests: [
    { expectedOutput: "fact[0] = 1", description: "0! = 1" },
    { expectedOutput: "fact[3] = 6", description: "3! = 6" },
    { expectedOutput: "fact[5] = 120", description: "5! = 120" },
    {
      expectedOutput: "fact[0] = 1\nfact[1] = 1\nfact[2] = 2\nfact[3] = 6\nfact[4] = 24\nfact[5] = 120",
      description: "Full factorial output",
    },
  ],
  hint: "Each thread: result=1, foreach k in [1:n+1] multiply result by k. When n=0 the loop is empty and result stays 1.",
};
