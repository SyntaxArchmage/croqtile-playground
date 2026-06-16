import type { Challenge } from "./index";

export const challenge20: Challenge = {
  id: "c20",
  title: "Moving Average",
  difficulty: "hard",
  description: `Compute a 3-element moving average over an array of 6 values using shared memory.

Input: [10, 20, 30, 40, 50, 60]

For each index i (1 to 4), compute the average of data[i-1], data[i], data[i+1].
Boundary elements (index 0 and 5) keep their original value.

Expected output:
\`\`\`
avg[0] = 10
avg[1] = 20
avg[2] = 30
avg[3] = 40
avg[4] = 50
avg[5] = 60
\`\`\`

Wait — the averages: avg[1] = (10+20+30)/3 = 20, avg[2] = (20+30+40)/3 = 30, etc.
Each interior average equals the middle element for this arithmetic sequence!`,
  starterCode: `__co__ void moving_avg() {
  global float data[6];
  global float avg[6];
  shared float buf[6];

  // Initialize data = [10, 20, 30, 40, 50, 60]
  parallel {i} by [6] {
    data[i] = (float)((i + 1) * 10);
  }

  // DMA data to shared buf
  // TODO: add DMA here

  // Compute moving average with boundary handling
  // TODO: for boundaries, avg[i] = buf[i]
  // TODO: for interior, avg[i] = (buf[i-1] + buf[i] + buf[i+1]) / 3.0f

  // Print results
  parallel {i} by [6] {
    println("avg[", i, "] =", avg[i]);
  }
}
`,
  tests: [
    { expectedOutput: "avg[0] = 10", description: "Boundary: avg[0] keeps original value" },
    { expectedOutput: "avg[5] = 60", description: "Boundary: avg[5] keeps original value" },
    { expectedOutput: "avg[0] = 10\navg[1] = 20\navg[2] = 30\navg[3] = 40\navg[4] = 50\navg[5] = 60", description: "Full moving average output" },
  ],
  hint: "DMA data into shared buf. Then use parallel with an if/else: boundaries copy directly, interior elements average their 3 neighbors from buf.",
};
