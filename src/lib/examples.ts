export interface Example {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const EXAMPLES: Example[] = [
  {
    id: "hello",
    name: "Hello World",
    description: "Basic __co__ function and println output",
    code: `__co__ void hello() {
  println("Hello from Croqtile!");
}
`,
  },
  {
    id: "parallel",
    name: "Parallel Loop",
    description: "parallel {i} by [N] thread indexing",
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
    description: "global/shared memory with dma() transfer",
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
    description: "parallel + foreach matrix multiply accumulation",
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
    description: "DMA to shared tile and parallel read",
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
    description: "foreach loop sum accumulation",
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
    description: "Loop over tiles with DMA load/process/store",
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
    description: "parallel {i, j} by [N, M] 2D grid",
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
    description: "if/else branching inside parallel blocks",
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
    description: "Neighbor averaging with boundary handling",
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
    description: "2D index swapping for matrix transpose",
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
    description: "Vector multiply-accumulate with foreach",
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
    description: "Conditional foreach reduction for maximum",
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
    description: "Two-stage DMA and shared memory processing",
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
    description: "Predicate-based parallel filtering",
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
    description: "Multi-tile DMA with per-tile processing",
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
    description: "Hierarchical row/column sums with foreach",
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
    description: "Double-buffered pipeline with shared memory",
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
    description: "Producer-consumer with bounded shared buffer",
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
    description: "Histogram counting with sequential accumulation",
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
  {
    id: "array-reduction",
    name: "Array Reduction",
    description: "Multi-stage parallel chunk reduction",
    code: `__co__ void array_reduction() {
  global float data[16];
  global float partial[4];

  parallel {i} by [16] {
    data[i] = (float)(i + 1);
  }

  // Each block reduces a 4-element chunk via foreach
  parallel {block} by [4] {
    float chunk_sum = 0.0f;
    foreach i in [block*4 : block*4+4] {
      chunk_sum = chunk_sum + data[i];
    }
    partial[block] = chunk_sum;
  }

  // Final foreach combines partial results
  float total = 0.0f;
  foreach i in [0:4] {
    total = total + partial[i];
  }

  println("sum of 1..16 =", total);
}
`,
  },
  {
    id: "pipeline-processing",
    name: "Pipeline Processing",
    description: "Multi-stage pipeline with DMA and compute",
    code: `__co__ void pipeline_processing() {
  global float raw[8];
  global float normalized[8];
  global float scaled[8];
  global float final[8];
  shared float buf[4];

  parallel {i} by [8] {
    raw[i] = (float)((i + 1) * 10);
  }

  // Stage 1: normalize — DMA load, compute, store
  foreach t in [0:2] {
    dma(raw[t*4 : t*4+4], buf[0:4]);
    parallel {i} by [4] {
      normalized[t*4 + i] = buf[i] / 80.0f;
    }
  }

  // Stage 2: scale — DMA from stage 1 output
  foreach t in [0:2] {
    dma(normalized[t*4 : t*4+4], buf[0:4]);
    parallel {i} by [4] {
      scaled[t*4 + i] = buf[i] * 100.0f;
    }
  }

  // Stage 3: finalize — DMA from stage 2 output
  foreach t in [0:2] {
    dma(scaled[t*4 : t*4+4], buf[0:4]);
    parallel {i} by [4] {
      final[t*4 + i] = buf[i] + 1.0f;
    }
  }

  parallel {i} by [8] {
    println("final[", i, "] =", final[i]);
  }
}
`,
  },
  {
    id: "assert-validation",
    name: "Assert Validation",
    description: "assert_true usage for runtime validation of preconditions and results",
    code: `__co__ void assert_validation() {
  global float data[8];
  int N = 8;

  assert_true(N > 0);
  assert_true(N <= 8);

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float sum = 0.0f;
  foreach i in [0:8] {
    sum = sum + data[i];
  }

  assert_true(sum == 36.0f);
  println("validation passed, sum =", sum);
}
`,
  },
  {
    id: "multi-stage-reduction",
    name: "Multi-Stage Reduction",
    description: "Three-stage pipeline for hierarchical sum reduction",
    code: `__co__ void multi_stage_reduction() {
  global float data[16];
  global float partial[4];
  global float pair_sum[2];
  float total = 0.0f;

  parallel {i} by [16] {
    data[i] = (float)(i + 1);
  }

  // Stage 1: reduce each 4-element chunk
  parallel {block} by [4] {
    float chunk_sum = 0.0f;
    foreach i in [block*4 : block*4+4] {
      chunk_sum = chunk_sum + data[i];
    }
    partial[block] = chunk_sum;
  }

  // Stage 2: combine adjacent partials
  parallel {i} by [2] {
    pair_sum[i] = partial[i*2] + partial[i*2 + 1];
  }

  // Stage 3: final reduction
  foreach i in [0:2] {
    total = total + pair_sum[i];
  }

  println("sum of 1..16 =", total);
}
`,
  },
  {
    id: "pattern-fill",
    name: "Pattern Fill",
    description: "Fill a 2D array with a checkerboard pattern using nested parallel",
    code: `__co__ void pattern_fill() {
  global float grid[4, 4];

  parallel {i, j} by [4, 4] {
    if ((i + j) % 2 == 0) {
      grid[i, j] = 1.0f;
    } else {
      grid[i, j] = 0.0f;
    }
  }

  parallel {i, j} by [4, 4] {
    println("grid[", i, ",", j, "] =", grid[i, j]);
  }
}
`,
  },
];
