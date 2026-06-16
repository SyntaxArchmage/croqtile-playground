import type { Challenge } from "./index";

export const challenge187: Challenge = {
  id: "c187",
  title: "Array Scan Min",
  difficulty: "medium",
  description: `Compute a **prefix minimum scan** over an array.

Given data = [3, 7, 2, 9, 1, 6, 4, 8], at each index i:

\`scan_min[i] = min(data[0], data[1], ..., data[i])\`

Expected output:
\`\`\`
scan_min[0] = 3
scan_min[1] = 3
scan_min[2] = 2
scan_min[3] = 2
scan_min[4] = 1
scan_min[5] = 1
scan_min[6] = 1
scan_min[7] = 1
\`\`\`

Use a \`foreach\` sequential loop to maintain a running minimum variable.`,
  starterCode: `__co__ void array_scan_min() {
  global int data[8];
  global int scan_min[8];

  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = 2; data[3] = 9;
    data[4] = 1; data[5] = 6; data[6] = 4; data[7] = 8;
  }

  // TODO: compute prefix minimum with foreach
  // int min_so_far = data[0];
  // foreach i in [0:8] {
  //   if (data[i] < min_so_far) { min_so_far = data[i]; }
  //   scan_min[i] = min_so_far;
  // }

  parallel {i} by [8] {
    println("scan_min[", i, "] =", scan_min[i]);
  }
}
`,
  tests: [
    { expectedOutput: "scan_min[0] = 3", description: "First element equals itself" },
    { expectedOutput: "scan_min[2] = 2", description: "Min drops to 2 at index 2" },
    { expectedOutput: "scan_min[4] = 1", description: "Min drops to 1 at index 4" },
    { expectedOutput: "scan_min[7] = 1", description: "Min stays 1 through end" },
    {
      expectedOutput: "scan_min[0] = 3\nscan_min[1] = 3\nscan_min[2] = 2\nscan_min[3] = 2\nscan_min[4] = 1\nscan_min[5] = 1\nscan_min[6] = 1\nscan_min[7] = 1",
      description: "Full prefix minimum scan output",
    },
  ],
  hint: "Use foreach to iterate through data sequentially. Track min_so_far; update when data[i] is smaller, then store in scan_min[i].",
};
