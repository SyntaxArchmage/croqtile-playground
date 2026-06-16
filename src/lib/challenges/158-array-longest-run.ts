import type { Challenge } from "./index";

export const challenge158: Challenge = {
  id: "c158",
  title: "Array Longest Run",
  difficulty: "hard",
  description: `Find the length of the **longest consecutive run** of equal elements.

Given data = [1, 1, 1, 2, 2, 3, 3, 3, 3]:

| run | length |
|-----|--------|
| 1   | 3      |
| 2   | 2      |
| 3   | 4      |

Longest run = **4**.

Expected output:
\`\`\`
longest = 4
\`\`\`

Use a sequential \`foreach\` scan: track the current run length and update the maximum when the value changes.`,
  starterCode: `__co__ void array_longest_run() {
  global int data[9];

  parallel {i} by [1] {
    data[0] = 1; data[1] = 1; data[2] = 1; data[3] = 2; data[4] = 2;
    data[5] = 3; data[6] = 3; data[7] = 3; data[8] = 3;
  }

  int longest = 1;
  int current = 1;

  // TODO: foreach i in [1:9] {
  //   if (data[i] == data[i - 1]) { current = current + 1; }
  //   else { current = 1; }
  //   if (current > longest) { longest = current; }
  // }

  println("longest =", longest);
}
`,
  tests: [
    {
      expectedOutput: "longest = 4",
      description: "Longest run is four consecutive 3s",
    },
  ],
  hint: "Start longest=1, current=1. foreach i in [1:9]: if data[i]==data[i-1] extend current else reset to 1; update longest.",
};
