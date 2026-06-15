import type { Challenge } from "./index";

export const challenge05: Challenge = {
  id: "c05",
  title: "Shared Memory Accumulate",
  difficulty: "medium",
  description: `Use shared memory to accumulate partial results from global memory.

1. Create a global array with values [1, 2, 3, 4, 5, 6, 7, 8]
2. DMA the first 4 elements into shared memory
3. DMA the next 4 elements and add them to the shared memory values
4. Print the shared memory contents

Expected output:
\`\`\`
result[0] = 6
result[1] = 8
result[2] = 10
result[3] = 12
\`\`\`

(1+5=6, 2+6=8, 3+7=10, 4+8=12)`,
  starterCode: `__co__ void shared_accumulate() {
  global float data[8];
  shared float acc[4];

  // Initialize data = [1, 2, 3, 4, 5, 6, 7, 8]
  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  // DMA first half into acc

  // DMA second half and add to acc

  parallel {i} by [4] {
    println("result[", i, "] =", acc[i]);
  }
}
`,
  tests: [
    {
      expectedOutput: "result[0] = 6\nresult[1] = 8\nresult[2] = 10\nresult[3] = 12",
      description: "Should accumulate first and second halves",
    },
  ],
  hint: "Load the first four elements into acc with DMA, then add the second four element-wise (acc[i] += data[i+4]).",
};
