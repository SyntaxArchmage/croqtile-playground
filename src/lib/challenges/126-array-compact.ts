import type { Challenge } from "./index";

export const challenge126: Challenge = {
  id: "c126",
  title: "Array Compact",
  difficulty: "hard",
  description: `Remove **all zeros** from an array, shifting remaining elements left using a two-pass approach.

Given data = [3, 0, 7, 0, 0, 2, 0, 5]:

**Pass 1** — count non-zero elements: **count = 4**

**Pass 2** — copy non-zero values into \`result\` in order: **[3, 7, 2, 5]**

Expected output:
\`\`\`
result[0] = 3
result[1] = 7
result[2] = 2
result[3] = 5
length = 4
\`\`\`

Use sequential \`foreach\` loops for both passes — compacting cannot safely race on a shared write index.`,
  starterCode: `__co__ void array_compact() {
  global int data[8];
  global int result[8];

  parallel {i} by [1] {
    data[0] = 3; data[1] = 0; data[2] = 7; data[3] = 0;
    data[4] = 0; data[5] = 2; data[6] = 0; data[7] = 5;
  }

  // TODO: pass 1 — count non-zero elements
  // int count = 0;
  // foreach i in [0:8] { if (data[i] != 0) count = count + 1; }

  // TODO: pass 2 — copy non-zero elements into result
  // int write = 0;
  // foreach i in [0:8] {
  //   if (data[i] != 0) { result[write] = data[i]; write = write + 1; }
  // }

  // foreach i in [0:count] { println("result[", i, "] =", result[i]); }
  // println("length =", count);
}
`,
  tests: [
    { expectedOutput: "result[0] = 3", description: "First non-zero element is 3" },
    { expectedOutput: "result[1] = 7", description: "Second non-zero element is 7" },
    { expectedOutput: "result[3] = 5", description: "Last non-zero element is 5" },
    { expectedOutput: "length = 4", description: "Four non-zero elements remain" },
    {
      expectedOutput: "result[0] = 3\nresult[1] = 7\nresult[2] = 2\nresult[3] = 5\nlength = 4",
      description: "Full compact output",
    },
  ],
  hint: "Pass 1: foreach and increment count when data[i] != 0. Pass 2: foreach with write index — copy non-zero values to result[write] and increment write.",
};
