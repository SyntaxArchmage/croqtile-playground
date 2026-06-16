import type { Challenge } from "./index";

export const challenge130: Challenge = {
  id: "c130",
  title: "Grand Challenge: Convolution",
  difficulty: "hard",
  description: `Compute a **1D convolution** with a 3-element kernel using shared memory and DMA.

Input signal (length 7): \`[1, 2, 3, 4, 5, 6, 7]\`
Kernel (length 3): \`[1, 2, 1]\`

For each output index \`j\` in \`[0:5]\`:
\`\`\`
out[j] = signal[j] * k[0] + signal[j + 1] * k[1] + signal[j + 2] * k[2]
\`\`\`

| j | computation | out[j] |
|---|-------------|--------|
| 0 | 1×1 + 2×2 + 3×1 | 8 |
| 1 | 2×1 + 3×2 + 4×1 | 12 |
| 2 | 3×1 + 4×2 + 5×1 | 16 |
| 3 | 4×1 + 5×2 + 6×1 | 20 |
| 4 | 5×1 + 6×2 + 7×1 | 24 |

Expected output:
\`\`\`
out[0] = 8
out[1] = 12
out[2] = 16
out[3] = 20
out[4] = 24
\`\`\`

**Steps:** DMA signal into shared memory, then use \`parallel {j} by [5]\` to compute each convolution output.`,
  starterCode: `__co__ void grand_convolution() {
  global int signal[7];
  global int kernel[3];
  global int out[5];
  shared int buf[7];

  parallel {i} by [7] { signal[i] = i + 1; }
  parallel {i} by [1] { kernel[0] = 1; kernel[1] = 2; kernel[2] = 1; }

  // TODO: DMA signal into shared buf

  // TODO: parallel {j} by [5] {
  //   out[j] = buf[j] * kernel[0] + buf[j + 1] * kernel[1] + buf[j + 2] * kernel[2];
  // }

  parallel {j} by [5] {
    println("out[", j, "] =", out[j]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 8", description: "First convolution output = 1+4+3" },
    { expectedOutput: "out[2] = 16", description: "Middle convolution output = 3+8+5" },
    { expectedOutput: "out[4] = 24", description: "Last convolution output = 5+12+7" },
    {
      expectedOutput: "out[0] = 8\nout[1] = 12\nout[2] = 16\nout[3] = 20\nout[4] = 24",
      description: "Full convolution output",
    },
  ],
  hint: "DMA signal into shared buf. Then parallel {j} by [5]: out[j] = buf[j]*k[0] + buf[j+1]*k[1] + buf[j+2]*k[2]. Each thread slides a 3-element window.",
};
