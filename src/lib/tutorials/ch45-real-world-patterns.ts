import type { Tutorial } from "./index";

export const ch45: Tutorial = {
  id: "ch45",
  title: "Real-World Patterns",
  description: "Practical GPU programming: histogram computation, matrix transposition optimization, and prefix sum (scan) applications.",
  steps: [
    {
      title: "Histogram computation",
      content: `A **histogram** counts how many elements fall into each bin. GPU histograms use parallel increments — in Croqtile, model this with \`parallel\` initialization and a sequential \`foreach\` accumulation (real GPUs use atomic operations):

\`\`\`croqtile
parallel {i} by [N] {
  int bin = (int)data[i] % num_bins;
  // atomic: bins[bin]++
}
\`\`\`

Pattern:
1. \`parallel\` — initialize or zero bins
2. \`foreach\` — accumulate counts (correct sequential model)
3. \`parallel\` — print or normalize results

Try the example — histogram 8 values into 4 bins.`,
      code: `__co__ void histogram() {
  global float data[8];
  global int bins[4];
  int N = 8;
  int num_bins = 4;

  parallel {i} by [4] {
    bins[i] = 0;
  }

  parallel {i} by [8] {
    data[i] = (float)((i * 3 + 1) % 10);
  }

  foreach i in [0:N] {
    int bin = (int)data[i] % num_bins;
    bins[bin] = bins[bin] + 1;
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }

  parallel {b} by [4] {
    println("bin[", b, "] count =", bins[b]);
  }
}
`,
      hint: "Values 1,4,7,0,3,6,9,2. Mod 4 → bins [2,2,2,2] (one count per bin).",
    },
    {
      title: "Matrix transposition optimization",
      content: `Transposing a matrix swaps rows and columns: \`out[j, i] = in[i, j]\`. Naive transposition causes **uncoalesced** global writes. The optimized pattern:

1. Load a **tile** into \`shared\` memory with coalesced reads
2. Transpose within shared memory (fast, on-chip)
3. Write the tile back with coalesced stores

\`\`\`croqtile
dma(in[row*cols : row*cols+tile], shared_tile[0:tile]);
parallel {ti, tj} by [T, T] {
  out[tj, ti] = shared_tile[ti, tj];
}
\`\`\`

Try the example — transpose a 3×4 matrix using shared memory staging.`,
      code: `__co__ void transpose_optimized() {
  global float input[3, 4];
  global float output[4, 3];
  shared float tile[3, 4];
  int rows = 3;
  int cols = 4;

  parallel {r, c} by [3, 4] {
    input[r, c] = (float)(r * cols + c);
  }

  dma(input[0:12], tile[0:12]);

  parallel {r, c} by [3, 4] {
    output[c, r] = tile[r, c];
  }

  parallel {r, c} by [4, 3] {
    println("output[", r, ",", c, "] =", output[r, c]);
  }
}
`,
      hint: "3×4 input row-major → 4×3 output. output[0,0]=0, output[1,0]=4, output[2,0]=8.",
    },
    {
      title: "Prefix sum (scan) applications",
      content: `A **prefix sum** (scan) produces running totals: \`out[i] = sum(input[0..i])\`. It appears in stream compaction, sorting ranks, and parallel allocation.

Sequential scan in Croqtile:
\`\`\`croqtile
float running = 0.0f;
foreach i in [0:N] {
  running = running + input[i];
  output[i] = running;
}
\`\`\`

Real GPUs use parallel scan (Blelloch algorithm) in O(log n) steps. The sequential \`foreach\` is always correct for verification.

**Application:** given scan results as offsets, scatter elements into a compacted array.

Try the example — inclusive prefix sum, then use it to compute cumulative distribution.`,
      code: `__co__ void prefix_sum_scan() {
  global float input[8];
  global float scan[8];
  int N = 8;

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
  }

  float running = 0.0f;
  foreach i in [0:N] {
    running = running + input[i];
    scan[i] = running;
  }

  parallel {i} by [8] {
    println("input[", i, "] =", input[i], "scan[", i, "] =", scan[i]);
  }

  float total = scan[N - 1];
  println("total =", total);
}
`,
      hint: "Input 1..8. Inclusive scan: 1,3,6,10,15,21,28,36. Total = 36.",
    },
  ],
};
