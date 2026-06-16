import type { Challenge } from "./index";

export const challenge134: Challenge = {
  id: "c134",
  title: "Parallel Bit Count",
  difficulty: "easy",
  description: `Count the number of **set bits** in each array element using \`parallel\`.

Given data = [0, 1, 3, 7, 15]:

| value | binary | bits |
|-------|--------|------|
| 0     | 0      | 0    |
| 1     | 1      | 1    |
| 3     | 11     | 2    |
| 7     | 111    | 3    |
| 15    | 1111   | 4    |

Expected output:
\`\`\`
bits[0] = 0
bits[1] = 1
bits[2] = 2
bits[3] = 3
bits[4] = 4
\`\`\`

Each thread repeatedly checks \`n & 1\` and shifts \`n\` right until zero.`,
  starterCode: `__co__ void parallel_bit_count() {
  global int data[5];
  global int bits[5];

  parallel {i} by [1] {
    data[0] = 0; data[1] = 1; data[2] = 3;
    data[3] = 7; data[4] = 15;
  }

  // TODO: count set bits in parallel {i} by [5]
  // int n = data[i];
  // int count = 0;
  // while (n > 0) {
  //   if (n & 1) count = count + 1;
  //   n = n >> 1;
  // }
  // bits[i] = count;

  parallel {i} by [5] {
    println("bits[", i, "] =", bits[i]);
  }
}
`,
  tests: [
    { expectedOutput: "bits[0] = 0", description: "Zero has no set bits" },
    { expectedOutput: "bits[1] = 1", description: "1 has one set bit" },
    { expectedOutput: "bits[3] = 3", description: "7 has three set bits" },
    {
      expectedOutput: "bits[0] = 0\nbits[1] = 1\nbits[2] = 2\nbits[3] = 3\nbits[4] = 4",
      description: "All bit counts correct",
    },
  ],
  hint: "Each thread: loop while n > 0, add 1 when n & 1 is non-zero, then shift n right by 1.",
};
