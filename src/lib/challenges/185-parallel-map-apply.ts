import type { Challenge } from "./index";

export const challenge185: Challenge = {
  id: "c185",
  title: "Parallel Map Apply",
  difficulty: "medium",
  description: `Apply the function **f(x) = 2x + 3** to each element using \`parallel\`.

Given data = [1, 4, 7, 10]:

| data[i] | 2×data[i] + 3 |
|---------|---------------|
| 1       | 5             |
| 4       | 11            |
| 7       | 17            |
| 10      | 23            |

Expected output:
\`\`\`
result[0] = 5
result[1] = 11
result[2] = 17
result[3] = 23
\`\`\`

Use \`parallel {i} by [4]\`: \`result[i] = 2 * data[i] + 3\`.`,
  starterCode: `__co__ void parallel_map_apply() {
  global int data[4];
  global int result[4];

  parallel {i} by [1] {
    data[0] = 1; data[1] = 4; data[2] = 7; data[3] = 10;
  }

  // TODO: parallel {i} by [4] { result[i] = 2 * data[i] + 3; }

  parallel {i} by [4] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 5", description: "f(1) = 2×1 + 3 = 5" },
    { expectedOutput: "result[1] = 11", description: "f(4) = 2×4 + 3 = 11" },
    { expectedOutput: "result[3] = 23", description: "f(10) = 2×10 + 3 = 23" },
    {
      expectedOutput: "result[0] = 5\nresult[1] = 11\nresult[2] = 17\nresult[3] = 23",
      description: "All mapped values correct",
    },
  ],
  hint: "Inside parallel {i} by [4]: result[i] = 2 * data[i] + 3 for each element.",
};
