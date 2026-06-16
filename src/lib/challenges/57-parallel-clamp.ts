import type { Challenge } from "./index";

export const challenge57: Challenge = {
  id: "c57",
  title: "Parallel Clamp",
  difficulty: "easy",
  description: `Clamp array values to the range \`[10, 90]\` using \`parallel\`.

Given data = [5, 50, 95, 10, 90, 100, 45, 8], clamp each element:
- Values below 10 become 10
- Values above 90 become 90
- Values in range stay unchanged

Expected output:
\`\`\`
result[0] = 10
result[1] = 50
result[2] = 90
result[3] = 10
result[4] = 90
result[5] = 90
result[6] = 45
result[7] = 10
\`\`\``,
  starterCode: `__co__ void parallel_clamp() {
  global int data[8];
  global int result[8];
  int lo = 10;
  int hi = 90;

  parallel {i} by [1] {
    data[0] = 5; data[1] = 50; data[2] = 95; data[3] = 10;
    data[4] = 90; data[5] = 100; data[6] = 45; data[7] = 8;
  }

  // TODO: clamp each element in parallel

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 10", description: "5 clamped up to min (10)" },
    { expectedOutput: "result[1] = 50", description: "50 is within range" },
    { expectedOutput: "result[2] = 90", description: "95 clamped down to max (90)" },
    { expectedOutput: "result[7] = 10", description: "8 clamped up to min (10)" },
    {
      expectedOutput: "result[0] = 10\nresult[1] = 50\nresult[2] = 90\nresult[3] = 10\nresult[4] = 90\nresult[5] = 90\nresult[6] = 45\nresult[7] = 10",
      description: "All values clamped correctly",
    },
  ],
  hint: "Use if/else inside parallel {i} by [8]: if data[i] < lo, result[i] = lo; else if data[i] > hi, result[i] = hi; else result[i] = data[i].",
};
