import type { Tutorial } from "./index";

export const ch14: Tutorial = {
  id: "ch14",
  title: "Performance Optimization",
  description: "Write faster GPU kernels by reducing memory traffic and maximizing parallelism.",
  steps: [
    {
      title: "Minimizing Global Memory Access",
      content: `Global memory is the slowest tier on a GPU. Every \`global\` array read or write costs 100-400 cycles, while \`shared\` memory costs ~5 cycles.

The key optimization: load data from global once, process it in shared, then write results back.

**Anti-pattern — repeated global reads:**
\`\`\`
parallel {i} by [4] {
  result[i] = data[i] * 2 + data[i] + data[i] / 3;  // 3 global reads!
}
\`\`\`

**Optimized — load once into shared:**
\`\`\`
dma(data[0:4], buf[0:4]);  // 1 bulk read
parallel {i} by [4] {
  result[i] = buf[i] * 2 + buf[i] + buf[i] / 3;  // shared reads
}
\`\`\`

Try the example below — it loads data into shared memory first, then does all computation from the fast buffer.`,
      code: `__co__ void minimize_global() {
  global float data[8];
  shared float buf[8];
  global float result[8];

  // Initialize
  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  // Load once from global -> shared
  dma(data[0:8], buf[0:8]);

  // Compute entirely from shared memory
  parallel {i} by [8] {
    float val = buf[i];
    result[i] = val * val + val * 2.0f + 1.0f;
  }

  foreach i in [0:8] {
    println("result[" + i + "] =", result[i]);
  }
}
`,
    },
    {
      title: "Tiled Processing for Large Data",
      content: `When data is too large to fit in shared memory at once, process it in tiles. Each tile loads a chunk, processes it, and moves to the next.

The pattern:
1. Loop over tiles
2. DMA the current tile into shared
3. Process the tile in parallel
4. Repeat

This keeps global memory traffic minimal while processing arbitrarily large arrays.

Tiling also helps when you need to accumulate results — each tile computes a partial result, which you merge at the end.

Try the example — it sums a 16-element array using 4-element tiles:`,
      code: `__co__ void tiled_sum() {
  int N = 16;
  int TILE = 4;
  global int data[16];
  shared int tile[4];

  // Initialize: data = [1, 2, 3, ..., 16]
  parallel {i} by [16] {
    data[i] = i + 1;
  }

  int total = 0;

  // Process in tiles of 4
  foreach t in [0:4] {
    int offset = t * TILE;
    dma(data[offset : offset + TILE], tile[0:4]);

    foreach i in [0:4] {
      total = total + tile[i];
    }
  }

  println("sum =", total);
  println("expected = 136");
}
`,
    },
    {
      title: "Choosing the Right Parallelism",
      content: `Not every operation benefits from parallelism. The overhead of launching threads makes parallel blocks worthwhile only when:
- Each thread does meaningful work (not just a single add)
- There's enough data to keep all threads busy
- Threads don't need to communicate heavily

**Good use of parallel** — independent element-wise ops:
\`\`\`
parallel {i} by [N] {
  output[i] = input[i] * scale + bias;
}
\`\`\`

**Bad use of parallel** — sequential dependency:
\`\`\`
// DON'T: prefix sum needs previous results
parallel {i} by [N] {
  output[i] = output[i-1] + input[i];  // Race condition!
}
\`\`\`

For sequential dependencies, use \`foreach\` instead.

The example below demonstrates both: parallel for the independent scaling, sequential for the running sum.`,
      code: `__co__ void choose_parallelism() {
  int N = 8;
  global int data[8];
  global int scaled[8];

  // Initialize
  parallel {i} by [8] {
    data[i] = i + 1;
  }

  // Good: independent scaling — perfect for parallel
  parallel {i} by [8] {
    scaled[i] = data[i] * 3;
  }

  // Good: prefix sum — must be sequential
  int running = 0;
  foreach i in [0:8] {
    running = running + scaled[i];
    println("prefix[" + i + "] =", running);
  }
}
`,
    },
  ],
};
