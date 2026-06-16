import type { Challenge } from "./index";

export const challenge237: Challenge = {
  id: "c237",
  title: "Parallel Bitwise NOT",
  difficulty: "easy",
  description: `Apply **bitwise NOT** to each 8-bit element using \`parallel\`.

Given data = [0, 1, 5, 15], mask with \`0xFF\` after NOT to keep 8 bits:

| data[i] | ~data[i] & 0xFF |
|---------|-----------------|
| 0       | 255             |
| 1       | 254             |
| 5       | 250             |
| 15      | 240             |

Expected output:
\`\`\`
out[0] = 255
out[1] = 254
out[2] = 250
out[3] = 240
\`\`\`

Use \`parallel {i} by [4]\` with \`out[i] = (~data[i]) & 0xFF\`.`,
  starterCode: `__co__ void parallel_bitwise_not() {
  global int data[4];
  global int out[4];

  parallel {i} by [1] {
    data[0] = 0; data[1] = 1; data[2] = 5; data[3] = 15;
  }

  // TODO: parallel {i} by [4] { out[i] = (~data[i]) & 0xFF; }

  parallel {i} by [4] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 255", description: "~0 & 0xFF = 255" },
    { expectedOutput: "out[1] = 254", description: "~1 & 0xFF = 254" },
    { expectedOutput: "out[2] = 250", description: "~5 & 0xFF = 250" },
    { expectedOutput: "out[3] = 240", description: "~15 & 0xFF = 240" },
    {
      expectedOutput: "out[0] = 255\nout[1] = 254\nout[2] = 250\nout[3] = 240",
      description: "Full parallel bitwise NOT output",
    },
  ],
  hint: "parallel {i} by [4] { out[i] = (~data[i]) & 0xFF; } — mask to 8 bits after NOT.",
};
