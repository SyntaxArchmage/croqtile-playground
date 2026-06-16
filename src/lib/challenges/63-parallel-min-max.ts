import type { Challenge } from "./index";

export const challenge63: Challenge = {
  id: "c63",
  title: "Parallel Min-Max",
  difficulty: "medium",
  description: `Find both the **minimum** and **maximum** of an array in a single \`foreach\` scan.

Given data = [7, 2, 9, 1, 5, 3]:

Expected output:
\`\`\`
min = 1
max = 9
\`\`\`

Initialize both trackers from \`data[0]\`, then update them in one foreach loop over the remaining indices.`,
  starterCode: `__co__ void parallel_min_max() {
  global int data[6];

  parallel {i} by [1] {
    data[0] = 7; data[1] = 2; data[2] = 9;
    data[3] = 1; data[4] = 5; data[5] = 3;
  }

  // TODO: track min and max in a single foreach scan
  // int min_val = data[0];
  // int max_val = data[0];
  // foreach i in [1:6] {
  //   if (data[i] < min_val) { min_val = data[i]; }
  //   if (data[i] > max_val) { max_val = data[i]; }
  // }

  // println("min =", min_val);
  // println("max =", max_val);
}
`,
  tests: [
    { expectedOutput: "min = 1", description: "Minimum value is 1" },
    { expectedOutput: "max = 9", description: "Maximum value is 9" },
    { expectedOutput: "min = 1\nmax = 9", description: "Both min and max reported" },
  ],
  hint: "Start min_val and max_val from data[0]. In foreach i in [1:6], update min_val when data[i] is smaller and max_val when data[i] is larger.",
};
