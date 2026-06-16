import type { Challenge } from "./index";

export const challenge217: Challenge = {
  id: "c217",
  title: "Array Remove At",
  difficulty: "medium",
  description: `Remove the element at **index 2** and shift remaining elements left using sequential \`foreach\`.

Given src = [10, 20, 30, 40, 50], remove index 2 (value 30):

Expected output:
\`\`\`
dst[0] = 10
dst[1] = 20
dst[2] = 40
dst[3] = 50
length = 4
\`\`\`

Copy elements before the index, skip the removed slot, then copy elements after it.`,
  starterCode: `__co__ void array_remove_at() {
  int remove_idx = 2;
  global int src[5];
  global int dst[4];

  parallel {i} by [1] {
    src[0] = 10; src[1] = 20; src[2] = 30;
    src[3] = 40; src[4] = 50;
  }

  // TODO: copy src into dst skipping index remove_idx
  // int write = 0;
  // foreach i in [0:5] {
  //   if (i != remove_idx) {
  //     dst[write] = src[i];
  //     write = write + 1;
  //   }
  // }
  // int length = write;

  // foreach i in [0:length] { println("dst[", i, "] =", dst[i]); }
  // println("length =", length);
}
`,
  tests: [
    { expectedOutput: "dst[0] = 10", description: "First element unchanged" },
    { expectedOutput: "dst[1] = 20", description: "Second element unchanged" },
    { expectedOutput: "dst[2] = 40", description: "Element after removed index shifts left" },
    { expectedOutput: "dst[3] = 50", description: "Last element shifts to index 3" },
    { expectedOutput: "length = 4", description: "Array length decreases by 1" },
    {
      expectedOutput: "dst[0] = 10\ndst[1] = 20\ndst[2] = 40\ndst[3] = 50\nlength = 4",
      description: "Full remove-at-index output",
    },
  ],
  hint: "foreach i in [0:5]: if i != remove_idx, copy src[i] to dst[write] and increment write. Print length = write.",
};
