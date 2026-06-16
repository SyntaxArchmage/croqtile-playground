import type { Challenge } from "./index";

export const challenge104: Challenge = {
  id: "c104",
  title: "Running Average",
  difficulty: "hard",
  description: `Compute the **running average** over a sliding window of size **3** using sequential \`foreach\`.

Given data = [6, 9, 12, 15, 18]:
- At index 0: average of available elements → 6
- At index 1: average of data[0..1] → (6+9)/2 = 7
- At index 2+: average of data[i-2], data[i-1], data[i]

Expected output:
\`\`\`
avg[0] = 6
avg[1] = 7
avg[2] = 9
avg[3] = 12
avg[4] = 15
\`\`\`

Use integer division. Loop sequentially with \`foreach i in [0:5]\` and branch on \`i\` to pick the window size.`,
  starterCode: `__co__ void running_average() {
  global int data[5];
  global int avg[5];

  parallel {i} by [1] {
    data[0] = 6; data[1] = 9; data[2] = 12; data[3] = 15; data[4] = 18;
  }

  // TODO: foreach i in [0:5] compute running average with window up to size 3
  // if (i == 0) { avg[i] = data[0]; }
  // else if (i == 1) { avg[i] = (data[0] + data[1]) / 2; }
  // else { avg[i] = (data[i - 2] + data[i - 1] + data[i]) / 3; }

  parallel {i} by [5] {
    println("avg[", i, "] =", avg[i]);
  }
}
`,
  tests: [
    { expectedOutput: "avg[0] = 6", description: "Index 0 uses single element" },
    { expectedOutput: "avg[1] = 7", description: "Index 1 averages two elements (6+9)/2" },
    { expectedOutput: "avg[2] = 9", description: "Index 2 uses full window (6+9+12)/3" },
    { expectedOutput: "avg[4] = 15", description: "Last index uses window (12+15+18)/3" },
    {
      expectedOutput: "avg[0] = 6\navg[1] = 7\navg[2] = 9\navg[3] = 12\navg[4] = 15",
      description: "Full running average output",
    },
  ],
  hint: "foreach i in [0:5]: if i==0 copy data[0]; else if i==1 use (data[0]+data[1])/2; else use (data[i-2]+data[i-1]+data[i])/3.",
};
