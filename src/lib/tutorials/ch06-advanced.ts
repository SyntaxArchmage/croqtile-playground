import type { Tutorial } from "./index";

export const ch06: Tutorial = {
  id: "ch06",
  title: "Advanced Patterns",
  description: "Combine primitives for real GPU computing patterns.",
  steps: [
    {
      title: "Tiled computation",
      content: `Real GPU programs process data in tiles — small chunks that fit in fast shared memory.

The pattern is:
1. DMA a tile from global to shared memory
2. Compute on the tile (fast!)
3. Write results back to global memory

This is the foundation of efficient GPU programming.`,
      code: `__co__ void tiled_scale() {
  global float data[16];
  shared float tile[4];

  parallel {i} by [16] {
    data[i] = (float)(i + 1);
  }

  // Process in tiles of 4
  foreach t in [0:4] {
    dma(data[t*4 : t*4+4], tile[0:4]);

    parallel {i} by [4] {
      tile[i] = tile[i] * 2.0f;
    }

    parallel {i} by [4] {
      data[t*4 + i] = tile[i];
    }
  }

  println("data[0] =", data[0]);
  println("data[7] =", data[7]);
  println("data[15] =", data[15]);
}
`,
    },
    {
      title: "Reduction tree",
      content: `Efficient reductions use a tree pattern — halving the number of active elements at each step.

This is more work-efficient than a simple sequential loop when the data is large, because each level can be parallelized.`,
      code: `__co__ void tree_reduce() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  println("Before reduction:");
  parallel {i} by [8] {
    println("  data[", i, "] =", data[i]);
  }

  // Tree reduction: sum pairs
  foreach level in [0:3] {
    int stride = 1;
    foreach s in [0:level] {
      stride = stride * 2;
    }
    parallel {i} by [4] {
      if (i * stride * 2 + stride < 8) {
        data[i * stride * 2] = data[i * stride * 2] + data[i * stride * 2 + stride];
      }
    }
  }

  println("Sum =", data[0]);
}
`,
    },
    {
      title: "Putting it all together",
      content: `Let's combine everything: arrays, parallel execution, DMA, shared memory, and foreach loops.

This example computes the average of an array using tiled loading and reduction.`,
      code: `__co__ void average() {
  global float values[8];
  shared float buf[4];

  // Initialize
  parallel {i} by [8] {
    values[i] = (float)(i * 2 + 1);
  }

  // Sum all values
  float total = 0.0f;
  foreach i in [0:8] {
    total = total + values[i];
  }

  float avg = total / 8.0f;
  println("values: 1 3 5 7 9 11 13 15");
  println("sum =", total);
  println("avg =", avg);
}
`,
    },
  ],
};
