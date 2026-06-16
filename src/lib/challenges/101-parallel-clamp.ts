import type { Challenge } from "./index";

export const challenge101: Challenge = {
  id: "c101",
  title: "Parallel Clamp",
  difficulty: "easy",
  description: `Clamp each element of an array to the range **[0, 100]** using \`parallel\` and \`if/else\`.

Given data = [-10, 50, 120, 0, 100, 75, 25, 150]:
- Values below 0 become 0
- Values above 100 become 100
- Values in range stay unchanged

Expected output:
\`\`\`
result[0] = 0
result[1] = 50
result[2] = 100
result[3] = 0
result[4] = 100
result[5] = 75
result[6] = 25
result[7] = 100
\`\`\``,
  starterCode: `__co__ void parallel_clamp() {
  global int data[8];
  global int result[8];
  int lo = 0;
  int hi = 100;

  parallel {i} by [1] {
    data[0] = -10; data[1] = 50; data[2] = 120; data[3] = 0;
    data[4] = 100; data[5] = 75; data[6] = 25; data[7] = 150;
  }

  // TODO: clamp each element in parallel with if/else

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 0", description: "-10 clamped up to min (0)" },
    { expectedOutput: "result[1] = 50", description: "50 is within range" },
    { expectedOutput: "result[2] = 100", description: "120 clamped down to max (100)" },
    { expectedOutput: "result[7] = 100", description: "150 clamped down to max (100)" },
    {
      expectedOutput: "result[0] = 0\nresult[1] = 50\nresult[2] = 100\nresult[3] = 0\nresult[4] = 100\nresult[5] = 75\nresult[6] = 25\nresult[7] = 100",
      description: "All values clamped correctly",
    },
  ],
  hint: "Use if/else inside parallel {i} by [8]: if data[i] < lo, result[i] = lo; else if data[i] > hi, result[i] = hi; else result[i] = data[i].",
};
