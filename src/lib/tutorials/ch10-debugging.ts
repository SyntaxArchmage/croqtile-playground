import type { Tutorial } from "./index";

export const ch10: Tutorial = {
  id: "ch10",
  title: "Debugging & Best Practices",
  description: "Learn common mistakes, debugging techniques, and GPU programming best practices.",
  steps: [
    {
      title: "Using println for debugging",
      content: `The simplest debugging tool is \`println()\`. When code doesn't produce expected output, add print statements to trace values at each step.

A common mistake: forgetting that \`parallel\` threads run concurrently. Output order depends on thread scheduling.

\`\`\`croqtile
__co__ void debug_order() {
  parallel {i} by [4] {
    println("thread", i, "running");
  }
  // Output order may vary!
}
\`\`\`

Best practice: when debugging parallel code, print both the thread index AND the computed value so you can sort the output mentally.`,
      code: `__co__ void debug_trace() {
  global float data[4];

  parallel {i} by [4] {
    data[i] = (float)(i * i);
    println("[debug] thread", i, "wrote", data[i]);
  }

  float sum = 0.0f;
  foreach i in [0:4] {
    sum = sum + data[i];
    println("[debug] running sum after index", i, "=", sum);
  }
  println("final sum =", sum);
}
`,
    },
    {
      title: "Common mistakes with DMA",
      content: `DMA transfers copy data between memory spaces. A frequent bug is mismatched slice sizes or accessing data before the DMA completes.

Rule of thumb:
- Source and destination slices must have the **same length**
- Always DMA before reading from the destination
- Print values before and after DMA to verify the transfer

\`\`\`croqtile
__co__ void dma_check() {
  global float src[4];
  shared float dst[4];
  parallel {i} by [4] { src[i] = (float)(i + 10); }
  println("before DMA: dst[0] might be uninitialized");
  dma(src[0:4], dst[0:4]);
  println("after DMA: dst[0] =", dst[0]);
}
\`\`\``,
      code: `__co__ void safe_dma() {
  global float source[8];
  shared float buffer[4];

  parallel {i} by [8] {
    source[i] = (float)((i + 1) * 10);
  }

  println("--- Before DMA ---");
  parallel {i} by [8] {
    println("source[", i, "] =", source[i]);
  }

  dma(source[0:4], buffer[0:4]);

  println("--- After DMA (first 4) ---");
  parallel {i} by [4] {
    println("buffer[", i, "] =", buffer[i]);
  }
}
`,
    },
    {
      title: "Performance thinking",
      content: `Even in the mock interpreter, it helps to think about performance patterns that matter on real GPUs:

1. **Minimize global memory access** — use \`shared\` memory as a fast cache
2. **Maximize parallelism** — use \`parallel\` for independent work
3. **Use tiling** — process data in chunks that fit in shared memory
4. **Avoid divergent branches** — threads in the same group should follow the same path when possible

Try this example that demonstrates tiled processing with shared memory:`,
      code: `__co__ void tiled_sum() {
  global float data[8];
  shared float tile[4];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;

  foreach t in [0:2] {
    dma(data[t*4 : t*4+4], tile[0:4]);

    float tile_sum = 0.0f;
    foreach i in [0:4] {
      tile_sum = tile_sum + tile[i];
    }
    println("tile", t, "sum =", tile_sum);
    total = total + tile_sum;
  }

  println("total =", total);
}
`,
    },
  ],
};
