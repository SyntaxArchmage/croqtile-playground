import type { Challenge } from "./index";

export const challenge118: Challenge = {
  id: "c118",
  title: "Parallel Power of Two",
  difficulty: "easy",
  description: `Check whether each element is a **power of 2** using \`parallel\` and conditionals.

Given data = [1, 2, 3, 4, 5, 8, 7, 16]:
- 1, 2, 4, 8, 16 are powers of 2
- 3, 5, 7 are not

Expected output:
\`\`\`
pow[0] = true
pow[1] = true
pow[2] = false
pow[3] = true
pow[4] = false
pow[5] = true
pow[6] = false
pow[7] = true
\`\`\`

A positive integer \`n\` is a power of 2 when \`n > 0\` and \`(n & (n - 1)) == 0\`. Use \`parallel {i} by [8]\` for each element.`,
  starterCode: `__co__ void parallel_power_of_two() {
  global int data[8];
  global bool pow[8];

  parallel {i} by [1] {
    data[0] = 1; data[1] = 2; data[2] = 3; data[3] = 4;
    data[4] = 5; data[5] = 8; data[6] = 7; data[7] = 16;
  }

  // TODO: check power of 2 in parallel
  // parallel {i} by [8] {
  //   int n = data[i];
  //   if (n > 0 && (n & (n - 1)) == 0) pow[i] = true;
  //   else pow[i] = false;
  // }

  parallel {i} by [8] {
    println("pow[", i, "] =", pow[i]);
  }
}
`,
  tests: [
    { expectedOutput: "pow[0] = true", description: "1 is 2^0" },
    { expectedOutput: "pow[2] = false", description: "3 is not a power of 2" },
    { expectedOutput: "pow[5] = true", description: "8 is 2^3" },
    {
      expectedOutput: "pow[0] = true\npow[1] = true\npow[2] = false\npow[3] = true\npow[4] = false\npow[5] = true\npow[6] = false\npow[7] = true",
      description: "All power-of-2 checks correct",
    },
  ],
  hint: "Each thread: if n > 0 and (n & (n - 1)) == 0 then true, else false.",
};
