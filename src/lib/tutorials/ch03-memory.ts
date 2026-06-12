import type { Tutorial } from "./index";

export const ch03: Tutorial = {
  id: "ch03",
  title: "Memory Hierarchy",
  description: "Understand global, shared, and local memory in Croqtile.",
  steps: [
    {
      title: "Global memory",
      content: `\`global\` memory is the main device memory — large but slow. All threads can access it.

Declare arrays with the \`global\` keyword:`,
      code: `__co__ void global_mem() {
  global float A[8];

  parallel {i} by [8] {
    A[i] = (float)i * 2.0f;
  }

  parallel {i} by [8] {
    println("A[", i, "] =", A[i]);
  }
}
`,
    },
    {
      title: "Shared memory",
      content: `\`shared\` memory is fast, on-chip memory shared by threads within a block. It's much faster than global memory but limited in size.

Use \`dma()\` to copy data from global to shared memory:`,
      code: `__co__ void shared_mem() {
  global float G[8];
  shared float S[8];

  parallel {i} by [8] {
    G[i] = (float)(i + 1);
  }

  // DMA: copy from global to shared
  dma(G[0:8], S[0:8]);

  parallel {i} by [8] {
    println("S[", i, "] =", S[i]);
  }
}
`,
    },
    {
      title: "DMA transfers",
      content: `\`dma(src, dst)\` copies a chunk of data between memory levels.

The syntax \`A[start:end]\` selects a slice. DMA is how you efficiently move data between global and shared memory on a GPU.

In real hardware, DMA uses dedicated copy engines that work asynchronously. The mock interpreter simulates this synchronously.`,
      code: `__co__ void dma_demo() {
  global float input[16];
  shared float tile[4];

  parallel {i} by [16] {
    input[i] = (float)i;
  }

  // Load a tile from global into shared
  dma(input[4:8], tile[0:4]);

  parallel {i} by [4] {
    // tile now contains input[4], input[5], input[6], input[7]
    println("tile[", i, "] =", tile[i]);
  }
}
`,
    },
  ],
};
