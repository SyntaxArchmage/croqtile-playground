import type { Challenge } from "./index";

export const challenge99: Challenge = {
  id: "c99",
  title: "Bitwise AND Reduction",
  difficulty: "medium",
  description: `Reduce an array to a single value by computing the **bitwise AND** of all elements using \`foreach\`.

Given data = [15, 7, 3, 1]:

\`\`\`
15 & 7 = 7
7 & 3 = 3
3 & 1 = 1
\`\`\`

Expected output:
\`\`\`
result = 1
\`\`\`

Initialize from \`data[0]\`, then fold with \`&\` across the remaining indices in one sequential scan.`,
  starterCode: `__co__ void bitwise_and_reduction() {
  global int data[4];

  parallel {i} by [1] {
    data[0] = 15; data[1] = 7; data[2] = 3; data[3] = 1;
  }

  // TODO: reduce with foreach and bitwise AND
  // int result = data[0];
  // foreach i in [1:4] {
  //   result = result & data[i];
  // }

  // println("result =", result);
}
`,
  tests: [
    {
      expectedOutput: "result = 1",
      description: "Bitwise AND of [15, 7, 3, 1] is 1",
    },
  ],
  hint: "Start result = data[0]. In foreach i in [1:4], update result = result & data[i].",
};
