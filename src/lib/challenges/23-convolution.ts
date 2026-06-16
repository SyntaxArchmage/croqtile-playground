import type { Challenge } from "./index";

export const challenge23: Challenge = {
  id: "c23",
  title: "1D Convolution",
  difficulty: "hard",
  description: `Apply a 3-element kernel [1, 2, 1] to an input array of 6 values using DMA and shared memory.

Input: [10, 20, 30, 40, 50, 60]
Kernel: [1, 2, 1] (divide by 4 for normalization)

For interior points (indices 1-4):
  out[i] = (input[i-1] * 1 + input[i] * 2 + input[i+1] * 1) / 4

Boundary points (index 0 and 5) copy the input directly.

Expected output:
\`\`\`
out[0] = 10
out[1] = 20
out[2] = 30
out[3] = 40
out[4] = 50
out[5] = 60
\`\`\`

Note: For this arithmetic sequence, the weighted average of neighbors equals the center value!`,
  starterCode: `__co__ void convolve() {
  global float input[6];
  global float output[6];
  shared float buf[6];

  parallel {i} by [6] {
    input[i] = (float)((i + 1) * 10);
  }

  // DMA input to shared buffer
  // TODO: add DMA

  // Apply convolution kernel [1, 2, 1] / 4
  // TODO: boundary handling and interior computation

  parallel {i} by [6] {
    println("out[", i, "] =", output[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 10", description: "Boundary: index 0 copies input" },
    { expectedOutput: "out[5] = 60", description: "Boundary: index 5 copies input" },
    { expectedOutput: "out[2] = 30", description: "Interior: weighted average = center value" },
    { expectedOutput: "out[0] = 10\nout[1] = 20\nout[2] = 30\nout[3] = 40\nout[4] = 50\nout[5] = 60", description: "Full convolution output" },
  ],
  hint: "DMA input into buf. For boundaries (i==0, i==5), copy directly. For interior, compute (buf[i-1] + 2*buf[i] + buf[i+1]) / 4.0f.",
};
