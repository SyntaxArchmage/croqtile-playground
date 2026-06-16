import type { Challenge } from "./index";

export const challenge221: Challenge = {
  id: "c221",
  title: "Array Insert At",
  difficulty: "medium",
  description: `Insert value **99** at **index 2**, shifting existing elements right using sequential \`foreach\`.

Given src = [10, 20, 30, 40, 50], insert 99 at index 2:

Expected output:
\`\`\`
dst[0] = 10
dst[1] = 20
dst[2] = 99
dst[3] = 30
dst[4] = 40
dst[5] = 50
\`\`\`

Copy elements before the index, write the new value, then copy the remaining elements shifted by one slot.`,
  starterCode: `__co__ void array_insert_at() {
  int insert_idx = 2;
  int value = 99;
  global int src[5];
  global int dst[6];

  parallel {i} by [1] {
    src[0] = 10; src[1] = 20; src[2] = 30;
    src[3] = 40; src[4] = 50;
  }

  // TODO: copy src into dst with value inserted at insert_idx
  // int write = 0;
  // foreach i in [0:5] {
  //   if (write == insert_idx) {
  //     dst[write] = value;
  //     write = write + 1;
  //   }
  //   dst[write] = src[i];
  //   write = write + 1;
  // }

  parallel {i} by [6] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dst[0] = 10", description: "Elements before index unchanged" },
    { expectedOutput: "dst[1] = 20", description: "Second element unchanged" },
    { expectedOutput: "dst[2] = 99", description: "Inserted value at index 2" },
    { expectedOutput: "dst[3] = 30", description: "Original index 2 shifts right" },
    { expectedOutput: "dst[5] = 50", description: "Last element at new index 5" },
    {
      expectedOutput: "dst[0] = 10\ndst[1] = 20\ndst[2] = 99\ndst[3] = 30\ndst[4] = 40\ndst[5] = 50",
      description: "Full insert-at-index output",
    },
  ],
  hint: "foreach i in [0:5]: when write == insert_idx, store value and increment write. Then copy src[i] to dst[write] and increment write.",
};
