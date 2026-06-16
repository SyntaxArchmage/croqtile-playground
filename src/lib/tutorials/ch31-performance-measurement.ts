import type { Tutorial } from "./index";

export const ch31: Tutorial = {
  id: "ch31",
  title: "Performance Measurement",
  description: "Measure and compare performance: println timing checkpoints, sequential vs parallel approaches, and memory access pattern impact.",
  steps: [
    {
      title: "Using println for timing checkpoints",
      content: `Before optimizing, you need **visibility**. In the playground, \`println()\` acts as a lightweight profiler — mark each phase so you can see where time is spent when running on real hardware.

**Checkpoint pattern:**
1. Print a label before a phase: \`println("[phase] init start");\`
2. Run the work
3. Print a label after: \`println("[phase] init done");\`

On a GPU, pair these with wall-clock timers; here, checkpoints confirm **ordering** and help you count how many passes your kernel makes.

\`\`\`croqtile
println("[checkpoint] before load");
// load data
println("[checkpoint] after load");
\`\`\`

Try the example — three labeled phases (init, compute, reduce) make the execution path easy to trace.`,
      code: `__co__ void timing_checkpoints() {
  global float data[8];
  global float scaled[8];
  global float total[1];

  println("[checkpoint] init start");
  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }
  println("[checkpoint] init done, elements =", 8);

  println("[checkpoint] compute start");
  parallel {i} by [8] {
    scaled[i] = data[i] * 2.0f;
  }
  println("[checkpoint] compute done");

  println("[checkpoint] reduce start");
  float sum = 0.0f;
  foreach i in [0:8] {
    sum = sum + scaled[i];
  }
  total[0] = sum;
  println("[checkpoint] reduce done, total =", total[0]);
}
`,
      hint: "Wrap each major phase with println labels. Run and read output top-to-bottom to see how many passes your kernel executes.",
    },
    {
      title: "Comparing sequential vs parallel approaches",
      content: `The same computation can run **sequentially** (\`foreach\`) or **in parallel** (\`parallel\`). Use checkpoints to compare both paths side by side.

**Sequential foreach** — one thread, predictable order, good for reductions:
\`\`\`croqtile
foreach i in [0:N] {
  output[i] = input[i] * 2.0f;
}
\`\`\`

**Parallel** — one thread per element, higher throughput on large arrays:
\`\`\`croqtile
parallel {i} by [N] {
  output[i] = input[i] * 2.0f;
}
\`\`\`

Print a checkpoint before and after each approach, then compare the results. They should match — if not, you have a race or ordering bug.

Try the example — it scales an array both ways and prints matching totals.`,
      code: `__co__ void seq_vs_parallel() {
  global float input[6];
  global float seq_out[6];
  global float par_out[6];
  global float seq_sum[1];
  global float par_sum[1];

  parallel {i} by [6] {
    input[i] = (float)(i + 1);
  }

  println("[seq] start");
  float s_total = 0.0f;
  foreach i in [0:6] {
    seq_out[i] = input[i] * 3.0f;
    s_total = s_total + seq_out[i];
  }
  seq_sum[0] = s_total;
  println("[seq] done, sum =", seq_sum[0]);

  println("[par] start");
  parallel {i} by [6] {
    par_out[i] = input[i] * 3.0f;
  }
  float p_total = 0.0f;
  foreach i in [0:6] {
    p_total = p_total + par_out[i];
  }
  par_sum[0] = p_total;
  println("[par] done, sum =", par_sum[0]);

  println("match =", seq_sum[0] == par_sum[0]);
}
`,
      hint: "Run foreach first with [seq] labels, then parallel with [par] labels. Final sums must agree.",
    },
    {
      title: "Memory access patterns and their impact",
      content: `**Access pattern** strongly affects bandwidth on real GPUs. Measure two variants of the same sum and compare checkpoint output.

**Coalesced — consecutive indices:**
\`\`\`croqtile
foreach i in [0:8] {
  sum = sum + data[i];  // reads 0, 1, 2, …
}
\`\`\`

**Strided — gaps between reads:**
\`\`\`croqtile
foreach i in [0:4] {
  sum = sum + data[i * 2];  // reads 0, 2, 4, 6
}
\`\`\`

Both compute valid sums, but coalesced access moves more bytes per transaction. Label each pass, print the result, and note which pattern your hot loop uses.

Try the example — sequential and strided sums over the same array, with checkpoints reporting each pass.`,
      code: `__co__ void access_pattern_compare() {
  global float data[8];
  global float coalesced_sum[1];
  global float strided_sum[1];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  println("[coalesced] scan start");
  float c_total = 0.0f;
  foreach i in [0:8] {
    c_total = c_total + data[i];
  }
  coalesced_sum[0] = c_total;
  println("[coalesced] done, sum =", coalesced_sum[0]);

  println("[strided] scan start");
  float s_total = 0.0f;
  foreach i in [0:4] {
    s_total = s_total + data[i * 2];
  }
  strided_sum[0] = s_total;
  println("[strided] done, sum =", strided_sum[0]);

  println("elements read: coalesced=8, strided=4");
}
`,
      hint: "Coalesced foreach walks every slot; strided skips odd indices. Compare sums and think about which pattern your kernel uses in its inner loop.",
    },
  ],
};
