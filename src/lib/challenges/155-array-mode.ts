import type { Challenge } from "./index";

export const challenge155: Challenge = {
  id: "c155",
  title: "Array Mode",
  difficulty: "hard",
  description: `Find the **most frequent element** (mode) in an array.

Given data = [3, 7, 2, 7, 1, 7, 4, 8], the value **7** appears **3** times — more than any other.

Expected output:
\`\`\`
mode = 7
count = 3
\`\`\`

**Pass 1:** \`foreach\` to build a frequency table \`freq[v]\`.
**Pass 2:** \`foreach\` over possible values to find the maximum frequency and its value.`,
  starterCode: `__co__ void array_mode() {
  global int data[8];
  global int freq[10];

  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = 2; data[3] = 7;
    data[4] = 1; data[5] = 7; data[6] = 4; data[7] = 8;
  }

  parallel {i} by [10] {
    freq[i] = 0;
  }

  // TODO: foreach i in [0:8] { freq[data[i]] = freq[data[i]] + 1; }

  int mode = 0;
  int count = 0;

  // TODO: foreach v in [0:10] {
  //   if (freq[v] > count) { count = freq[v]; mode = v; }
  // }

  println("mode =", mode);
  println("count =", count);
}
`,
  tests: [
    { expectedOutput: "mode = 7", description: "Most frequent value is 7" },
    { expectedOutput: "count = 3", description: "7 appears three times" },
    { expectedOutput: "mode = 7\ncount = 3", description: "Mode and frequency correct" },
  ],
  hint: "Build freq with foreach over data. Then foreach v in [0:10]: if freq[v] > count, update mode and count.",
};
