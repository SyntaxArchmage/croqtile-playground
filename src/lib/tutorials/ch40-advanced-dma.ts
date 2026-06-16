import type { Tutorial } from "./index";

export const ch40: Tutorial = {
  id: "ch40",
  title: "Advanced DMA",
  description: "DMA deep dive: asynchronous DMA with wait, double-buffered DMA overlapping compute, and multi-dimensional DMA transfers.",
  steps: [
    {
      title: "Asynchronous DMA with wait",
      content: `Pair \`dma()\` with \`shared event\` to model **asynchronous** transfers. The producer issues a DMA and signals completion; the consumer waits before reading shared memory.

\`\`\`croqtile
shared event loaded;
dma(global_buf[0:N], shared_buf[0:N]);
signal loaded;
wait loaded;
// safe to read shared_buf
\`\`\`

On real hardware, compute can overlap with in-flight DMA. Events enforce the dependency: no read before the transfer completes.

Try the example — DMA into shared memory, signal, then wait before processing.`,
      code: `__co__ void async_dma_wait() {
  global float input[8];
  shared float buf[8];
  shared event loaded;

  parallel {i} by [8] {
    input[i] = (float)((i + 1) * 5);
  }

  dma(input[0:8], buf[0:8]);
  signal loaded;

  wait loaded;

  parallel {i} by [8] {
    buf[i] = buf[i] + 1.0f;
  }

  parallel {i} by [8] {
    println("buf[", i, "] =", buf[i]);
  }
}
`,
      hint: "After DMA, buf holds 5,10,...,40. Adding 1 gives 6,11,...,41.",
    },
    {
      title: "Double-buffered DMA overlapping compute",
      content: `**Double buffering** hides DMA latency: while one buffer is computed on, the next tile loads into the other buffer.

**Ping-pong loop:**
1. \`wait\` — buffer is free
2. \`dma\` — load next tile
3. \`parallel\` — compute on the loaded buffer
4. \`arrive\` — release buffer for the next load

Alternate between \`buf_a\` and \`buf_b\` with separate events. This is the same pattern as ch20 but applied as a tile loop over global data.

Try the example — process 8 elements in two tiles with ping-pong buffers.`,
      code: `__co__ void double_buffer_dma() {
  global float input[8];
  global float output[8];
  shared float buf_a[4];
  shared float buf_b[4];
  shared event a_free;
  shared event b_free;

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
  }

  arrive a_free;
  arrive b_free;

  foreach t in [0:2] {
    if (t % 2 == 0) {
      wait a_free;
      dma(input[t * 4 : t * 4 + 4], buf_a[0:4]);
      parallel {i} by [4] {
        buf_a[i] = buf_a[i] * 2.0f;
      }
      parallel {i} by [4] {
        output[t * 4 + i] = buf_a[i];
      }
      arrive a_free;
    } else {
      wait b_free;
      dma(input[t * 4 : t * 4 + 4], buf_b[0:4]);
      parallel {i} by [4] {
        buf_b[i] = buf_b[i] * 2.0f;
      }
      parallel {i} by [4] {
        output[t * 4 + i] = buf_b[i];
      }
      arrive b_free;
    }
  }

  parallel {i} by [8] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "Tile 0 doubles 1..4 → 2,4,6,8. Tile 1 doubles 5..8 → 10,12,14,16.",
    },
    {
      title: "Multi-dimensional DMA transfers",
      content: `Multi-dimensional arrays are stored **row-major** in memory. A contiguous row (or block of adjacent rows) can be transferred with a single \`dma\` on a **linearized** view.

For a \`rows × cols\` matrix stored flat, row \`r\` starts at offset \`r * cols\`:

\`\`\`croqtile
int offset = row * cols;
dma(flat[offset : offset + cols], tile[0:cols]);
\`\`\`

To transfer a **2-row tile**, extend the slice across both rows: \`flat[offset : offset + 2*cols]\`. This moves an entire sub-block in one DMA call.

Try the example — copy rows 1–2 of a 3×4 matrix into shared memory via one contiguous DMA.`,
      code: `__co__ void multidim_dma() {
  global float flat[12];
  shared float tile[8];
  int rows = 3;
  int cols = 4;

  parallel {i, j} by [3, 4] {
    flat[i * cols + j] = (float)(i * cols + j);
  }

  int row_start = 1;
  int offset = row_start * cols;
  int tile_rows = 2;
  int transfer_size = tile_rows * cols;

  dma(flat[offset : offset + transfer_size], tile[0:transfer_size]);

  parallel {ti, j} by [2, 4] {
    println("tile[", ti, ",", j, "] =", tile[ti * cols + j]);
  }
}
`,
      hint: "Rows 1–2 of a 3×4 matrix: row1 = [4,5,6,7], row2 = [8,9,10,11]. Linear indices 4..11.",
    },
  ],
};
