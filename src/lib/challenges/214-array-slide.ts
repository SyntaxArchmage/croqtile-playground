import type { Challenge } from "./index";

export const challenge214: Challenge = {
  id: "c214",
  title: "Array Slide",
  difficulty: "medium",
  description: `Slide all elements **right by K = 2**, filling zeros on the left using \`parallel\`.

Given \`src = [10, 20, 30, 40, 50]\`:

| i | rule              | dst[i] |
|---|-------------------|--------|
| 0 | i < K → zero      | 0      |
| 1 | i < K → zero      | 0      |
| 2 | src[i - K]        | 10     |
| 3 | src[i - K]        | 20     |
| 4 | src[i - K]        | 30     |

Expected output:
\`\`\`
dst[0] = 0
dst[1] = 0
dst[2] = 10
dst[3] = 20
dst[4] = 30
\`\`\`

Use \`if (i < K) dst[i] = 0; else dst[i] = src[i - K];\` with \`K = 2\`.`,
  starterCode: `__co__ void array_slide() {
  int K = 2;
  int N = 5;
  global int src[5];
  global int dst[5];

  parallel {i} by [5] {
    src[i] = (i + 1) * 10;
  }

  // TODO: slide right by K with parallel {i} by [5]
  // if (i < K) { dst[i] = 0; }
  // else { dst[i] = src[i - K]; }

  parallel {i} by [5] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 0", description: "Left slots filled with zero" },
    { expectedOutput: "dst[1] = 0", description: "Second left slot is zero" },
    { expectedOutput: "dst[2] = 10", description: "First source element slides to index 2" },
    { expectedOutput: "dst[4] = 30", description: "Last output holds src[2] = 30" },
    {
      expectedOutput: "dst[0] = 0\ndst[1] = 0\ndst[2] = 10\ndst[3] = 20\ndst[4] = 30",
      description: "Full slide-right-by-2 output",
    },
  ],
  hint: "parallel {i} by [5]: if i < K then dst[i]=0 else dst[i]=src[i-K]. Elements that slide past the end are dropped.",
};
