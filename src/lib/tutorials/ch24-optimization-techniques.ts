import type { Tutorial } from "./index";

export const ch24: Tutorial = {
  id: "ch24",
  title: "Optimization Techniques",
  description: "Performance patterns with foreach: coalesced vs strided access, manual loop unrolling, and minimizing synchronization overhead.",
  steps: [
    {
      title: "Memory coalescing (sequential vs strided access)",
      content: `GPUs achieve peak bandwidth when threads read **consecutive** addresses — this is **memory coalescing**. A \`foreach\` loop that walks \`data[i]\`, \`data[i+1]\`, … issues sequential reads. **Strided** access (\`data[i * 4]\`, column-major jumps) leaves bandwidth on the table.

**Coalesced — sequential foreach:**
\`\`\`croqtile
foreach i in [0:8] {
  sum = sum + data[i];  // addresses 0, 1, 2, …
}
\`\`\`

**Strided — gaps between addresses:**
\`\`\`croqtile
foreach i in [0:4] {
  sum = sum + data[i * 2];  // reads 0, 2, 4, 6 — skips every other slot
}
\`\`\`

Prefer contiguous \`foreach\` scans for reductions and prefix work. When you must use strided patterns (column sums, transpose), batch with \`dma()\` to load a contiguous block first.`,
      code: `__co__ void coalescing_demo() {
  global float data[8];
  global float seq_sum[1];
  global float strided_sum[1];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total_seq = 0.0f;
  foreach i in [0:8] {
    total_seq = total_seq + data[i];
  }
  seq_sum[0] = total_seq;

  float total_stride = 0.0f;
  foreach i in [0:4] {
    total_stride = total_stride + data[i * 2];
  }
  strided_sum[0] = total_stride;

  println("sequential sum =", seq_sum[0]);
  println("strided sum =", strided_sum[0]);
}
`,
      hint: "Sequential foreach over [0:N] hits consecutive addresses. Strided index i * k skips elements and reduces effective bandwidth.",
    },
    {
      title: "Loop unrolling with foreach",
      content: `**Loop unrolling** processes multiple elements per iteration, reducing loop-control overhead. In Croqtile, advance the foreach index by 2 or 4 and handle the tail separately.

**Unrolled by 2:**
\`\`\`croqtile
foreach block in [0:4] {
  int base = block * 2;
  sum = sum + data[base] + data[base + 1];
}
\`\`\`

When \`N\` is not divisible by the unroll factor, add a cleanup loop for the remaining elements. Unrolling pairs well with reductions — each iteration does more useful work before the next branch check.

Try the example: it sums eight elements with an unroll factor of 2, then prints the result.`,
      code: `__co__ void foreach_unroll() {
  global float data[8];
  global float result[1];

  parallel {i} by [8] {
    data[i] = (float)((i + 1) * 10);
  }

  float total = 0.0f;

  // Unroll by 2: each iteration processes a pair of elements
  foreach block in [0:4] {
    int base = block * 2;
    total = total + data[base] + data[base + 1];
  }

  result[0] = total;
  println("unrolled sum =", result[0]);
}
`,
      hint: "Step the foreach index by 2 (or 4) and combine multiple loads per iteration. Handle leftover elements with a second small foreach if N is not evenly divisible.",
    },
    {
      title: "Reducing synchronization overhead",
      content: `Every \`signal\`, \`wait\`, or extra \`pipeline\` stage adds latency. When work is small, **batch passes** into a single sequential \`foreach\` instead of splitting across synchronized stages.

**High overhead — separate synchronized stages per element:**
\`\`\`croqtile
// load stage → wait → compute stage → wait (repeated)
\`\`\`

**Lower overhead — one foreach does load-then-compute in order:**
\`\`\`croqtile
foreach i in [0:N] {
  output[i] = input[i] * 2.0f;
}
\`\`\`

Reserve events and pipeline barriers for true producer-consumer overlap (large DMA + compute). For compact sequential transforms, a single \`foreach\` avoids idle waits and keeps the pipeline full.

Try the example — one foreach pass scales and accumulates without intermediate synchronization.`,
      code: `__co__ void reduce_sync_overhead() {
  global float input[6];
  global float scaled[6];
  global float total[1];

  parallel {i} by [6] {
    input[i] = (float)(i + 1);
  }

  // Single foreach: scale and accumulate — no signal/wait between steps
  float sum = 0.0f;
  foreach i in [0:6] {
    scaled[i] = input[i] * 2.0f;
    sum = sum + scaled[i];
  }
  total[0] = sum;

  parallel {i} by [6] {
    println("scaled[", i, "] =", scaled[i]);
  }
  println("total =", total[0]);
}
`,
      hint: "Combine sequential passes that do not need parallel overlap. Fewer wait/signal pairs means less idle time between small foreach loops.",
    },
  ],
};
