import type { Tutorial } from "./index";

export const ch39: Tutorial = {
  id: "ch39",
  title: "Parallel Patterns: Scatter-Gather",
  description: "Scatter and gather patterns in Croqtile: writing to computed indices, reading from computed indices, and combining both for histogram construction.",
  steps: [
    {
      title: "Scatter — writing to computed indices",
      content: `**Scatter** writes each input value to a **computed destination index** rather than the source index. Thread \`i\` produces \`output[idx[i]] = value[i]\`.

\`\`\`croqtile
parallel {i} by [N] {
  int dst = perm[i];
  output[dst] = input[i];
}
\`\`\`

Scatter is the inverse of gather. Watch for **collisions** — two threads writing the same \`dst\` causes races. Only scatter when indices are known unique, or use sequential \`exec\` / \`foreach\` for conflicting writes.

Try the example — reverse permute values into output slots.`,
      code: `__co__ void scatter_write() {
  global int input[4];
  global int perm[4];
  global int output[4];

  parallel {i} by [4] {
    input[i] = (i + 1) * 10;
    perm[i] = 3 - i;
  }

  parallel {i} by [4] {
    output[i] = 0;
  }

  parallel {i} by [4] {
    int dst = perm[i];
    output[dst] = input[i];
  }

  parallel {i} by [4] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "perm = [3,2,1,0]. input[0]=10 goes to output[3], input[3]=40 goes to output[0]. Result: [40, 30, 20, 10].",
    },
    {
      title: "Gather — reading from computed indices",
      content: `**Gather** reads from computed source indices. Thread \`i\` loads \`output[i] = input[idx[i]]\`.

\`\`\`croqtile
parallel {i} by [N] {
  int src = index[i];
  output[i] = data[src];
}
\`\`\`

Gather is race-free when each thread writes its own \`output[i]\`. Use \`dma\` to load a contiguous block into shared memory first, then gather from the tile for better bandwidth.

Try the example — gather every other element from a source array.`,
      code: `__co__ void gather_read() {
  global float source[8];
  global int stride_idx[4];
  global float gathered[4];

  parallel {i} by [8] {
    source[i] = (float)(i * 10);
  }

  parallel {i} by [4] {
    stride_idx[i] = i * 2;
  }

  parallel {i} by [4] {
    int src = stride_idx[i];
    gathered[i] = source[src];
  }

  parallel {i} by [4] {
    println("gathered[", i, "] =", gathered[i]);
  }
}
`,
      hint: "stride_idx picks 0, 2, 4, 6. source values are 0, 20, 40, 60.",
    },
    {
      title: "Combining scatter/gather for histogram",
      content: `A **histogram** is scatter into bucket counters followed by reading the buckets (gather for reporting).

Because many elements may map to the same bucket, **parallel scatter into bins races**. Use sequential \`foreach\` for the scatter-accumulate step:

\`\`\`croqtile
foreach i in [0:N] {
  int bin = data[i];
  bins[bin] = bins[bin] + 1;
}
\`\`\`

Then gather (read) all bin counts in parallel for output. This scatter-then-gather pattern appears in sorting, database aggregation, and image analysis.

Try the example — count values 0..3 in twelve elements.`,
      code: `__co__ void histogram_scatter_gather() {
  global int data[12];
  global int bins[4];

  parallel {i} by [1] {
    data[0] = 0; data[1] = 1; data[2] = 2; data[3] = 3;
    data[4] = 1; data[5] = 2; data[6] = 0; data[7] = 3;
    data[8] = 2; data[9] = 1; data[10] = 0; data[11] = 2;
  }

  parallel {i} by [4] {
    bins[i] = 0;
  }

  foreach i in [0:12] {
    int bin = data[i];
    bins[bin] = bins[bin] + 1;
  }

  parallel {i} by [4] {
    println("bin[", i, "] =", bins[i]);
  }
}
`,
      hint: "Data is [0,1,2,3,1,2,0,3,2,1,0,2]. Counts: bin0=3, bin1=3, bin2=4, bin3=2.",
    },
  ],
};
