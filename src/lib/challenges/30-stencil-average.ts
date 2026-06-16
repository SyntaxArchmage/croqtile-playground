import type { Challenge } from "./index";

export const challenge30: Challenge = {
  id: "c30",
  title: "Stencil Average",
  difficulty: "hard",
  description: `Apply a 1D stencil: for each interior element, replace it with the average of itself and its two neighbors. Boundary elements stay unchanged.

Input: \`[10, 20, 30, 40, 50, 60, 70, 80]\`

Expected output:
\`\`\`
out[0] = 10
out[1] = 20
out[2] = 30
out[3] = 40
out[4] = 50
out[5] = 60
out[6] = 70
out[7] = 80
\`\`\`

Use shared memory and DMA to load the input before computing the stencil.`,
  starterCode: `__co__ void stencil_avg() {
  global float data[8];
  global float out[8];
  shared float buf[8];

  parallel {i} by [8] {
    data[i] = (float)((i + 1) * 10);
  }

  // TODO: DMA data into shared buf

  // TODO: for boundaries (i == 0 or i == 7), out[i] = buf[i]
  // TODO: for interior, out[i] = (buf[i-1] + buf[i] + buf[i+1]) / 3.0f

  parallel {i} by [8] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 10", description: "Boundary: out[0] unchanged" },
    { expectedOutput: "out[7] = 80", description: "Boundary: out[7] unchanged" },
    {
      expectedOutput: "out[0] = 10\nout[1] = 20\nout[2] = 30\nout[3] = 40\nout[4] = 50\nout[5] = 60\nout[6] = 70\nout[7] = 80",
      description: "Full stencil average output",
    },
  ],
  hint: "DMA data into shared buf first. Then use parallel with if/else: boundaries copy buf[i] directly; interior computes (buf[i-1] + buf[i] + buf[i+1]) / 3.0f.",
};
