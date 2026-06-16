import type { Challenge } from "./index";

export const challenge119: Challenge = {
  id: "c119",
  title: "Array Dedup Adjacent",
  difficulty: "hard",
  description: `Remove **consecutive duplicate** elements from an array using \`foreach\`.

Given data = [2, 2, 3, 3, 3, 2, 2, 1], keep only the first occurrence of each run:
\`\`\`
result = [2, 3, 2, 1]
\`\`\`

Expected output:
\`\`\`
result[0] = 2
result[1] = 3
result[2] = 2
result[3] = 1
length = 4
\`\`\`

Always copy the first element, then append \`data[i]\` only when \`data[i] != data[i - 1]\`. Track the write index with a counter.`,
  starterCode: `__co__ void array_dedup_adjacent() {
  global int data[8];
  global int result[8];

  parallel {i} by [1] {
    data[0] = 2; data[1] = 2; data[2] = 3; data[3] = 3;
    data[4] = 3; data[5] = 2; data[6] = 2; data[7] = 1;
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
    { expectedOutput: "result[0] = 2", description: "First element kept" },
    { expectedOutput: "result[1] = 3", description: "Second unique run starts at 3" },
    { expectedOutput: "result[3] = 1", description: "Final 1 after run of 2s" },
    { expectedOutput: "length = 4", description: "Four elements after deduplication" },
    {
      expectedOutput: "result[0] = 2\nresult[1] = 3\nresult[2] = 2\nresult[3] = 1\nlength = 4",
      description: "Full deduplicated output",
    },
  ],
  hint: "Start with len = 1 and result[0] = data[0]. In foreach i in [1:8], when data[i] != data[i-1], copy to result[len] and increment len.",
};
