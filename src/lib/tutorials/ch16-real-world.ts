import type { Tutorial } from "./index";

export const ch16: Tutorial = {
  id: "ch16",
  title: "Real-World Patterns",
  description: "Apply Croqtile to production GPU patterns: matrix multiply, stencils, and reduce-then-broadcast.",
  steps: [
    {
      title: "Matrix multiplication pattern",
      content: `Matrix multiplication is the workhorse of GPU computing. Each output element is independent in the outer dimensions, but requires an inner reduction over the shared dimension.

**Pattern:**
- \`parallel {i, j}\` — one thread per output element C[i, j]
- \`foreach k\` — sequential dot product over the inner dimension

\`\`\`
parallel {i, j} by [N, N] {
  float sum = 0.0f;
  foreach k in [0:N] {
    sum = sum + A[i, k] * B[k, j];
  }
  C[i, j] = sum;
}
\`\`\`

This maps directly to how real GPUs execute GEMM kernels — thousands of threads each computing one output cell.

Try the example — it multiplies two 2×2 matrices and prints the result.`,
      code: `__co__ void matmul_pattern() {
  global float A[2, 2];
  global float B[2, 2];
  global float C[2, 2];

  parallel {i, j} by [2, 2] {
    A[i, j] = (float)(i * 2 + j + 1);
    B[i, j] = (float)(i * 2 + j + 5);
  }

  parallel {i, j} by [2, 2] {
    float sum = 0.0f;
    foreach k in [0:2] {
      sum = sum + A[i, k] * B[k, j];
    }
    C[i, j] = sum;
  }

  parallel {i, j} by [2, 2] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
    },
    {
      title: "Stencil computation pattern",
      content: `Stencil kernels read neighboring elements to compute each output. They appear in image processing, physics simulations, and PDE solvers.

**Key concerns:**
- Each thread reads \`input[i-1]\`, \`input[i]\`, \`input[i+1]\` — neighbor access
- **Boundary handling** — edge elements have no neighbor on one side; copy or clamp instead of reading out of bounds

**Pattern:**
\`\`\`
parallel {i} by [N] {
  if (i == 0 || i == N-1) {
    output[i] = input[i];           // boundary: pass through
  } else {
    output[i] = (input[i-1] + input[i] + input[i+1]) / 3.0f;
  }
}
\`\`\`

Load data into shared memory via DMA when the stencil is applied repeatedly — it keeps neighbor reads fast.

Try the example — a 3-point smoothing stencil with boundary pass-through.`,
      code: `__co__ void stencil_pattern() {
  global float input[8];
  global float output[8];

  parallel {i} by [8] {
    input[i] = (float)((i + 1) * 10);
  }

  parallel {i} by [8] {
    if (i == 0 || i == 7) {
      output[i] = input[i];
    } else {
      output[i] = (input[i - 1] + input[i] + input[i + 1]) / 3.0f;
    }
  }

  parallel {i} by [8] {
    println("output[", i, "] =", output[i]);
  }
}
`,
    },
    {
      title: "Reduce-then-broadcast pattern",
      content: `Many algorithms need a **global value** computed from all data, then applied to every element. This is reduce-then-broadcast:

1. **Reduce** — use \`foreach\` to compute a single scalar (sum, max, mean)
2. **Broadcast** — use \`parallel\` to apply that scalar to every element

**Example — center data by subtracting the mean:**
\`\`\`
float total = 0.0f;
foreach i in [0:N] { total = total + data[i]; }
float mean = total / (float)N;

parallel {i} by [N] {
  centered[i] = data[i] - mean;
}
\`\`\`

The reduce step must be sequential (or synchronized). The broadcast step is embarrassingly parallel — each thread reads the same scalar and writes its own output slot.

Try the example — it computes the mean, then subtracts it from every element.`,
      code: `__co__ void reduce_broadcast() {
  global float data[8];
  global float centered[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;
  foreach i in [0:8] {
    total = total + data[i];
  }
  float mean = total / 8.0f;

  println("mean =", mean);

  parallel {i} by [8] {
    centered[i] = data[i] - mean;
  }

  parallel {i} by [8] {
    println("centered[", i, "] =", centered[i]);
  }
}
`,
    },
  ],
};
