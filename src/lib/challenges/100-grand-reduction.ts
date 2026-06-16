import type { Challenge } from "./index";

export const challenge100: Challenge = {
  id: "c100",
  title: "Grand Reduction",
  difficulty: "hard",
  description: `Compute **sum**, **min**, **max**, and **count** over an 8-element array in a single kernel using multi-pass parallel-then-sequential reduction.

Given data = [5, 2, 8, 1, 9, 3, 4, 7]:

**Pass 1 (parallel):** Four threads each scan 2 elements and write partial sum, min, max, and count into shared arrays.

| chunk | elements | partial sum | min | max | count |
|-------|----------|-------------|-----|-----|-------|
| 0     | 5, 2     | 7           | 2   | 5   | 2     |
| 1     | 8, 1     | 9           | 1   | 8   | 2     |
| 2     | 9, 3     | 12          | 3   | 9   | 2     |
| 3     | 4, 7     | 11          | 4   | 7   | 2     |

**Pass 2 (foreach):** Sequentially merge the four partial results.

Expected output:
\`\`\`
sum = 39
min = 1
max = 9
count = 8
\`\`\``,
  starterCode: `__co__ void grand_reduction() {
  global int data[8];
  shared int partial_sum[4];
  shared int partial_min[4];
  shared int partial_max[4];
  shared int partial_count[4];

  parallel {i} by [8] {
    data[i] = 5;
    if (i == 1) { data[i] = 2; }
    if (i == 2) { data[i] = 8; }
    if (i == 3) { data[i] = 1; }
    if (i == 4) { data[i] = 9; }
    if (i == 5) { data[i] = 3; }
    if (i == 6) { data[i] = 4; }
    if (i == 7) { data[i] = 7; }
  }

  // TODO: pass 1 — parallel {chunk} by [4] scan two elements each
  // int base = chunk * 2;
  // partial_sum[chunk] = data[base] + data[base + 1];
  // partial_min[chunk] = min(data[base], data[base + 1]);
  // partial_max[chunk] = max(data[base], data[base + 1]);
  // partial_count[chunk] = 2;

  int total_sum = 0;
  int total_min = 0;
  int total_max = 0;
  int total_count = 0;

  // TODO: pass 2 — foreach merge partial arrays into totals
  // foreach chunk in [0:4] {
  //   total_sum = total_sum + partial_sum[chunk];
  //   if (chunk == 0 || partial_min[chunk] < total_min) { total_min = partial_min[chunk]; }
  //   if (chunk == 0 || partial_max[chunk] > total_max) { total_max = partial_max[chunk]; }
  //   total_count = total_count + partial_count[chunk];
  // }

  println("sum =", total_sum);
  println("min =", total_min);
  println("max =", total_max);
  println("count =", total_count);
}
`,
  tests: [
    { expectedOutput: "sum = 39", description: "Sum of all eight elements" },
    { expectedOutput: "min = 1", description: "Minimum element is 1" },
    { expectedOutput: "max = 9", description: "Maximum element is 9" },
    { expectedOutput: "count = 8", description: "Eight elements counted" },
    {
      expectedOutput: "sum = 39\nmin = 1\nmax = 9\ncount = 8",
      description: "Full grand reduction output",
    },
  ],
  hint: "Pass 1: parallel {chunk} by [4] with base = chunk * 2 — compute partial stats from data[base] and data[base+1]. Pass 2: foreach chunk in [0:4] merge sums, take global min/max, and add counts.",
};
