import type { Challenge } from "./index";

export const challenge170: Challenge = {
  id: "c170",
  title: "Grand Challenge: FFT Butterfly",
  difficulty: "hard",
  description: `Perform a single **FFT butterfly stage** on a length-4 array using shared memory and DMA.

Given input \`a = [1, 2, 3, 4]\`, a butterfly stage pairs index \`i\` with \`i + N/2\`:

\`\`\`
out[i]       = a[i] + a[i + 2]
out[i + N/2] = a[i] - a[i + 2]
\`\`\`

| i | out[i] = a[i]+a[i+2] | out[i+2] = a[i]-a[i+2] |
|---|----------------------|------------------------|
| 0 | 1 + 3 = 4            | 1 - 3 = -2             |
| 1 | 2 + 4 = 6            | 2 - 4 = -2             |

Expected output:
\`\`\`
out[0] = 4
out[1] = 6
out[2] = -2
out[3] = -2
\`\`\`

**Steps:** DMA \`a\` into shared memory, then \`parallel {i} by [2]\` for the butterfly pairs.`,
  starterCode: `__co__ void grand_fft_butterfly() {
  global int a[4];
  global int out[4];
  shared int buf[4];
  int half = 2;

  parallel {i} by [1] {
    a[0] = 1; a[1] = 2; a[2] = 3; a[3] = 4;
  }

  // TODO: DMA a into shared buf

  // TODO: parallel {i} by [2] {
  //   out[i] = buf[i] + buf[i + half];
  //   out[i + half] = buf[i] - buf[i + half];
  // }

  parallel {i} by [4] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 4", description: "Butterfly sum: 1 + 3 = 4" },
    { expectedOutput: "out[1] = 6", description: "Butterfly sum: 2 + 4 = 6" },
    { expectedOutput: "out[2] = -2", description: "Butterfly diff: 1 - 3 = -2" },
    { expectedOutput: "out[3] = -2", description: "Butterfly diff: 2 - 4 = -2" },
    {
      expectedOutput: "out[0] = 4\nout[1] = 6\nout[2] = -2\nout[3] = -2",
      description: "Full butterfly stage output",
    },
  ],
  hint: "DMA a into shared buf. parallel {i} by [2]: out[i]=buf[i]+buf[i+2], out[i+2]=buf[i]-buf[i+2].",
};
