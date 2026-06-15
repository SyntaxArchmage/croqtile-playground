import type { Challenge } from "./index";

export const challenge16: Challenge = {
  id: "c16",
  title: "Parallel Classify",
  difficulty: "medium",
  description: `Given an array of 8 integers [3, 7, 1, 9, 4, 6, 2, 8], classify each value:
- Values < 4: print "low"
- Values >= 4 and < 7: print "mid"  
- Values >= 7: print "high"

Expected output:
\`\`\`
data[0] = 3 -> low
data[1] = 7 -> high
data[2] = 1 -> low
data[3] = 9 -> high
data[4] = 4 -> mid
data[5] = 6 -> mid
data[6] = 2 -> low
data[7] = 8 -> high
\`\`\``,
  starterCode: `__co__ void classify() {
  global int data[8];

  // Initialize: [3, 7, 1, 9, 4, 6, 2, 8]
  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = 1; data[3] = 9;
    data[4] = 4; data[5] = 6; data[6] = 2; data[7] = 8;
  }

  // TODO: classify each value and print the result
  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    {
      expectedOutput: "data[0] = 3 -> low\ndata[1] = 7 -> high\ndata[2] = 1 -> low\ndata[3] = 9 -> high\ndata[4] = 4 -> mid\ndata[5] = 6 -> mid\ndata[6] = 2 -> low\ndata[7] = 8 -> high",
      description: "Should classify all values correctly",
    },
  ],
  hint: "Use if/else if/else inside the parallel block. Compare data[i] against the threshold values 4 and 7.",
};
