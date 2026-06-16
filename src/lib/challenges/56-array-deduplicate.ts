import type { Challenge } from "./index";

export const challenge56: Challenge = {
  id: "c56",
  title: "Array Deduplicate",
  difficulty: "medium",
  description: `Remove **consecutive** duplicates from an array using \`foreach\`.

Given data = [1, 1, 2, 2, 2, 3, 3, 1], keep only the first occurrence of each run:
\`\`\`
result = [1, 2, 3, 1]
\`\`\`

Expected output:
\`\`\`
result[0] = 1
result[1] = 2
result[2] = 3
result[3] = 1
length = 4
\`\`\`

Use a \`foreach\` loop: always copy the first element, then append \`data[i]\` only when \`data[i] != data[i - 1]\`. Track the write index with a counter.`,
  starterCode: `__co__ void array_deduplicate() {
  global int data[8];
  global int result[8];

  parallel {i} by [1] {
    data[0] = 1; data[1] = 1; data[2] = 2; data[3] = 2;
    data[4] = 2; data[5] = 3; data[6] = 3; data[7] = 1;
  }

  // TODO: remove consecutive duplicates with foreach
  // int len = 1;
  // result[0] = data[0];
  // foreach i in [1:8] {
  //   if (data[i] != data[i - 1]) { result[len] = data[i]; len = len + 1; }
  // }

  // foreach i in [0:len] { println("result[", i, "] =", result[i]); }
  // println("length =", len);
}
`,
  tests: [
    { expectedOutput: "result[0] = 1", description: "First element kept" },
    { expectedOutput: "result[1] = 2", description: "Second unique run starts at 2" },
    { expectedOutput: "result[3] = 1", description: "Final 1 after run of 3s" },
    { expectedOutput: "length = 4", description: "Four elements after deduplication" },
    {
      expectedOutput: "result[0] = 1\nresult[1] = 2\nresult[2] = 3\nresult[3] = 1\nlength = 4",
      description: "Full deduplicated output",
    },
  ],
  hint: "Start with len = 1 and result[0] = data[0]. In foreach i in [1:8], when data[i] != data[i-1], copy to result[len] and increment len.",
};
