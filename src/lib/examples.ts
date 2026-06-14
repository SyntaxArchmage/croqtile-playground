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
];
