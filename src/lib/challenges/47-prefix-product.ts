import type { Challenge } from "./index";

export const challenge47: Challenge = {
  id: "c47",
  title: "Prefix Product",
  difficulty: "medium",
  description: `Compute the prefix product (inclusive scan) of an array using \`foreach\`.

Given data = [1, 2, 3, 4, 5, 6, 7, 8], compute prefix[i] = product(data[0..i]).

Expected output:
\`\`\`
prefix[0] = 1
prefix[1] = 2
prefix[2] = 6
prefix[3] = 24
prefix[4] = 120
prefix[5] = 720
prefix[6] = 5040
prefix[7] = 40320
\`\`\`

Print each result as: prefix[i] = <value>`,
  starterCode: `__co__ void prefix_product() {
  global float data[8];
  global float prefix[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  // TODO: compute inclusive prefix product with foreach
  // prefix[0] = data[0]
  // foreach i in [1:8] { prefix[i] = prefix[i-1] * data[i]; }

  parallel {i} by [8] {
    println("prefix[", i, "] =", prefix[i]);
  }
}
`,
  tests: [
    { expectedOutput: "prefix[0] = 1", description: "prefix[0] = 1" },
    { expectedOutput: "prefix[3] = 24", description: "prefix[3] = 24" },
    { expectedOutput: "prefix[7] = 40320", description: "prefix[7] = 40320" },
    {
      expectedOutput: "prefix[0] = 1\nprefix[1] = 2\nprefix[2] = 6\nprefix[3] = 24\nprefix[4] = 120\nprefix[5] = 720\nprefix[6] = 5040\nprefix[7] = 40320",
      description: "Full prefix product output",
    },
  ],
  hint: "Set prefix[0] = data[0], then foreach i in [1:8] { prefix[i] = prefix[i-1] * data[i]; } — same pattern as prefix sum but multiply.",
};
