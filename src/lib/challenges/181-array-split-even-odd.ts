import type { Challenge } from "./index";

export const challenge181: Challenge = {
  id: "c181",
  title: "Array Split Even Odd",
  difficulty: "medium",
  description: `Separate **even-indexed** and **odd-indexed** elements into two contiguous groups.

Given data = [10, 20, 30, 40, 50, 60]:

| index | value |
|-------|-------|
| even  | 10, 30, 50 |
| odd   | 20, 40, 60 |

Expected output:
\`\`\`
result[0] = 10
result[1] = 30
result[2] = 50
result[3] = 20
result[4] = 40
result[5] = 60
\`\`\`

**Pass 1:** \`foreach\` count even-indexed elements. **Pass 2:** \`parallel\` placement using rank within each index parity.`,
  starterCode: `__co__ void array_split_even_odd() {
  global int data[6];
  global int result[6];

  parallel {i} by [1] {
    data[0] = 10; data[1] = 20; data[2] = 30;
    data[3] = 40; data[4] = 50; data[5] = 60;
  }

  // TODO: pass 1 — foreach count even-indexed elements
  // int even_count = 0;
  // foreach i in [0:6] { if (i % 2 == 0) even_count = even_count + 1; }

  // TODO: pass 2 — parallel placement by index parity rank
  // parallel {i} by [6] {
  //   int rank = 0;
  //   if (i % 2 == 0) {
  //     foreach j in [0:i] { if (j % 2 == 0) rank = rank + 1; }
  //     result[rank] = data[i];
  //   } else {
  //     foreach j in [0:i] { if (j % 2 != 0) rank = rank + 1; }
  //     result[even_count + rank] = data[i];
  //   }
  // }

  parallel {i} by [6] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 10", description: "First even-indexed value is 10" },
    { expectedOutput: "result[2] = 50", description: "Last even-indexed value is 50" },
    { expectedOutput: "result[3] = 20", description: "Odd-indexed values start at index 3" },
    {
      expectedOutput: "result[0] = 10\nresult[1] = 30\nresult[2] = 50\nresult[3] = 20\nresult[4] = 40\nresult[5] = 60",
      description: "Full even/odd index split output",
    },
  ],
  hint: "Pass 1: foreach count indices where i % 2 == 0. Pass 2: parallel {i} — foreach j in [0:i] to compute rank within parity, write even indices to result[rank] and odd indices to result[even_count + rank].",
};
