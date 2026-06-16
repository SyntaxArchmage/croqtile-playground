import type { Challenge } from "./index";

export const challenge131: Challenge = {
  id: "c131",
  title: "Parallel Even-Odd Split",
  difficulty: "medium",
  description: `Split an array into **even values** first, then **odd values**, preserving relative order within each group.

Given data = [1, 2, 3, 4, 5, 6]:

| group | values   |
|-------|----------|
| even  | 2, 4, 6  |
| odd   | 1, 3, 5  |

Expected output:
\`\`\`
even_count = 3
result[0] = 2
result[1] = 4
result[2] = 6
result[3] = 1
result[4] = 3
result[5] = 5
\`\`\`

**Pass 1** — \`foreach\` count evens. **Pass 2** — \`parallel\` placement using rank within each parity class.`,
  starterCode: `__co__ void parallel_even_odd_split() {
  global int data[6];
  global int result[6];

  parallel {i} by [6] {
    data[i] = i + 1;
  }

  // TODO: pass 1 — foreach count even elements
  // int even_count = 0;
  // foreach i in [0:6] { if (data[i] % 2 == 0) even_count = even_count + 1; }

  // TODO: pass 2 — parallel placement by parity rank
  // parallel {i} by [6] {
  //   int rank = 0;
  //   if (data[i] % 2 == 0) {
  //     foreach j in [0:i] { if (data[j] % 2 == 0) rank = rank + 1; }
  //     result[rank] = data[i];
  //   } else {
  //     foreach j in [0:i] { if (data[j] % 2 != 0) rank = rank + 1; }
  //     result[even_count + rank] = data[i];
  //   }
  // }

  // println("even_count =", even_count);
  // parallel {i} by [6] { println("result[", i, "] =", result[i]); }
}
`,
  tests: [
    { expectedOutput: "even_count = 3", description: "Three even values in [1..6]" },
    { expectedOutput: "result[0] = 2", description: "First even value is 2" },
    { expectedOutput: "result[2] = 6", description: "Last even value is 6" },
    { expectedOutput: "result[3] = 1", description: "Odds start after evens" },
    {
      expectedOutput: "even_count = 3\nresult[0] = 2\nresult[1] = 4\nresult[2] = 6\nresult[3] = 1\nresult[4] = 3\nresult[5] = 5",
      description: "Full even-odd split output",
    },
  ],
  hint: "Pass 1: foreach count evens. Pass 2: parallel {i} — foreach j in [0:i] to compute rank within parity, write evens to result[rank] and odds to result[even_count + rank].",
};
