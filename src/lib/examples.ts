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
  {
    id: "inthreads",
    name: "In-Thread Parallelism",
    description: "Demonstrate inthreads for subgroup-level parallel execution within a thread",
    code: `__co__ void inthreads_demo() {
  global int results[8];

  parallel {tid} by [2] {
    inthreads {lane} by [4] {
      int idx = tid * 4 + lane;
      results[idx] = idx * idx;
    }
  }

  foreach i in [0:8] {
    println("results[", i, "] =", results[i]);
  }
}
`,
  },
  {
    id: "rotate",
    name: "Register Rotate",
    description: "Use rotate to shift values across threads in a warp-style communication pattern",
    code: `__co__ void rotate_demo() {
  global int data[4];

  parallel {i} by [4] {
    data[i] = (i + 1) * 10;
  }

  println("before rotate:");
  foreach i in [0:4] {
    println("  data[", i, "] =", data[i]);
  }

  parallel {i} by [4] {
    int val = data[i];
    rotate val by 1;
    data[i] = val;
  }

  println("after rotate by 1:");
  foreach i in [0:4] {
    println("  data[", i, "] =", data[i]);
  }
}
`,
  },
  {
    id: "barrier-sync",
    name: "Barrier Synchronization",
    description: "Use barriers to synchronize phases of parallel computation",
    code: `__co__ void barrier_sync() {
  global int phase1[4];
  global int phase2[4];

  parallel {i} by [4] {
    phase1[i] = i * 2;
  }

  println("phase 1 complete:");
  foreach i in [0:4] {
    println("  phase1[", i, "] =", phase1[i]);
  }

  parallel {i} by [4] {
    phase2[i] = phase1[i] + phase1[(i + 1) % 4];
  }

  println("phase 2 (neighbor sum):");
  foreach i in [0:4] {
    println("  phase2[", i, "] =", phase2[i]);
  }
}
`,
  },
  {
    id: "parallel-copy",
    name: "Parallel Copy",
    description: "Copy elements from one global array to another in parallel",
    code: `__co__ void parallel_copy() {
  global int src[8];
  global int dst[8];

  parallel {i} by [8] {
    src[i] = (i + 1) * 10;
  }

  parallel {i} by [8] {
    dst[i] = src[i];
  }

  parallel {i} by [8] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  },
  {
    id: "array-init",
    name: "Array Init",
    description: "Initialize an array with sequential values using parallel",
    code: `__co__ void array_init() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)(i * 10);
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  },
  {
    id: "signal-wait",
    name: "Signal Wait",
    description: "Basic event-driven signal/wait coordination between stages",
    code: `__co__ void signal_wait() {
  global float input[4];
  shared float buf[4];
  shared event ready;

  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 3);
  }

  dma(input[0:4], buf[0:4]);
  signal ready;

  wait ready;

  parallel {i} by [4] {
    println("buf[", i, "] =", buf[i]);
  }
}
`,
  },
  {
    id: "double-buffer",
    name: "Double Buffer",
    description: "Classic double buffer with alternating DMA tile loads",
    code: `__co__ void double_buffer() {
  global float data[8];
  shared float bufA[4];
  shared float bufB[4];

  parallel {i} by [8] {
    data[i] = (float)((i + 1) * 5);
  }

  dma(data[0:4], bufA[0:4]);
  println("--- tile 0 from bufA ---");
  parallel {i} by [4] {
    println("bufA[", i, "] =", bufA[i]);
  }

  dma(data[4:8], bufB[0:4]);
  println("--- tile 1 from bufB ---");
  parallel {i} by [4] {
    println("bufB[", i, "] =", bufB[i]);
  }
}
`,
  },
  {
    id: "assert-check",
    name: "Assert Check",
    description: "Use assert_true to validate bounds and invariants in parallel",
    code: `__co__ void assert_check() {
  global float data[8];
  int N = 8;

  assert_true(N == 8);

  parallel {i} by [8] {
    data[i] = (float)(i * 3);
  }

  parallel {i} by [8] {
    assert_true(i >= 0);
    assert_true(i < N);
    println("data[", i, "] =", data[i]);
  }

  println("assert checks passed");
}
`,
  },
  {
    id: "foreach-sequential",
    name: "Sequential Foreach",
    description: "Sequential iteration with foreach for accumulation and ordered output",
    code: `__co__ void foreach_demo() {
  global int data[8];

  parallel {i} by [8] {
    data[i] = (i + 1) * 3;
  }

  int total = 0;
  foreach i in [0:8] {
    total = total + data[i];
    println("data[", i, "] =", data[i], "  running total =", total);
  }

  println("final total =", total);
}
`,
  },
  {
    id: "dma-double-buffer",
    name: "Double Buffering",
    description: "Classic double-buffering pattern using DMA for overlap of compute and transfer",
    code: `__co__ void double_buffer() {
  global int buf_a[4];
  global int buf_b[4];
  global int result[4];

  parallel {i} by [4] {
    buf_a[i] = i * 10;
  }

  dma {
    foreach i in [0:4] {
      buf_b[i] = buf_a[i];
    }
  }

  parallel {i} by [4] {
    result[i] = buf_b[i] + 1;
  }

  foreach i in [0:4] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  },
  {
    id: "matrix-diagonal",
    name: "Matrix Diagonal",
    description: "Extract main diagonal elements from a 2D matrix",
    code: `__co__ void matrix_diagonal() {
  global float M[4, 4];
  global float diag[4];

  parallel {i, j} by [4, 4] {
    M[i, j] = (float)(i * 4 + j + 1);
  }

  parallel {i} by [4] {
    diag[i] = M[i, i];
  }

  parallel {i} by [4] {
    println("diag[", i, "] =", diag[i]);
  }
}
`,
  },
  {
    id: "prefix-sum",
    name: "Prefix Sum",
    description: "Classic inclusive prefix sum (scan) with foreach",
    code: `__co__ void prefix_sum() {
  global float data[8];
  global float prefix[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  prefix[0] = data[0];
  foreach i in [1:8] {
    prefix[i] = prefix[i - 1] + data[i];
  }

  parallel {i} by [8] {
    println("prefix[", i, "] =", prefix[i]);
  }
}
`,
  },
  {
    id: "conditional-print",
    name: "Conditional Print",
    description: "if/else branching with println inside parallel threads",
    code: `__co__ void conditional_print() {
  global int values[8];

  parallel {i} by [8] {
    values[i] = i + 1;
  }

  parallel {i} by [8] {
    if (values[i] % 2 == 0) {
      println("values[", i, "] =", values[i], " is even");
    } else {
      println("values[", i, "] =", values[i], " is odd");
    }
  }
}
`,
  },
  {
    id: "nested-loops",
    name: "Nested Loops",
    description: "Nested foreach loops for sequential 2D iteration",
    code: `__co__ void nested_loops() {
  global float grid[3, 3];

  foreach i in [0:3] {
    foreach j in [0:3] {
      grid[i, j] = (float)(i * 3 + j);
    }
  }

  parallel {i, j} by [3, 3] {
    println("grid[", i, ",", j, "] =", grid[i, j]);
  }
}
`,
  },
  {
    id: "multi-array",
    name: "Multi-Array",
    description: "Element-wise operations across multiple arrays in parallel",
    code: `__co__ void multi_array() {
  global float a[8];
  global float b[8];
  global float c[8];

  parallel {i} by [8] {
    a[i] = (float)(i + 1);
    b[i] = (float)((i + 1) * 10);
  }

  parallel {i} by [8] {
    c[i] = a[i] + b[i];
  }

  parallel {i} by [8] {
    println("c[", i, "] =", c[i]);
  }
}
`,
  },
  {
    id: "constant-memory",
    name: "Constant Memory",
    description: "const qualifiers for read-only scalars and loop bounds",
    code: `__co__ void constant_memory() {
  global float data[8];
  global float scaled[8];

  const float SCALE = 2.5f;
  const int N = 8;

  parallel {i} by [N] {
    data[i] = (float)(i + 1);
  }

  parallel {i} by [N] {
    scaled[i] = data[i] * SCALE;
  }

  parallel {i} by [N] {
    println("scaled[", i, "] =", scaled[i]);
  }
}
`,
  },
  {
    id: "pipeline-stage",
    name: "Pipeline Stage",
    description: "Multi-stage computation with pipeline and stage blocks",
    code: `__co__ void pipeline_stage() {
  global float raw[4];
  global float cooked[4];

  parallel {i} by [4] {
    raw[i] = (float)(i + 1);
  }

  pipeline {
    stage {
      exec {
        parallel {i} by [4] {
          cooked[i] = raw[i] * 3.0f;
        }
      }
    }
    stage {
      exec {
        parallel {i} by [4] {
          cooked[i] = cooked[i] + 1.0f;
        }
      }
    }
  }

  parallel {i} by [4] {
    println("cooked[", i, "] =", cooked[i]);
  }
}
`,
  },
  {
    id: "bitwise-ops",
    name: "Bitwise Operations",
    description: "Bit manipulation with AND, OR, shift, and XOR in parallel",
    code: `__co__ void bitwise_ops() {
  global int data[8];
  global int masked[8];
  global int shifted[8];

  parallel {i} by [8] {
    data[i] = (i + 1) * 5;
  }

  parallel {i} by [8] {
    masked[i] = data[i] & 7;
    shifted[i] = data[i] >> 1;
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i], " &7 =", masked[i], " >>1 =", shifted[i]);
  }
}
`,
  },
  {
    id: "multi-dimensional",
    name: "Multi-Dimensional",
    description: "Extract and process a 2D submatrix from a larger matrix",
    code: `__co__ void multi_dimensional() {
  global float M[4, 4];
  global float sub[2, 2];

  parallel {i, j} by [4, 4] {
    M[i, j] = (float)(i * 4 + j);
  }

  parallel {i, j} by [2, 2] {
    sub[i, j] = M[i + 1, j + 1];
  }

  parallel {i, j} by [2, 2] {
    println("sub[", i, ",", j, "] =", sub[i, j]);
  }
}
`,
  },
  {
    id: "reduction-pattern",
    name: "Reduction Pattern",
    description: "Combined min/max reduction over an array with foreach",
    code: `__co__ void reduction_pattern() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)((i * 7 + 3) % 20);
  }

  float minVal = data[0];
  float maxVal = data[0];
  foreach i in [1:8] {
    if (data[i] < minVal) {
      minVal = data[i];
    }
    if (data[i] > maxVal) {
      maxVal = data[i];
    }
  }

  println("min =", minVal, " max =", maxVal);
}
`,
  },
  {
    id: "sync-barrier",
    name: "Barrier Sync",
    description: "Synchronize pipeline phases with shared events and arrive/wait",
    code: `__co__ void sync_barrier() {
  global float a[4];
  global float b[4];
  shared event phase_done;

  parallel {i} by [4] {
    a[i] = (float)(i + 1);
  }

  arrive phase_done;

  wait phase_done;
  parallel {i} by [4] {
    b[i] = a[i] * 2.0f;
  }

  parallel {i} by [4] {
    println("b[", i, "] =", b[i]);
  }
}
`,
  },
  {
    id: "type-casting",
    name: "Type Casting",
    description: "Explicit int/float conversions with (type) cast syntax",
    code: `__co__ void type_casting() {
  global int integers[8];
  global float floats[8];
  global int truncated[8];

  parallel {i} by [8] {
    integers[i] = i * 3 + 2;
  }

  parallel {i} by [8] {
    floats[i] = (float)integers[i] / 2.0f;
    truncated[i] = (int)floats[i];
  }

  parallel {i} by [8] {
    println("int=", integers[i], " float=", floats[i], " trunc=", truncated[i]);
  }
}
`,
  },
  {
    id: "thread-id-math",
    name: "Thread ID Math",
    description: "Compute 2D row/col indices from a linear thread ID",
    code: `__co__ void thread_id_math() {
  global int row[8];
  global int col[8];
  int WIDTH = 4;

  parallel {tid} by [8] {
    row[tid] = tid / WIDTH;
    col[tid] = tid % WIDTH;
  }

  parallel {tid} by [8] {
    println("tid", tid, "-> (", row[tid], ",", col[tid], ")");
  }
}
`,
  },
  {
    id: "conditional-dma",
    name: "Conditional DMA",
    description: "Select DMA source slices with conditional execution",
    code: `__co__ void conditional_dma() {
  global float src[8];
  shared float tile[4];
  global float dst[8];

  parallel {i} by [8] {
    src[i] = (float)(i + 1);
  }

  foreach t in [0:2] {
    if (t == 0) {
      dma(src[0:4], tile[0:4]);
    } else {
      dma(src[4:8], tile[0:4]);
    }

    parallel {i} by [4] {
      dst[t * 4 + i] = tile[i] * 2.0f;
    }
  }

  parallel {i} by [8] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  },
  {
    id: "transpose-tiled",
    name: "Transpose",
    description: "Matrix transpose with shared-memory tile staging for coalesced access",
    code: `__co__ void transpose_tiled() {
  global float input[3, 4];
  global float output[4, 3];
  shared float tile[3, 4];

  parallel {r, c} by [3, 4] {
    input[r, c] = (float)(r * 4 + c);
  }

  dma(input[0:12], tile[0:12]);

  parallel {r, c} by [3, 4] {
    output[c, r] = tile[r, c];
  }

  parallel {r, c} by [4, 3] {
    println("output[", r, ",", c, "] =", output[r, c]);
  }
}
`,
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    description: "Sequential Fibonacci computation with foreach dependency chain",
    code: `__co__ void fibonacci() {
  global int fib[8];

  fib[0] = 0;
  fib[1] = 1;
  foreach i in [2:8] {
    fib[i] = fib[i - 1] + fib[i - 2];
  }

  foreach i in [0:8] {
    println("fib[", i, "] =", fib[i]);
  }
}
`,
  },
  {
    id: "two-pass",
    name: "Two-Pass",
    description: "Two-pass algorithm: first pass counts, second pass compacts results",
    code: `__co__ void two_pass() {
  global int data[8];
  global int result[8];

  parallel {i} by [8] {
    data[i] = (i + 1) * 3;
  }

  // Pass 1: count elements greater than 10
  int count = 0;
  foreach i in [0:8] {
    if (data[i] > 10) {
      count = count + 1;
    }
  }

  // Pass 2: compact qualifying elements
  int write = 0;
  foreach i in [0:8] {
    if (data[i] > 10) {
      result[write] = data[i];
      write = write + 1;
    }
  }

  println("count =", count);
  foreach i in [0:count] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  },
  {
    id: "loop-tiling",
    name: "Loop Tiling",
    description: "Loop tiling with foreach tile loops and DMA for cache-friendly blocking",
    code: `__co__ void loop_tiling() {
  global float data[8];
  global float out[8];
  shared float tile[4];
  int TILE = 4;

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  foreach t in [0:2] {
    dma(data[t * TILE : t * TILE + TILE], tile[0:TILE]);

    parallel {i} by [TILE] {
      tile[i] = tile[i] * 2.0f;
    }

    parallel {i} by [TILE] {
      out[t * TILE + i] = tile[i];
    }
  }

  parallel {i} by [8] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  },
  {
    id: "scatter-write",
    name: "Scatter Write",
    description: "Parallel scatter writes to computed destination indices",
    code: `__co__ void scatter_write() {
  global int src[8];
  global int dst[8];

  parallel {i} by [8] {
    src[i] = (i + 1) * 10;
    dst[i] = 0;
  }

  parallel {i} by [8] {
    int dst_idx = (i * 3) % 8;
    dst[dst_idx] = src[i];
  }

  parallel {i} by [8] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  },
  {
    id: "gather-read",
    name: "Gather Read",
    description: "Parallel gather reads from computed source indices",
    code: `__co__ void gather_read() {
  global int src[8];
  global int dst[8];

  parallel {i} by [8] {
    src[i] = (i + 1) * 10;
  }

  parallel {i} by [8] {
    int src_idx = (i * 3) % 8;
    dst[i] = src[src_idx];
  }

  parallel {i} by [8] {
    println("dst[", i, "] =", dst[i]);
  }
}
`,
  },
  {
    id: "local-memory",
    name: "Local Memory",
    description: "Per-thread local registers with shared-memory staging via DMA",
    code: `__co__ void local_memory() {
  global float data[8];
  global float out[8];
  shared float tile[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  dma(data[0:8], tile[0:8]);

  parallel {i} by [8] {
    float local_acc = tile[i];
    local_acc = local_acc * local_acc + 1.0f;
    out[i] = local_acc;
  }

  parallel {i} by [8] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  },
  {
    id: "warp-shuffle",
    name: "Warp Shuffle",
    description: "Simulate warp-level shuffle with rotate across a thread group",
    code: `__co__ void warp_shuffle() {
  global int data[4];
  global int shuffled[4];

  parallel {i} by [4] {
    data[i] = (i + 1) * 10;
  }

  println("before shuffle:");
  foreach i in [0:4] {
    println("  data[", i, "] =", data[i]);
  }

  parallel {i} by [4] {
    int val = data[i];
    rotate val by 1;
    shuffled[i] = val;
  }

  println("after rotate by 1:");
  foreach i in [0:4] {
    println("  shuffled[", i, "] =", shuffled[i]);
  }
}
`,
  },
  {
    id: "coalesced-access",
    name: "Coalesced Access",
    description: "Coalesced contiguous reads vs strided uncoalesced access pattern",
    code: `__co__ void coalesced_access() {
  global float data[32];
  global float coalesced[8];
  global float strided[8];

  parallel {i} by [32] {
    data[i] = (float)(i + 1);
  }

  parallel {i} by [8] {
    coalesced[i] = data[i];
  }

  parallel {i} by [8] {
    strided[i] = data[i * 4];
  }

  parallel {i} by [8] {
    println("coalesced[", i, "] =", coalesced[i],
            " strided[", i, "] =", strided[i]);
  }
}
`,
  },
  {
    id: "stencil-pattern",
    name: "Stencil",
    description: "1D three-point stencil with boundary copy and neighbor averaging",
    code: `__co__ void stencil_pattern() {
  global float input[8];
  global float output[8];

  parallel {i} by [8] {
    input[i] = (float)(i * 10);
  }

  parallel {i} by [8] {
    if (i == 0 || i == 7) {
      output[i] = input[i];
    } else {
      output[i] = (input[i - 1] + input[i] + input[i + 1]) / 3.0f;
    }
  }

  parallel {i} by [8] {
    println("stencil[", i, "] =", output[i]);
  }
}
`,
  },
];
