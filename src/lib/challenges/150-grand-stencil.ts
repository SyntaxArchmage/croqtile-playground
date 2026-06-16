import type { Challenge } from "./index";

export const challenge150: Challenge = {
  id: "c150",
  title: "Grand Challenge: Stencil",
  difficulty: "hard",
  description: `Apply a **1D 3-point stencil** using shared memory and DMA.

Input signal (length 8): \`[1, 2, 3, 4, 5, 6, 7, 8]\`

For each interior index \`i\` in \`[1:7]\`:
\`\`\`
a[i] = b[i - 1] + b[i] + b[i + 1]
\`\`\`

Boundary elements stay unchanged: \`a[0] = b[0]\`, \`a[7] = b[7]\`.

| i | computation | a[i] |
|---|-------------|--------|
| 0 | boundary | 1 |
| 1 | 1 + 2 + 3 | 6 |
| 2 | 2 + 3 + 4 | 9 |
| 3 | 3 + 4 + 5 | 12 |
| 4 | 4 + 5 + 6 | 15 |
| 5 | 5 + 6 + 7 | 18 |
| 6 | 6 + 7 + 8 | 21 |
| 7 | boundary | 8 |

Expected output:
\`\`\`
a[0] = 1
a[1] = 6
a[2] = 9
a[3] = 12
a[4] = 15
a[5] = 18
a[6] = 21
a[7] = 8
\`\`\`

**Steps:** DMA \`b\` into shared memory, then use \`parallel {i} by [8]\` with boundary checks.`,
  starterCode: `__co__ void grand_stencil() {
  global int b[8];
  global int a[8];
  shared int buf[8];

  parallel {i} by [8] {
    b[i] = i + 1;
  }

  // TODO: DMA b into shared buf

  // TODO: parallel {i} by [8] {
  //   if (i == 0 || i == 7) { a[i] = buf[i]; }
  //   else { a[i] = buf[i - 1] + buf[i] + buf[i + 1]; }
  // }

  parallel {i} by [8] {
    println("a[", i, "] =", a[i]);
  }
}
`,
  tests: [
    { expectedOutput: "a[0] = 1", description: "Boundary: a[0] unchanged" },
    { expectedOutput: "a[1] = 6", description: "Stencil: 1 + 2 + 3 = 6" },
    { expectedOutput: "a[6] = 21", description: "Stencil: 6 + 7 + 8 = 21" },
    { expectedOutput: "a[7] = 8", description: "Boundary: a[7] unchanged" },
    {
      expectedOutput: "a[0] = 1\na[1] = 6\na[2] = 9\na[3] = 12\na[4] = 15\na[5] = 18\na[6] = 21\na[7] = 8",
      description: "Full 3-point stencil output",
    },
  ],
  hint: "DMA b into shared buf. Then parallel {i} by [8]: if i is 0 or 7, copy buf[i]; else a[i] = buf[i-1] + buf[i] + buf[i+1].",
};
