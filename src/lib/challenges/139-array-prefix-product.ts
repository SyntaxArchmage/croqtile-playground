import type { Challenge } from "./index";

export const challenge139: Challenge = {
  id: "c139",
  title: "Array Prefix Product",
  difficulty: "medium",
  description: `Compute the **prefix product** (inclusive scan) of an array using \`foreach\`.

Given data = [2, 3, 4, 5, 6]:

| i | prefix[i] = product(data[0..i]) |
|---|----------------------------------|
| 0 | 2                                |
| 1 | 6                                |
| 2 | 24                               |
| 3 | 120                              |
| 4 | 720                              |

Expected output:
\`\`\`
prefix[0] = 2
prefix[1] = 6
prefix[2] = 24
prefix[3] = 120
prefix[4] = 720
\`\`\`

Set \`prefix[0] = data[0]\`, then multiply forward with a sequential \`foreach\` loop.`,
  starterCode: `__co__ void array_prefix_product() {
  global int data[5];
  global int prefix[5];

  parallel {i} by [5] {
    data[i] = i + 2;
  }

  // TODO: compute inclusive prefix product with foreach
  // prefix[0] = data[0];
  // foreach i in [1:5] { prefix[i] = prefix[i - 1] * data[i]; }

  parallel {i} by [5] {
    println("prefix[", i, "] =", prefix[i]);
  }
}
`,
  tests: [
    { expectedOutput: "prefix[0] = 2", description: "prefix[0] = 2" },
    { expectedOutput: "prefix[2] = 24", description: "prefix[2] = 2×3×4 = 24" },
    { expectedOutput: "prefix[4] = 720", description: "prefix[4] = 720" },
    {
      expectedOutput: "prefix[0] = 2\nprefix[1] = 6\nprefix[2] = 24\nprefix[3] = 120\nprefix[4] = 720",
      description: "Full prefix product output",
    },
  ],
  hint: "Set prefix[0] = data[0], then foreach i in [1:5] { prefix[i] = prefix[i-1] * data[i]; } — same pattern as prefix sum but multiply.",
};
