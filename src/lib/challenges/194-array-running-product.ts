import type { Challenge } from "./index";

export const challenge194: Challenge = {
  id: "c194",
  title: "Array Running Product",
  difficulty: "medium",
  description: `Compute the **running product of the last 2 elements** at each index.

Given data = [2, 3, 4, 5, 6]:

| i | product of last 2      |
|---|------------------------|
| 0 | 2 (only one element)   |
| 1 | 2 × 3 = 6              |
| 2 | 3 × 4 = 12             |
| 3 | 4 × 5 = 20             |
| 4 | 5 × 6 = 30             |

Expected output:
\`\`\`
run_prod[0] = 2
run_prod[1] = 6
run_prod[2] = 12
run_prod[3] = 20
run_prod[4] = 30
\`\`\`

Use \`foreach\`: at index 0 copy data[0]; for i ≥ 1 compute \`data[i-1] × data[i]\`.`,
  starterCode: `__co__ void array_running_product() {
  global int data[5];
  global int run_prod[5];

  parallel {i} by [1] {
    data[0] = 2; data[1] = 3; data[2] = 4; data[3] = 5; data[4] = 6;
  }

  // TODO: compute running product of last 2 with foreach
  // run_prod[0] = data[0];
  // foreach i in [1:5] {
  //   run_prod[i] = data[i - 1] * data[i];
  // }

  parallel {i} by [5] {
    println("run_prod[", i, "] =", run_prod[i]);
  }
}
`,
  tests: [
    { expectedOutput: "run_prod[0] = 2", description: "Index 0 equals data[0]" },
    { expectedOutput: "run_prod[1] = 6", description: "2 × 3 = 6" },
    { expectedOutput: "run_prod[4] = 30", description: "5 × 6 = 30" },
    {
      expectedOutput: "run_prod[0] = 2\nrun_prod[1] = 6\nrun_prod[2] = 12\nrun_prod[3] = 20\nrun_prod[4] = 30",
      description: "Full running product of last 2 output",
    },
  ],
  hint: "Set run_prod[0] = data[0]. Then foreach i in [1:5]: run_prod[i] = data[i-1] * data[i].",
};
