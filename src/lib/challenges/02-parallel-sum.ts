import type { Challenge } from "./index";

export const challenge02: Challenge = {
  id: "c02",
  title: "Parallel Initialize",
  difficulty: "easy",
  description: `Create a global array \`data\` of 8 floats and initialize each element to its index squared.

Then print all values. Expected output:
\`\`\`
data[0] = 0
data[1] = 1
data[2] = 4
data[3] = 9
data[4] = 16
data[5] = 25
data[6] = 36
data[7] = 49
\`\`\``,
  starterCode: `__co__ void init_squares() {
  global float data[8];

  // Initialize data[i] = i * i using parallel
  // Then print each element
}
`,
  tests: [
    {
      expectedOutput: "data[0] = 0\ndata[1] = 1\ndata[2] = 4\ndata[3] = 9\ndata[4] = 16\ndata[5] = 25\ndata[6] = 36\ndata[7] = 49",
      description: "Should compute i*i for each index",
    },
  ],
  hint: "parallel {i} by [8] { data[i] = (float)(i * i); }",
};
