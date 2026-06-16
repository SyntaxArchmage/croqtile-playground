import type { Challenge } from "./index";

export const challenge62: Challenge = {
  id: "c62",
  title: "Two-Pass Filter",
  difficulty: "hard",
  description: `Filter elements **greater than 5** from an array using a two-pass approach.

Given data = [3, 7, 12, 5, 9, 2, 15, 8]:

**Pass 1** — count qualifying elements (\`data[i] > 5\`): **count = 4**

**Pass 2** — extract them into \`result\` in order: **[7, 12, 9, 15]**

Expected output:
\`\`\`
count = 4
result[0] = 7
result[1] = 12
result[2] = 9
result[3] = 15
\`\`\`

Use sequential \`foreach\` loops for both passes — counting and compacting cannot safely race on a shared write index.`,
  starterCode: `__co__ void two_pass_filter() {
  global int data[8];
  global int result[8];

  parallel {i} by [1] {
    data[0] = 3;  data[1] = 7;  data[2] = 12; data[3] = 5;
    data[4] = 9;  data[5] = 2;  data[6] = 15; data[7] = 8;
  }

  // TODO: pass 1 — count elements where data[i] > 5
  // int count = 0;
  // foreach i in [0:8] { if (data[i] > 5) count = count + 1; }

  // TODO: pass 2 — extract qualifying elements into result
  // int write = 0;
  // foreach i in [0:8] {
  //   if (data[i] > 5) { result[write] = data[i]; write = write + 1; }
  // }

  // println("count =", count);
  // foreach i in [0:count] { println("result[", i, "] =", result[i]); }
}
`,
  tests: [
    { expectedOutput: "count = 4", description: "Four elements exceed threshold 5" },
    { expectedOutput: "result[0] = 7", description: "First filtered element is 7" },
    { expectedOutput: "result[2] = 9", description: "Third filtered element is 9" },
    { expectedOutput: "result[3] = 15", description: "Last filtered element is 15" },
    {
      expectedOutput: "count = 4\nresult[0] = 7\nresult[1] = 12\nresult[2] = 9\nresult[3] = 15",
      description: "Full two-pass filter output",
    },
  ],
  hint: "Pass 1: foreach and increment count when data[i] > 5. Pass 2: foreach again with a write index — copy qualifying elements to result[write] and increment write.",
};
