export interface Example {
  id: string;
  name: string;
  code: string;
}

export const EXAMPLES: Example[] = [
  {
    id: "hello",
    name: "Hello World",
    code: `__co__ void hello() {
  println("Hello from Croqtile!");
}
`,
  },
  {
    id: "parallel",
    name: "Parallel Loop",
    code: `__co__ void parallel_demo() {
  parallel {i} by [4] {
    println("thread", i);
  }
}
`,
  },
  {
    id: "dma",
    name: "DMA Transfer",
    code: `__co__ void dma_demo() {
  global float A[16];
  shared float B[16];

  parallel {i} by [16] {
    A[i] = (float)i;
  }

  dma(A[0:16], B[0:16]);

  parallel {i} by [16] {
    println("B[", i, "] =", B[i]);
  }
}
`,
  },
  {
    id: "matmul",
    name: "Matrix Multiply",
    code: `__co__ void matmul() {
  global float A[4, 4];
  global float B[4, 4];
  global float C[4, 4];

  // Initialize
  parallel {i, j} by [4, 4] {
    A[i, j] = (float)(i + j);
    B[i, j] = (float)(i * j);
    C[i, j] = 0.0f;
  }

  // Compute C = A * B
  parallel {i, j} by [4, 4] {
    float sum = 0.0f;
    foreach k in [0:4] {
      sum = sum + A[i, k] * B[k, j];
    }
    C[i, j] = sum;
  }

  println("C[0,0] =", C[0, 0]);
  println("C[1,1] =", C[1, 1]);
}
`,
  },
  {
    id: "shared-mem",
    name: "Shared Memory",
    code: `__co__ void shared_demo() {
  global float src[8];
  shared float tile[4];

  parallel {i} by [8] {
    src[i] = (float)(i * 10);
  }

  // DMA first 4 elements to shared tile
  dma(src[0:4], tile[0:4]);

  parallel {i} by [4] {
    println("tile[", i, "] =", tile[i]);
  }
}
`,
  },
  {
    id: "reduction",
    name: "Sum Reduction",
    code: `__co__ void sum_reduction() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;
  foreach i in [0:8] {
    total = total + data[i];
  }

  println("sum =", total);
}
`,
  },
  {
    id: "tiled",
    name: "Tiled Processing",
    code: `__co__ void tiled_process() {
  global float data[8];
  shared float tile[4];

  parallel {i} by [8] {
    data[i] = (float)(i * 10);
  }

  // Process in tiles of 4
  foreach t in [0:2] {
    dma(data[t*4 : t*4+4], tile[0:4]);

    parallel {i} by [4] {
      tile[i] = tile[i] + 1.0f;
    }

    parallel {i} by [4] {
      data[t*4 + i] = tile[i];
    }
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  },
  {
    id: "2d-parallel",
    name: "2D Parallel Grid",
    code: `__co__ void grid_2d() {
  global float grid[4, 4];

  parallel {i, j} by [4, 4] {
    grid[i, j] = (float)(i * 10 + j);
  }

  parallel {i, j} by [4, 4] {
    println("grid[", i, ",", j, "] =", grid[i, j]);
  }
}
`,
  },
  {
    id: "conditional",
    name: "Conditional Logic",
    code: `__co__ void classify() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)((i * 7 + 3) % 20);
  }

  parallel {i} by [8] {
    if (data[i] < 5.0f) {
      println("data[", i, "] =", data[i], "-> LOW");
    } else if (data[i] < 15.0f) {
      println("data[", i, "] =", data[i], "-> MID");
    } else {
      println("data[", i, "] =", data[i], "-> HIGH");
    }
  }
}
`,
  },
  {
    id: "stencil",
    name: "1D Stencil",
    code: `__co__ void stencil_1d() {
  global float input[8];
  global float output[8];

  parallel {i} by [8] {
    input[i] = (float)(i * 10);
  }

  parallel {i} by [8] {
    if (i == 0 || i == 7) {
      output[i] = input[i];
    } else {
      output[i] = (input[i-1] + input[i] + input[i+1]) / 3.0f;
    }
  }

  parallel {i} by [8] {
    println("smoothed[", i, "] =", output[i]);
  }
}
`,
  },
  {
    id: "transpose",
    name: "Matrix Transpose",
    code: `__co__ void transpose() {
  global float A[4, 4];
  global float T[4, 4];

  parallel {i, j} by [4, 4] {
    A[i, j] = (float)(i * 10 + j);
  }

  parallel {i, j} by [4, 4] {
    T[j, i] = A[i, j];
  }

  parallel {i, j} by [4, 4] {
    println("T[", i, ",", j, "] =", T[i, j]);
  }
}
`,
  },
  {
    id: "dot-product",
    name: "Dot Product",
    code: `__co__ void dot_product() {
  global float a[8];
  global float b[8];

  parallel {i} by [8] {
    a[i] = (float)(i + 1);
    b[i] = (float)(i * 2);
  }

  float dot = 0.0f;
  foreach i in [0:8] {
    dot = dot + a[i] * b[i];
  }

  println("dot product =", dot);
}
`,
  },
  {
    id: "find-max",
    name: "Find Maximum",
    code: `__co__ void find_max() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)((i * 7 + 3) % 20);
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }

  float maxVal = data[0];
  foreach i in [1:8] {
    if (data[i] > maxVal) {
      maxVal = data[i];
    }
  }

  println("max =", maxVal);
}
`,
  },
  {
    id: "pipeline",
    name: "Two-Stage Pipeline",
    code: `__co__ void pipeline_demo() {
  global float raw[4];
  global float processed[4];
  shared float buf[4];

  // Stage 1: generate raw data
  parallel {i} by [4] {
    raw[i] = (float)((i + 1) * 10);
  }

  // DMA to shared buffer
  dma(raw[0:4], buf[0:4]);

  // Stage 2: process in shared memory
  parallel {i} by [4] {
    processed[i] = buf[i] * 2.0f + 1.0f;
  }

  parallel {i} by [4] {
    println("processed[", i, "] =", processed[i]);
  }
}
`,
  },
  {
    id: "conditional-processing",
    name: "Conditional Processing",
    code: `__co__ void even_odd() {
  global float out[8];

  parallel {i} by [8] {
    if (i % 2 == 0) {
      out[i] = (float)(i * 2);
    } else {
      out[i] = (float)(i * 2 + 1);
    }
  }

  parallel {i} by [8] {
    if (i % 2 == 0) {
      println("out[", i, "] =", out[i], " (even)");
    } else {
      println("out[", i, "] =", out[i], " (odd)");
    }
  }
}
`,
  },
  {
    id: "dma-tiling",
    name: "DMA Tiling",
    code: `__co__ void dma_tiling() {
  global float src[12];
  global float dst[12];
  shared float tile[4];

  parallel {i} by [12] {
    src[i] = (float)(i + 1);
  }

  // Load → process → store, one tile at a time
  foreach t in [0:3] {
    dma(src[t*4 : t*4+4], tile[0:4]);

    parallel {i} by [4] {
      tile[i] = tile[i] * 2.0f;
    }

    parallel {i} by [4] {
      dst[t*4 + i] = tile[i];
    }
  }

  parallel {i} by [12] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  },
  {
    id: "nested-reduction",
    name: "Nested Reduction",
    code: `__co__ void nested_reduction() {
  global float matrix[4, 4];
  global float row_sum[4];
  global float col_sum[4];

  parallel {i, j} by [4, 4] {
    matrix[i, j] = (float)(i * 4 + j + 1);
  }

  foreach i in [0:4] {
    float rsum = 0.0f;
    foreach j in [0:4] {
      rsum = rsum + matrix[i, j];
    }
    row_sum[i] = rsum;
  }

  foreach j in [0:4] {
    float csum = 0.0f;
    foreach i in [0:4] {
      csum = csum + matrix[i, j];
    }
    col_sum[j] = csum;
  }

  parallel {i} by [4] {
    println("row_sum[", i, "] =", row_sum[i]);
    println("col_sum[", i, "] =", col_sum[i]);
  }
}
`,
  },
  {
    id: "ping-pong",
    name: "Ping-Pong Pipeline",
    code: `__co__ void ping_pong_pipeline() {
  global float raw[8];
  global float cooked[8];
  shared float ping[4];
  shared float pong[4];
  shared event to_pong;
  shared event to_ping;

  parallel {i} by [8] {
    raw[i] = (float)(i + 1);
  }

  arrive to_pong;
  arrive to_ping;

  // Tile 0: stage 1 loads ping, stage 2 writes pong
  wait to_ping;
  dma(raw[0:4], ping[0:4]);
  parallel {i} by [4] {
    ping[i] = ping[i] + 1.0f;
  }
  arrive to_pong;

  wait to_pong;
  dma(ping[0:4], pong[0:4]);
  parallel {i} by [4] {
    cooked[i] = pong[i] * 2.0f;
  }
  arrive to_ping;

  // Tile 1: reuse ping/pong buffers
  wait to_ping;
  dma(raw[4:8], ping[0:4]);
  parallel {i} by [4] {
    ping[i] = ping[i] + 1.0f;
  }
  arrive to_pong;

  wait to_pong;
  dma(ping[0:4], pong[0:4]);
  parallel {i} by [4] {
    cooked[4 + i] = pong[i] * 2.0f;
  }
  arrive to_ping;

  parallel {i} by [8] {
    println("cooked[", i, "] =", cooked[i]);
  }
}
`,
  },
  {
    id: "bounded-queue",
    name: "Bounded Queue",
    code: `__co__ void bounded_queue() {
  global float source[8];
  shared float queue[4];
  shared event full;
  shared event empty;
  global float output[4];

  parallel {i} by [8] {
    source[i] = (float)((i + 1) * 10);
  }

  arrive empty;

  // Producer: fill bounded 4-slot shared buffer
  wait empty;
  dma(source[0:4], queue[0:4]);
  arrive full;

  // Consumer: drain when full, then release buffer
  wait full;
  dma(queue[0:4], output[0:4]);
  arrive empty;

  parallel {i} by [4] {
    println("output[", i, "] =", output[i]);
  }
}
`,
  },
  {
    id: "histogram",
    name: "Histogram",
    code: `__co__ void histogram() {
  global int data[8];
  global int bins[4];

  parallel {i} by [8] {
    data[i] = i % 4;
  }

  parallel {i} by [4] {
    bins[i] = 0;
  }

  foreach i in [0:8] {
    bins[data[i]] = bins[data[i]] + 1;
  }

  parallel {i} by [4] {
    println("bin[", i, "] =", bins[i]);
  }
}
`,
  },
];
