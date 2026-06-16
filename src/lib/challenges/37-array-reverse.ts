import type { Challenge } from "./index";

export const challenge37: Challenge = {
  id: "c37",
  title: "Array Reverse",
  difficulty: "easy",
  description: `Reverse an array of 6 elements using parallel indexing.

Given data = [10, 20, 30, 40, 50, 60], produce [60, 50, 40, 30, 20, 10].

Expected output:
\`\`\`
data[0] = 60
data[1] = 50
data[2] = 40
data[3] = 30
data[4] = 20
data[5] = 10
\`\`\`

Use a shared buffer and DMA to avoid read-write conflicts.`,
  starterCode: `__co__ void array_reverse() {
  global int data[6];
  shared int buf[6];

  parallel {i} by [6] {
    data[i] = (i + 1) * 10;
  }

  // TODO: copy data to buf via dma, then reverse
  // dma(data[0:6], buf[0:6]);
  // parallel {i} by [6] { data[i] = buf[6 - 1 - i]; }

  parallel {i} by [6] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 60", description: "First element is last original" },
    { expectedOutput: "data[5] = 10", description: "Last element is first original" },
    {
      expectedOutput: "data[0] = 60\ndata[1] = 50\ndata[2] = 40\ndata[3] = 30\ndata[4] = 20\ndata[5] = 10",
      description: "Full reversed output",
    },
  ],
  hint: "Copy data to buf with dma, then in a parallel block set data[i] = buf[5 - i].",
};
