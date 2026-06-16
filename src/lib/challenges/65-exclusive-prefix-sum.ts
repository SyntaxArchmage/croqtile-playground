import type { Challenge } from "./index";

export const challenge65: Challenge = {
  id: "c65",
  title: "Exclusive Prefix Sum",
  difficulty: "hard",
  description: `Compute the **exclusive prefix sum** of an 8-element array — each output is the sum of all elements **before** index \`i\`, with \`prefix[0] = 0\`.

Given data = [1, 2, 3, 4, 5, 6, 7, 8]:

\`\`\`
prefix = [0, 1, 3, 6, 10, 15, 21, 28]
\`\`\`

Expected output:
\`\`\`
prefix[0] = 0
prefix[1] = 1
prefix[3] = 6
prefix[7] = 28
\`\`\`

Use a sequential \`foreach\` loop: set \`prefix[0] = 0\`, then \`prefix[i] = prefix[i - 1] + data[i - 1]\` for \`i >= 1\`.`,
  starterCode: `__co__ void exclusive_prefix_sum() {
  global int data[8];
  global int prefix[8];

  parallel {i} by [8] {
    data[i] = i + 1;
  }

  // TODO: exclusive prefix sum — prefix[0] = 0, then accumulate prior elements
  // prefix[0] = 0;
  // foreach i in [1:8] {
  //   prefix[i] = prefix[i - 1] + data[i - 1];
  // }

  parallel {i} by [8] {
    println("prefix[", i, "] =", prefix[i]);
  }
}
`,
  tests: [
    { expectedOutput: "prefix[0] = 0", description: "First exclusive prefix is zero" },
    { expectedOutput: "prefix[1] = 1", description: "prefix[1] sums data[0]" },
    { expectedOutput: "prefix[3] = 6", description: "prefix[3] = 1 + 2 + 3" },
    { expectedOutput: "prefix[7] = 28", description: "prefix[7] sums data[0..6]" },
    {
      expectedOutput: "prefix[0] = 0\nprefix[1] = 1\nprefix[2] = 3\nprefix[3] = 6\nprefix[4] = 10\nprefix[5] = 15\nprefix[6] = 21\nprefix[7] = 28",
      description: "Full exclusive prefix sum output",
    },
  ],
  hint: "prefix[0] = 0. foreach i in [1:8]: prefix[i] = prefix[i-1] + data[i-1]. Each slot is the inclusive sum of all prior data elements.",
};
