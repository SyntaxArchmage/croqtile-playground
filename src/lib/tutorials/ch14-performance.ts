import type { Tutorial } from "./index";

export const ch14: Tutorial = {
  id: "ch14",
  title: "Performance Tips",
  description: "Write faster GPU kernels with coalesced memory access, conflict-free shared memory, and smart thread counts.",
  steps: [
    {
      title: "Memory Coalescing for Efficient Global Reads",
      content: `When threads in a warp read consecutive addresses from global memory, the hardware combines them into a single wide transaction — this is **memory coalescing**. Uncoalesced access (scattered indices, strided reads) wastes bandwidth.

**Coalesced — each thread reads a contiguous element:**
\`\`\`
parallel {i} by [8] {
  val = data[i];  // threads 0,1,2,... read addresses 0,1,2,...
}
\`\`\`

**Uncoalesced — strided or random access:**
\`\`\`
parallel {i} by [8] {
  val = data[i * 4];  // large gaps between addresses
}
\`\`\`

Best practice: structure your \`parallel\` loops so thread \`i\` accesses index \`i\` (or \`base + i\`), and use \`dma()\` for bulk contiguous transfers instead of many scattered global reads.

Try the example — it loads a contiguous block with one DMA, then each thread reads its own slot from shared memory.`,
      code: `__co__ void coalesced_reads() {
  global float data[8];
  shared float buf[8];
  global float result[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  // One coalesced bulk transfer
  dma(data[0:8], buf[0:8]);

  // Each thread reads its own contiguous slot
  parallel {i} by [8] {
    result[i] = buf[i] * 2.0f;
  }

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
    },
    {
      title: "Minimizing Shared Memory Bank Conflicts",
      content: `Shared memory is divided into **banks**. When multiple threads in the same warp access different addresses that map to the same bank, the hardware serializes those accesses — a **bank conflict**.

Common causes:
- Strided access patterns (e.g., every thread reads \`buf[i * 2]\`)
- Padding arrays so adjacent threads hit different banks

**Conflict-prone — stride-2 access:**
\`\`\`
parallel {i} by [8] {
  val = buf[i * 2];  // threads may collide on same banks
}
\`\`\`

**Conflict-free — consecutive access:**
\`\`\`
parallel {i} by [8] {
  val = buf[i];  // thread i -> bank i mod 32
}
\`\`\`

When you need strided patterns (matrix transpose, reductions), pad array dimensions or reorder data layout to keep threads on distinct banks.

Try the example — consecutive indexing avoids bank conflicts during the scale step.`,
      code: `__co__ void avoid_bank_conflicts() {
  global float data[8];
  shared float buf[8];
  global float scaled[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  dma(data[0:8], buf[0:8]);

  // Consecutive index i -> no bank conflicts
  parallel {i} by [8] {
    scaled[i] = buf[i] * 3.0f;
  }

  parallel {i} by [8] {
    println("scaled[", i, "] =", scaled[i]);
  }
}
`,
    },
    {
      title: "Optimizing Parallel Thread Count Choices",
      content: `The \`by [N]\` clause sets how many threads launch. Too few threads leave the GPU idle; too many threads doing trivial work add overhead without benefit.

Guidelines:
- Match thread count to data size: \`parallel {i} by [N]\` when you have \`N\` independent elements
- Use powers of 2 (4, 8, 16, 32) — they align well with warp sizes
- For small arrays, a single parallel block is fine; for large arrays, tile into chunks

**Good — one thread per element:**
\`\`\`
parallel {i} by [8] {
  output[i] = input[i] * 2;
}
\`\`\`

**Wasteful — more threads than work:**
\`\`\`
parallel {i} by [64] {
  if (i < 8) { output[i] = input[i] * 2; }
}
\`\`\`

Try the example — 8 threads for 8 elements, each doing meaningful work.`,
      code: `__co__ void thread_count() {
  int N = 8;
  global int data[8];
  global int output[8];

  parallel {i} by [8] {
    data[i] = i + 1;
  }

  // One thread per element — no idle threads
  parallel {i} by [N] {
    output[i] = data[i] * data[i];
  }

  parallel {i} by [N] {
    println("output[", i, "] =", output[i]);
  }
}
`,
    },
  ],
};
