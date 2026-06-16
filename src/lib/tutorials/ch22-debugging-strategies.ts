import type { Tutorial } from "./index";

export const ch22: Tutorial = {
  id: "ch22",
  title: "Debugging Strategies",
  description: "Advanced debugging patterns for parallel GPU code: tagged println, DMA validation, and isolating races with sequential execution.",
  steps: [
    {
      title: "Using println with thread/block IDs for debugging",
      content: `When \`parallel\` output looks scrambled, tag every print with the **thread index** (\`i\`, \`j\`, etc.) so you can reconstruct execution order mentally.

For hierarchical reductions, also print the **block index** — each block handles a chunk of the array:

\`\`\`croqtile
parallel {block} by [4] {
  println("[block", block, "] starting");
  // ... work for this block ...
}
\`\`\`

Best practice: prefix debug lines with a consistent tag like \`[debug]\` and include both the thread/block ID and the value being inspected. This makes it easy to grep output and spot which thread wrote an unexpected value.`,
      code: `__co__ void debug_thread_block_ids() {
  global float data[8];
  global float partial[4];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  println("--- per-thread writes ---");
  parallel {i} by [8] {
    println("[thread", i, "] data[", i, "] =", data[i]);
  }

  println("--- per-block reduction ---");
  parallel {block} by [4] {
    float chunk = 0.0f;
    foreach i in [block * 2 : block * 2 + 2] {
      chunk = chunk + data[i];
    }
    partial[block] = chunk;
    println("[block", block, "] partial =", chunk);
  }

  parallel {i} by [4] {
    println("partial[", i, "] =", partial[i]);
  }
}
`,
      hint: "Print both the thread index and the value at each step. For block-level work, include the block variable so you can trace which chunk produced each partial result.",
    },
    {
      title: "Verifying DMA correctness with print validation",
      content: `DMA bugs are silent — the code runs but reads stale or garbage data. The fix is **print validation**: snapshot values before and after every transfer.

Checklist for each DMA:
1. Print source values **before** the transfer
2. Run \`dma(src[start:end], dst[start:end])\`
3. Print destination values **after** the transfer
4. Confirm lengths match (source slice length == destination slice length)

\`\`\`croqtile
println("before DMA: dst[0] =", dst[0]);
dma(src[0:4], dst[0:4]);
println("after DMA: dst[0] =", dst[0], "expected", src[0]);
\`\`\`

If after-DMA values don't match the source, check slice bounds, array sizes, and whether you read the destination before the transfer completed.`,
      code: `__co__ void dma_print_validation() {
  global float source[4];
  shared float buffer[4];

  parallel {i} by [4] {
    source[i] = (float)((i + 1) * 10);
  }

  println("=== BEFORE DMA ===");
  parallel {i} by [4] {
    println("source[", i, "] =", source[i]);
  }
  parallel {i} by [4] {
    println("buffer[", i, "] =", buffer[i], "(uninitialized)");
  }

  dma(source[0:4], buffer[0:4]);

  println("=== AFTER DMA ===");
  parallel {i} by [4] {
    println("buffer[", i, "] =", buffer[i]);
  }

  bool ok = true;
  parallel {i} by [4] {
    if (buffer[i] != source[i]) {
      ok = false;
    }
  }
  println("dma_valid =", ok);
}
`,
    },
    {
      title: "Isolating race conditions with sequential execution",
      content: `When parallel code produces wrong results, **isolate the bug** by replacing the suspicious region with sequential execution. If the answer becomes correct, you have a race condition.

Two isolation techniques:

1. **Replace \`parallel\` with \`foreach\`** — runs one iteration at a time, no concurrent writes
2. **Wrap logic in \`exec { }\`** inside a pipeline stage — forces sequential execution within that stage

\`\`\`croqtile
// Buggy: all threads race on total
parallel {i} by [8] { total = total + data[i]; }

// Isolated: sequential, always correct
exec {
  foreach i in [0:8] { total = total + data[i]; }
}
\`\`\`

Compare the buggy parallel sum against the sequential version. When they differ, the parallel path has a race. Fix it with per-thread partial arrays or sequential reduction.`,
      code: `__co__ void isolate_race_sequential() {
  global int data[8];

  parallel {i} by [8] {
    data[i] = i + 1;
  }

  // Buggy parallel reduction — races on shared accumulator
  int buggy_total = 0;
  parallel {i} by [8] {
    buggy_total = buggy_total + data[i];
  }
  println("buggy parallel total =", buggy_total);

  // Isolated sequential version — ground truth
  int safe_total = 0;
  exec {
    foreach i in [0:8] {
      safe_total = safe_total + data[i];
    }
  }
  println("sequential total =", safe_total);

  // Per-thread partial sums — parallel-safe alternative
  global int partial[8];
  parallel {i} by [8] {
    partial[i] = data[i];
  }
  int reduced = 0;
  exec {
    foreach i in [0:8] {
      reduced = reduced + partial[i];
    }
  }
  println("partial-then-reduce total =", reduced);
}
`,
    },
  ],
};
