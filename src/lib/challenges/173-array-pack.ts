import type { Challenge } from "./index";

export const challenge173: Challenge = {
  id: "c173",
  title: "Array Pack",
  difficulty: "medium",
  description: `**Pack** all non-zero elements to the front of a new array using \`foreach\`.

Given data = [0, 3, 0, 7, 0, 2, 5, 0], the packed result is **[3, 7, 2, 5]** with length 4.

Expected output:
\`\`\`
packed[0] = 3
packed[1] = 7
packed[2] = 2
packed[3] = 5
length = 4
\`\`\`

Scan with \`foreach\`: when \`data[i] != 0\`, copy to \`packed[write]\` and increment \`write\`.`,
  starterCode: `__co__ void array_pack() {
  global int data[8];
  global int packed[8];

  parallel {i} by [1] {
    data[0] = 0; data[1] = 3; data[2] = 0; data[3] = 7;
    data[4] = 0; data[5] = 2; data[6] = 5; data[7] = 0;
  }

  // TODO: foreach scan — pack non-zero elements to front
  // int write = 0;
  // foreach i in [0:8] {
  //   if (data[i] != 0) { packed[write] = data[i]; write = write + 1; }
  // }

  // foreach i in [0:write] { println("packed[", i, "] =", packed[i]); }
  // println("length =", write);
}
`,
  tests: [
    { expectedOutput: "packed[0] = 3", description: "First non-zero element is 3" },
    { expectedOutput: "packed[1] = 7", description: "Second non-zero element is 7" },
    { expectedOutput: "packed[3] = 5", description: "Last packed element is 5" },
    { expectedOutput: "length = 4", description: "Four non-zero elements packed" },
    {
      expectedOutput: "packed[0] = 3\npacked[1] = 7\npacked[2] = 2\npacked[3] = 5\nlength = 4",
      description: "Full packed output",
    },
  ],
  hint: "Track write = 0. foreach i in [0:8]: if data[i] != 0, store in packed[write] and increment write.",
};
