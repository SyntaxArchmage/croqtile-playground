import type { Challenge } from "./index";

export const challenge66: Challenge = {
  id: "c66",
  title: "Array Compress",
  difficulty: "easy",
  description: `Remove **zeros** from an array and print the remaining values in order.

Given data = [3, 0, 7, 0, 0, 2, 0, 5], the compressed result is **[3, 7, 2, 5]**.

Expected output:
\`\`\`
result[0] = 3
result[1] = 7
result[2] = 2
result[3] = 5
length = 4
\`\`\`

Use \`foreach\` to scan the array: when \`data[i] != 0\`, copy to \`result[write]\` and increment \`write\`.`,
  starterCode: `__co__ void array_compress() {
  global int data[8];
  global int result[8];

  parallel {i} by [1] {
    data[0] = 3; data[1] = 0; data[2] = 7; data[3] = 0;
    data[4] = 0; data[5] = 2; data[6] = 0; data[7] = 5;
  }

  // TODO: foreach scan — copy non-zero elements to result
  // int write = 0;
  // foreach i in [0:8] {
  //   if (data[i] != 0) { result[write] = data[i]; write = write + 1; }
  // }

  // foreach i in [0:write] { println("result[", i, "] =", result[i]); }
  // println("length =", write);
}
`,
  tests: [
    { expectedOutput: "result[0] = 3", description: "First non-zero element is 3" },
    { expectedOutput: "result[1] = 7", description: "Second non-zero element is 7" },
    { expectedOutput: "result[3] = 5", description: "Last non-zero element is 5" },
    { expectedOutput: "length = 4", description: "Four non-zero elements remain" },
    {
      expectedOutput: "result[0] = 3\nresult[1] = 7\nresult[2] = 2\nresult[3] = 5\nlength = 4",
      description: "Full compressed output",
    },
  ],
  hint: "Track write = 0. foreach i in [0:8]: if data[i] != 0, store in result[write] and increment write.",
};
