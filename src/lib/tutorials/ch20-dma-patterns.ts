import type { Tutorial } from "./index";

export const ch20: Tutorial = {
  id: "ch20",
  title: "DMA Patterns & Double Buffering",
  description: "Advanced DMA patterns for high-throughput kernels: explicit slice sizing, ping-pong buffers, and overlapping compute with transfer.",
  steps: [
    {
      title: "Basic DMA with size specification",
      content: `Every \`dma()\` call moves a **contiguous slice** from source to destination. The slice syntax \`A[start:end]\` selects elements from index \`start\` up to (but not including) \`end\`, so the transfer size is \`end - start\`.

**Rules:**
- Source and destination slices must have the **same length**
- Both slices must fit within their declared array bounds
- Use explicit offsets to load tiles, halos, or row segments

For a buffer of 16 elements, \`dma(data[0:8], tile[0:8])\` moves 8 floats. A smaller tile uses \`dma(data[4:8], tile[0:4])\` — 4 elements starting at offset 4.

Explicit sizing is essential when your working set exceeds shared memory: you DMA only what you need for the current tile.`,
      code: `__co__ void dma_sized() {
  global float data[16];
  shared float tile_a[4];
  shared float tile_b[8];

  parallel {i} by [16] {
    data[i] = (float)(i * 10);
  }

  // Transfer 4 elements starting at offset 4
  dma(data[4:8], tile_a[0:4]);

  // Transfer 8 elements from the start
  dma(data[0:8], tile_b[0:8]);

  parallel {i} by [4] {
    println("tile_a[", i, "] =", tile_a[i]);
  }

  parallel {i} by [8] {
    println("tile_b[", i, "] =", tile_b[i]);
  }
}
`,
      hint: "The slice length is end minus start — dma(data[4:8], tile[0:4]) moves exactly 4 elements.",
    },
    {
      title: "Double buffering with ping-pong",
      content: `When processing data in tiles, a single shared buffer forces you to wait: load → compute → store → load again. **Double buffering** uses two shared buffers (\`ping\` and \`pong\`) so one can be loaded while the other is computed on.

**Ping-pong pattern:**
1. DMA tile N into \`ping\`
2. While computing on \`ping\`, DMA tile N+1 into \`pong\`
3. Swap roles for the next iteration

Pair buffers with \`shared event\` handoffs (\`arrive\` / \`wait\`) so the producer never overwrites data the consumer is still reading.

This is the standard technique in GEMM, convolution, and any kernel that streams through global memory in chunks.`,
      code: `__co__ void ping_pong() {
  global float src[8];
  global float dst[8];
  shared float ping[4];
  shared float pong[4];
  shared event ping_ready;
  shared event pong_ready;

  parallel {i} by [8] {
    src[i] = (float)(i + 1);
  }

  arrive ping_ready;
  arrive pong_ready;

  // Tile 0 → ping
  wait ping_ready;
  dma(src[0:4], ping[0:4]);
  parallel {i} by [4] {
    ping[i] = ping[i] * 2.0f;
  }
  arrive pong_ready;

  // Tile 1 → pong (ping still holds tile 0 result)
  wait pong_ready;
  dma(src[4:8], pong[0:4]);
  parallel {i} by [4] {
    pong[i] = pong[i] * 2.0f;
  }
  arrive ping_ready;

  // Store both tiles
  wait ping_ready;
  parallel {i} by [4] {
    dst[i] = ping[i];
  }

  wait pong_ready;
  parallel {i} by [4] {
    dst[4 + i] = pong[i];
  }

  parallel {i} by [8] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
    },
    {
      title: "Overlapped compute and transfer",
      content: `The ultimate DMA optimization: **overlap** memory transfer with computation. While the compute unit processes buffer A, the DMA engine prefetches the next tile into buffer B.

Use a three-phase loop per tile:
1. \`wait\` — previous compute on this buffer finished
2. \`dma\` — load next tile (runs concurrently with compute on the other buffer)
3. \`parallel\` — compute on the loaded tile
4. \`arrive\` — signal compute done, release buffer for next load

On real hardware, DMA and compute units are separate pipelines. Croqtile's mock interpreter runs them sequentially, but the event structure mirrors production kernels where overlap hides memory latency.

Try the example — it processes 8 elements in two tiles, overlapping load and compute via ping-pong events.`,
      code: `__co__ void overlap_compute() {
  global float input[8];
  global float output[8];
  shared float buf_a[4];
  shared float buf_b[4];
  shared event a_free;
  shared event b_free;

  parallel {i} by [8] {
    input[i] = (float)((i + 1) * 10);
  }

  arrive a_free;
  arrive b_free;

  foreach t in [0:2] {
    if (t % 2 == 0) {
      wait a_free;
      dma(input[t*4 : t*4+4], buf_a[0:4]);
      parallel {i} by [4] {
        buf_a[i] = buf_a[i] + 1.0f;
      }
      parallel {i} by [4] {
        output[t*4 + i] = buf_a[i];
      }
      arrive a_free;
    } else {
      wait b_free;
      dma(input[t*4 : t*4+4], buf_b[0:4]);
      parallel {i} by [4] {
        buf_b[i] = buf_b[i] + 1.0f;
      }
      parallel {i} by [4] {
        output[t*4 + i] = buf_b[i];
      }
      arrive b_free;
    }
  }

  parallel {i} by [8] {
    println("output[", i, "] =", output[i]);
  }
}
`,
    },
  ],
};
