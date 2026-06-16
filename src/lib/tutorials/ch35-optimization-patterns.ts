import type { Tutorial } from "./index";

export const ch35: Tutorial = {
  id: "ch35",
  title: "Optimization Patterns",
  description: "Common Croqtile optimization techniques: loop unrolling with stride patterns, memory coalescing for bandwidth, and tiling for cache efficiency.",
  steps: [
    {
      title: "Loop unrolling and stride patterns",
      content: `**Loop unrolling** reduces per-iteration overhead by processing multiple elements per \`foreach\` step. Advance the index by the unroll factor (stride) and handle the tail separately.

**Unroll by 4 with stride:**
\`\`\`croqtile
foreach block in [0:N/4] {
  int base = block * 4;
  sum = sum + data[base] + data[base+1]
            + data[base+2] + data[base+3];
}
\`\`\`

**Stride patterns** appear when accessing every k-th element (\`data[i * k]\`). Unrolling works well with unit stride; strided access needs a cleanup loop for leftover elements when \`N\` is not divisible by the unroll factor.

Try the example — sum sixteen elements with an unroll factor of 4, then print the result.`,
      code: `__co__ void unroll_stride() {
  global float data[16];
  global float result[1];
  int N = 16;
  int unroll = 4;

  parallel {i} by [16] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;
  int blocks = N / unroll;
  foreach block in [0:blocks] {
    int base = block * unroll;
    total = total + data[base];
    total = total + data[base + 1];
    total = total + data[base + 2];
    total = total + data[base + 3];
  }

  int remainder = N - blocks * unroll;
  foreach k in [0:remainder] {
    int idx = blocks * unroll + k;
    total = total + data[idx];
  }

  result[0] = total;
  println("unrolled sum =", result[0]);
}
`,
      hint: "Sum of 1..16 is 136. Four blocks of four elements plus no remainder when N=16 and unroll=4.",
    },
    {
      title: "Memory coalescing for better bandwidth",
      content: `GPUs achieve peak bandwidth when threads read **consecutive addresses** — this is **memory coalescing**. Structure \`parallel\` loops so thread \`i\` accesses index \`i\`, not \`i * stride\`.

**Coalesced — thread i reads data[i]:**
\`\`\`croqtile
parallel {i} by [N] {
  out[i] = in[i] * 2.0f;
}
\`\`\`

**Uncoalesced — strided reads waste bandwidth:**
\`\`\`croqtile
parallel {i} by [N/2] {
  out[i] = in[i * 2];  // gaps between addresses
}
\`\`\`

When you need strided access, **DMA a contiguous block** into shared memory first, then let each thread read its own slot from the tile.

Try the example — compare coalesced vs strided reads and print both sums.`,
      code: `__co__ void coalescing_bandwidth() {
  global float data[8];
  global float coalesced[8];
  global float strided[4];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  parallel {i} by [8] {
    coalesced[i] = data[i] * 2.0f;
  }

  parallel {i} by [4] {
    strided[i] = data[i * 2] * 2.0f;
  }

  float sum_co = 0.0f;
  foreach i in [0:8] {
    sum_co = sum_co + coalesced[i];
  }

  float sum_str = 0.0f;
  foreach i in [0:4] {
    sum_str = sum_str + strided[i];
  }

  println("coalesced sum =", sum_co);
  println("strided sum =", sum_str);
}
`,
      hint: "Coalesced path reads all 8 elements (2,4,6,...,16). Strided path reads indices 0,2,4,6 only (2,6,10,14).",
    },
    {
      title: "Tiling strategies for cache efficiency",
      content: `**Tiling** breaks a large problem into small blocks that fit in fast shared memory. Each tile is loaded with \`dma()\`, processed locally, then written back — reducing repeated global-memory traffic.

**Tiled matrix-vector pattern:**
1. \`dma\` a segment of \`v\` into a shared tile buffer
2. Each row thread accumulates \`M[row, j] * tile_v[j]\` for columns in the current tile
3. Repeat for the next tile along the column dimension

\`\`\`croqtile
dma(v[tile_start : tile_start + tile], tile_v[0 : tile]);
foreach j in [0:tile] {
  acc = acc + M[row, tile_start + j] * tile_v[j];
}
\`\`\`

Tiling trades extra DMA setup for fewer global reads — essential when each element is reused across multiple computations.

Try the example — multiply a 4×4 matrix by a 4-vector using 2×2 tiles.`,
      code: `__co__ void tiling_cache() {
  global float M[4, 4];
  global float v[4];
  global float result[4];
  shared float tile_v[2];
  int cols = 4;
  int tile = 2;

  parallel {i, j} by [4, 4] {
    M[i, j] = (float)(i * cols + j + 1);
  }

  parallel {i} by [4] {
    v[i] = (float)(i + 1);
  }

  parallel {row} by [4] {
    float acc = 0.0f;
    foreach tile_start in [0:cols] {
      if (tile_start + tile <= cols) {
        dma(v[tile_start : tile_start + tile], tile_v[0 : tile]);
        foreach j in [0:tile] {
          acc = acc + M[row, tile_start + j] * tile_v[j];
        }
      }
    }
    result[row] = acc;
  }

  parallel {i} by [4] {
    println("result[", i, "] =", result[i]);
  }
}
`,
      hint: "Each row dot-products M[row,:] with v in two tiles of size 2. Row 0: (1*1 + 2*2) + (3*3 + 4*4) = 30.",
    },
  ],
};
