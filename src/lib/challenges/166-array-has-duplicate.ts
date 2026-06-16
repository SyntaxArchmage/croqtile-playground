import type { Challenge } from "./index";

export const challenge166: Challenge = {
  id: "c166",
  title: "Array Has Duplicate",
  difficulty: "medium",
  description: `Check whether an array contains **any duplicate value** (not necessarily adjacent).

Given data = [1, 2, 3, 4, 2], the value **2** appears twice → **duplicate = 1**.

For each index \`i\`, scan all earlier indices \`j < i\`. If any \`data[j] == data[i]\`, a duplicate exists.

Expected output:
\`\`\`
duplicate = 1
\`\`\``,
  starterCode: `__co__ void array_has_duplicate() {
  global int data[5];
  int n = 5;
  int duplicate = 0;

  parallel {i} by [1] {
    data[0] = 1; data[1] = 2; data[2] = 3;
    data[3] = 4; data[4] = 2;
  }

  // TODO: foreach i in [1:n] {
  //   foreach j in [0:i] {
  //     if (data[j] == data[i]) { duplicate = 1; }
  //   }
  // }

  println("duplicate =", duplicate);
}
`,
  tests: [
    {
      expectedOutput: "duplicate = 1",
      description: "Value 2 appears at indices 1 and 4",
    },
  ],
  hint: "foreach i in [1:5]: foreach j in [0:i], if data[j] == data[i] set duplicate = 1.",
};
