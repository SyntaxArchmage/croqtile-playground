import type { Challenge } from "./index";

export const challenge111: Challenge = {
  id: "c111",
  title: "Array Histogram",
  difficulty: "medium",
  description: `Count the frequency of digit values **0–9** in an array using a sequential \`foreach\` loop.

Given data = [1, 5, 3, 1, 9, 0, 5, 2, 1, 5], increment \`bins[v]\` for each value \`v\`.

Expected output:
\`\`\`
bin[0] = 1
bin[1] = 3
bin[2] = 1
bin[3] = 1
bin[4] = 0
bin[5] = 3
bin[6] = 0
bin[7] = 0
bin[8] = 0
bin[9] = 1
\`\`\`

Use \`foreach\` to scan the array — parallel writes to shared bins would race.`,
  starterCode: `__co__ void array_histogram() {
  global int data[10];
  global int bins[10];

  parallel {i} by [1] {
    data[0] = 1; data[1] = 5; data[2] = 3; data[3] = 1; data[4] = 9;
    data[5] = 0; data[6] = 5; data[7] = 2; data[8] = 1; data[9] = 5;
  }

  parallel {i} by [10] {
    bins[i] = 0;
  }

  // TODO: foreach i in [0:10] { bins[data[i]] = bins[data[i]] + 1; }

  parallel {i} by [10] {
    println("bin[", i, "] =", bins[i]);
  }
}
`,
  tests: [
    { expectedOutput: "bin[0] = 1", description: "One zero in the array" },
    { expectedOutput: "bin[1] = 3", description: "Three ones in the array" },
    { expectedOutput: "bin[5] = 3", description: "Three fives in the array" },
    { expectedOutput: "bin[9] = 1", description: "One nine in the array" },
    {
      expectedOutput: "bin[0] = 1\nbin[1] = 3\nbin[2] = 1\nbin[3] = 1\nbin[4] = 0\nbin[5] = 3\nbin[6] = 0\nbin[7] = 0\nbin[8] = 0\nbin[9] = 1",
      description: "Full histogram for digits 0–9",
    },
  ],
  hint: "Initialize bins to 0, then foreach i in [0:10]: increment bins[data[i]]. Print all 10 bins in parallel.",
};
