import type { Challenge } from "./index";

export const challenge61: Challenge = {
  id: "c61",
  title: "Parallel Guard",
  difficulty: "easy",
  description: `Use \`if/else\` inside \`parallel\` to **only process even indices** — double them; leave odd indices unchanged.

Given data = [10, 20, 30, 40, 50, 60, 70, 80], produce:
\`\`\`
result[0] = 20
result[1] = 20
result[2] = 60
result[3] = 40
result[4] = 100
result[5] = 60
result[6] = 140
result[7] = 80
\`\`\`

Even indices (0, 2, 4, 6) are doubled; odd indices are copied as-is.`,
  starterCode: `__co__ void parallel_guard() {
  global int data[8];
  global int result[8];

  parallel {i} by [8] {
    data[i] = (i + 1) * 10;
  }

  // TODO: double even indices, copy odd indices unchanged
  // parallel {i} by [8] {
  //   if (i % 2 == 0) result[i] = data[i] * 2;
  //   else result[i] = data[i];
  // }

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 20", description: "Even index 0 doubled" },
    { expectedOutput: "result[1] = 20", description: "Odd index 1 unchanged" },
    { expectedOutput: "result[6] = 140", description: "Even index 6 doubled" },
    {
      expectedOutput: "result[0] = 20\nresult[1] = 20\nresult[2] = 60\nresult[3] = 40\nresult[4] = 100\nresult[5] = 60\nresult[6] = 140\nresult[7] = 80",
      description: "All guarded results correct",
    },
  ],
  hint: "Inside parallel {i} by [8], check i % 2 == 0. If true, result[i] = data[i] * 2; else result[i] = data[i].",
};
