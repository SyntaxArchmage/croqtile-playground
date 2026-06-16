import type { Challenge } from "./index";

export const challenge197: Challenge = {
  id: "c197",
  title: "Array Majority Element",
  difficulty: "hard",
  description: `Find the **majority element** — the value appearing more than **N/2** times.

Given data = [2, 2, 1, 2, 3, 2, 2] (7 elements):

The value **2** appears **5** times, which is > 7/2 = 3.

Expected output:
\`\`\`
majority = 2
count = 5
\`\`\`

**Pass 1:** \`foreach\` to build a frequency table \`freq[v]\`.
**Pass 2:** \`foreach\` to find the value with count > N/2.`,
  starterCode: `__co__ void array_majority_element() {
  global int data[7];
  global int freq[5];
  int n = 7;

  parallel {i} by [1] {
    data[0] = 2; data[1] = 2; data[2] = 1; data[3] = 2;
    data[4] = 3; data[5] = 2; data[6] = 2;
  }

  parallel {i} by [5] {
    freq[i] = 0;
  }

  // TODO: foreach i in [0:n] { freq[data[i]] = freq[data[i]] + 1; }

  int majority = 0;
  int count = 0;

  // TODO: foreach v in [0:5] {
  //   if (freq[v] > n / 2) { majority = v; count = freq[v]; }
  // }

  println("majority =", majority);
  println("count =", count);
}
`,
  tests: [
    { expectedOutput: "majority = 2", description: "Majority element is 2" },
    { expectedOutput: "count = 5", description: "2 appears five times (> 7/2)" },
    { expectedOutput: "majority = 2\ncount = 5", description: "Majority element and count correct" },
  ],
  hint: "Build freq with foreach over data. Then foreach v in [0:5]: if freq[v] > n/2, set majority = v and count = freq[v].",
};
