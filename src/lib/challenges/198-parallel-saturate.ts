import type { Challenge } from "./index";

export const challenge198: Challenge = {
  id: "c198",
  title: "Parallel Saturate",
  difficulty: "easy",
  description: `Clamp each element to the range **[0, 255]** using \`parallel\` and \`if/else\` (saturation).

Given data = [-10, 100, 300, 50, 0, 255, 128, -5]:

| data[i] | saturated |
|---------|-----------|
| -10     | 0         |
| 100     | 100       |
| 300     | 255       |
| 50      | 50        |

Expected output:
\`\`\`
result[0] = 0
result[1] = 100
result[2] = 255
result[3] = 50
result[4] = 0
result[5] = 255
result[6] = 128
result[7] = 0
\`\`\`

Use \`parallel {i} by [8]\`: clamp below 0 to 0, above 255 to 255.`,
  starterCode: `__co__ void parallel_saturate() {
  global int data[8];
  global int result[8];
  int lo = 0;
  int hi = 255;

  parallel {i} by [1] {
    data[0] = -10; data[1] = 100; data[2] = 300; data[3] = 50;
    data[4] = 0; data[5] = 255; data[6] = 128; data[7] = -5;
  }

  // TODO: saturate each element in parallel with if/else

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 0", description: "-10 saturated to 0" },
    { expectedOutput: "result[1] = 100", description: "100 is within range" },
    { expectedOutput: "result[2] = 255", description: "300 saturated to 255" },
    { expectedOutput: "result[7] = 0", description: "-5 saturated to 0" },
    {
      expectedOutput: "result[0] = 0\nresult[1] = 100\nresult[2] = 255\nresult[3] = 50\nresult[4] = 0\nresult[5] = 255\nresult[6] = 128\nresult[7] = 0",
      description: "All values saturated correctly",
    },
  ],
  hint: "Use if/else inside parallel {i} by [8]: if data[i] < lo, result[i] = lo; else if data[i] > hi, result[i] = hi; else result[i] = data[i].",
};
