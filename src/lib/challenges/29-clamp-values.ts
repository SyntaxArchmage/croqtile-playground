import type { Challenge } from "./index";

export const challenge29: Challenge = {
  id: "c29",
  title: "Clamp Values",
  difficulty: "easy",
  description: `Clamp all values in \`[5, 12, 3, 18, 7, 1, 15, 9]\` to the range \`[4, 10]\`.

For each element: if value < 4, set to 4; if value > 10, set to 10; otherwise keep the value.

Expected output:
\`\`\`
result[0] = 5
result[1] = 10
result[2] = 4
result[3] = 10
result[4] = 7
result[5] = 4
result[6] = 10
result[7] = 9
\`\`\``,
  starterCode: `__co__ void clamp_values() {
  global int data[8];
  global int result[8];
  int lo = 4;
  int hi = 10;

  parallel {i} by [1] {
    data[0] = 5; data[1] = 12; data[2] = 3; data[3] = 18;
    data[4] = 7; data[5] = 1; data[6] = 15; data[7] = 9;
  }

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 5", description: "5 is within range, kept as-is" },
    { expectedOutput: "result[1] = 10", description: "12 clamped down to max (10)" },
    { expectedOutput: "result[2] = 4", description: "3 clamped up to min (4)" },
    {
      expectedOutput: "result[0] = 5\nresult[1] = 10\nresult[2] = 4\nresult[3] = 10\nresult[4] = 7\nresult[5] = 4\nresult[6] = 10\nresult[7] = 9",
      description: "All values clamped correctly",
    },
  ],
  hint: "Use if/else inside the parallel block: if data[i] < lo, result[i] = lo; else if data[i] > hi, result[i] = hi; else result[i] = data[i].",
};
