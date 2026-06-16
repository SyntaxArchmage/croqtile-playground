import type { Tutorial } from "./index";

export const ch12: Tutorial = {
  id: "ch12",
  title: "Array Slicing & DMA Patterns",
  description: "Master array slice notation and common DMA transfer patterns for efficient data movement.",
  steps: [
    {
      title: "Slice notation basics",
      content: `Array slices select a contiguous range of elements using the syntax \`array[start:end]\`, where the range is half-open (includes \`start\`, excludes \`end\`).

\`\`\`croqtile
global float data[8];
// data[0:4] → elements 0, 1, 2, 3  (4 elements)
// data[4:8] → elements 4, 5, 6, 7  (4 elements)
// data[2:5] → elements 2, 3, 4     (3 elements)
\`\`\`

Slices are primarily used with \`dma()\` to transfer blocks of data between global and shared memory. The source and destination slices must have the same length.`,
      code: `__co__ void slice_basics() {
  global float data[8];
  shared float tile[4];

  parallel {i} by [8] {
    data[i] = (float)((i + 1) * 10);
  }

  println("--- Full array ---");
  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }

  dma(data[0:4], tile[0:4]);
  println("--- First half in tile ---");
  parallel {i} by [4] {
    println("tile[", i, "] =", tile[i]);
  }

  dma(data[4:8], tile[0:4]);
  println("--- Second half in tile ---");
  parallel {i} by [4] {
    println("tile[", i, "] =", tile[i]);
  }
}
`
    },
    {
      title: "Computed slice offsets",
      content: `Slice bounds can be computed from variables, enabling loop-based tiling patterns:

\`\`\`croqtile
foreach t in [0:2] {
  dma(src[t*4 : t*4+4], tile[0:4]);
  // process tile...
}
\`\`\`

This is the fundamental pattern for processing large arrays in fixed-size tiles. Each iteration loads a different chunk of the source array into the same shared memory buffer.

Key rules:
- **Slice length must match**: \`src[0:4]\` to \`dst[0:4]\` (both length 4) ✓
- **Mismatched lengths fail**: \`src[0:4]\` to \`dst[0:3]\` ✗`,
      code: `__co__ void computed_slices() {
  global float data[12];
  shared float buf[4];

  parallel {i} by [12] {
    data[i] = (float)(i * i);
  }

  foreach t in [0:3] {
    dma(data[t*4 : t*4+4], buf[0:4]);

    float tile_sum = 0.0f;
    foreach i in [0:4] {
      tile_sum = tile_sum + buf[i];
    }
    println("tile", t, "sum =", tile_sum);
  }
}
`
    },
    {
      title: "Double buffering pattern",
      content: `An advanced DMA pattern is double buffering: while processing one tile, load the next tile into a second buffer. This overlaps computation with data movement.

In the mock interpreter, operations run sequentially, but the pattern is important for real GPU code:

1. Load tile 0 into buffer A
2. For each subsequent tile:
   - Process buffer A
   - Load next tile into buffer B
   - Swap A and B

The example below demonstrates the concept sequentially:`,
      code: `__co__ void double_buffer() {
  global float data[8];
  shared float bufA[4];
  shared float bufB[4];

  parallel {i} by [8] {
    data[i] = (float)((i + 1) * 5);
  }

  dma(data[0:4], bufA[0:4]);
  println("--- Processing tile 0 from bufA ---");
  parallel {i} by [4] {
    println("bufA[", i, "] =", bufA[i]);
  }

  dma(data[4:8], bufB[0:4]);
  println("--- Processing tile 1 from bufB ---");
  parallel {i} by [4] {
    println("bufB[", i, "] =", bufB[i]);
  }
}
`
    }
  ]
};
