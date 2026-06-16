import type { Challenge } from "./index";

export const challenge89: Challenge = {
  id: "c89",
  title: "Staircase Pattern",
  difficulty: "medium",
  description: `Print a staircase pattern where row \`i\` has \`i + 1\` stars (for a 4-row staircase).

Expected output:
\`\`\`
*
**
***
****
\`\`\`

Use \`parallel {i} by [4]\` over rows. Inside each row, use \`foreach\` with a conditional to print stars only when \`j <= i\`, then \`println()\` for a newline.`,
  starterCode: `__co__ void staircase_pattern() {
  int rows = 4;

  // TODO: print staircase with parallel rows and conditionals
  // parallel {i} by [4] {
  //   foreach j in [0:4] {
  //     if (j <= i) { print('*'); }
  //   }
  //   println();
  // }
}
`,
  tests: [
    { expectedOutput: "*", description: "First row has one star" },
    { expectedOutput: "**", description: "Second row has two stars" },
    { expectedOutput: "***", description: "Third row has three stars" },
    {
      expectedOutput: "*\n**\n***\n****",
      description: "Full 4-row staircase pattern",
    },
  ],
  hint: "For each row i in parallel, foreach j in [0:4] and print '*' when j <= i. Call println() after each row's stars.",
};
