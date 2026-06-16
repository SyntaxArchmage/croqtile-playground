import type { Tutorial } from "./index";

export const ch41: Tutorial = {
  id: "ch41",
  title: "GPU Architecture Basics",
  description: "Understanding GPU hardware concepts: threads, warps, and thread blocks; shared vs global memory; occupancy and resource management.",
  steps: [
    {
      title: "Threads, warps, and thread blocks",
      content: `GPUs expose parallelism at three levels:

- **Thread** — the smallest unit of execution; each gets a unique index from \`parallel {i} by [N]\`
- **Warp** — a group of 32 threads that execute in lockstep on real hardware (SIMT)
- **Thread block** — a cooperative group of threads that share \`shared\` memory and can synchronize

In Croqtile, \`parallel {i} by [N]\` models launching N threads. On hardware, those threads are grouped into warps of 32 and scheduled in blocks.

\`\`\`croqtile
parallel {i} by [8] {
  int warp_id = i / 32;   // conceptual: which warp owns this thread
  int lane = i % 32;      // position within the warp
}
\`\`\`

Try the example — each thread prints its index and which warp/lane it would map to.`,
      code: `__co__ void threads_warps_blocks() {
  int N = 8;

  parallel {i} by [8] {
    int warp_id = i / 32;
    int lane = i % 32;
    println("thread", i, "warp", warp_id, "lane", lane);
  }
}
`,
      hint: "With N=8, all threads sit in warp 0 with lanes 0..7.",
    },
    {
      title: "Shared memory vs global memory",
      content: `**Global memory** (\`global\`) is large (gigabytes) but high-latency. **Shared memory** (\`shared\`) is small (tens of KB per block) but on-chip and fast.

The standard pattern:
1. Load a tile from global → shared via \`dma()\`
2. Compute on shared data (many threads reuse the same tile)
3. Write results back to global

\`\`\`croqtile
dma(global_buf[0:T], shared_buf[0:T]);
parallel {i} by [T] {
  shared_buf[i] = shared_buf[i] * 2.0f;
}
\`\`\`

Without shared memory, every thread would re-read global memory — wasting bandwidth. Shared memory acts as a programmer-managed cache.

Try the example — compare reading from global vs shared after a DMA load.`,
      code: `__co__ void shared_vs_global() {
  global float input[8];
  shared float tile[8];
  global float from_global[8];
  global float from_shared[8];

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
  }

  dma(input[0:8], tile[0:8]);

  parallel {i} by [8] {
    from_global[i] = input[i] * 2.0f;
  }

  parallel {i} by [8] {
    from_shared[i] = tile[i] * 2.0f;
  }

  parallel {i} by [8] {
    println("global path:", from_global[i], "shared path:", from_shared[i]);
  }
}
`,
      hint: "Both paths double 1..8 → 2,4,...,16. Shared path avoids repeated global reads.",
    },
    {
      title: "Occupancy and resource management",
      content: `**Occupancy** measures how many warps are active on an SM (streaming multiprocessor). Higher occupancy helps hide memory latency — while some warps wait on memory, others compute.

Occupancy is limited by:
- **Thread count per block** — too few threads underutilize the SM
- **Shared memory usage** — large \`shared\` arrays reduce how many blocks fit
- **Register pressure** — many local variables per thread reduce concurrent warps

Rule of thumb: choose block sizes that are multiples of 32 (warp size). Balance tile size against shared memory budget.

\`\`\`croqtile
shared float tile[TILE];  // larger tile = more shared mem = lower occupancy
parallel {i} by [TILE] { ... }
\`\`\`

Try the example — process data in two blocks of 4, tracking per-block shared memory usage.`,
      code: `__co__ void occupancy_blocks() {
  global float input[8];
  global float output[8];
  int block_size = 4;
  int num_blocks = 2;

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
  }

  foreach b in [0:num_blocks] {
    shared float tile[4];
    int offset = b * block_size;

    dma(input[offset : offset + block_size], tile[0:block_size]);

    parallel {i} by [4] {
      tile[i] = tile[i] * (float)(b + 1);
    }

    parallel {i} by [4] {
      output[offset + i] = tile[i];
    }

    println("[block", b, "] processed", block_size, "elements");
  }

  parallel {i} by [8] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "Block 0 multiplies by 1 (unchanged). Block 1 multiplies by 2 → 10,12,14,16.",
    },
  ],
};
