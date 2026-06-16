import type { Tutorial } from "./index";

export const ch48: Tutorial = {
  id: "ch48",
  title: "Numerical Computing",
  description: "Numerical methods on GPU: dot products, vector norms, matrix-vector multiply, and iterative solvers.",
  steps: [
    {
      title: "Parallel dot product and vector norms",
      content: `The **dot product** \`a · b = Σ a[i] * b[i]\` is a map followed by a reduce:

1. \`parallel {i}\` — compute per-element products into a partial array
2. \`foreach\` — fold partial sums into the final scalar

The **L2 norm** \`||v|| = sqrt(v · v)\` reuses the same pattern.

\`\`\`croqtile
parallel {i} by [N] {
  partial[i] = a[i] * b[i];
}
float dot = 0.0f;
foreach i in [0:N] {
  dot = dot + partial[i];
}
\`\`\`

Try the example — compute the dot product of two vectors and the L2 norm of the result.`,
      code: `__co__ void dot_product_norm() {
  global float a[4];
  global float b[4];
  global float partial[4];
  int N = 4;

  parallel {i} by [4] {
    a[i] = (float)(i + 1);
    b[i] = (float)(i + 2);
  }

  parallel {i} by [4] {
    partial[i] = a[i] * b[i];
  }

  float dot = 0.0f;
  foreach i in [0:N] {
    dot = dot + partial[i];
  }

  println("dot =", dot);

  float norm_sq = 0.0f;
  foreach i in [0:N] {
    norm_sq = norm_sq + partial[i] * partial[i];
  }
  println("norm_sq =", norm_sq);
}
`,
      hint: "a = [1,2,3,4], b = [2,3,4,5]. Dot = 1*2 + 2*3 + 3*4 + 4*5 = 40.",
    },
    {
      title: "Matrix-vector multiplication",
      content: `Matrix-vector multiply \`y = M × v\` computes one dot product per output row:

\`\`\`croqtile
parallel {i} by [rows] {
  float sum = 0.0f;
  foreach j in [0:cols] {
    sum = sum + M[i, j] * v[j];
  }
  y[i] = sum;
}
\`\`\`

Each row is independent — perfect for GPU parallelism. Load \`M\` and \`v\` into shared memory via DMA when the matrix is reused across many operations.

Try the example — multiply a 3×3 matrix by a 3-vector and print each output element.`,
      code: `__co__ void matvec_multiply() {
  global float M[3, 3];
  global float v[3];
  global float y[3];
  int rows = 3;
  int cols = 3;

  parallel {i, j} by [3, 3] {
    M[i, j] = (float)(i * cols + j + 1);
  }

  parallel {i} by [3] {
    v[i] = (float)(i + 1);
  }

  parallel {i} by [3] {
    float sum = 0.0f;
    foreach j in [0:3] {
      sum = sum + M[i, j] * v[j];
    }
    y[i] = sum;
  }

  parallel {i} by [3] {
    println("y[", i, "] =", y[i]);
  }
}
`,
      hint: "Row 0: 1*1 + 2*2 + 3*3 = 14. Row 1: 4*1 + 5*2 + 6*3 = 32. Row 2: 7*1 + 8*2 + 9*3 = 50.",
    },
    {
      title: "Iterative solvers (Jacobi method)",
      content: `The **Jacobi method** solves \`Ax = b\` iteratively. Each iteration updates every component independently using the previous iterate:

\`\`\`
x_new[i] = (b[i] - Σ_{j≠i} A[i,j] * x[j]) / A[i,i]
\`\`\`

Pattern:
1. \`parallel {i}\` — compute each \`x_new[i]\` from the old \`x\`
2. Copy \`x_new\` back to \`x\`
3. Repeat for a fixed number of iterations

This is embarrassingly parallel within each iteration — ideal for GPUs.

Try the example — one Jacobi iteration on a 2×2 diagonally dominant system.`,
      code: `__co__ void jacobi_solver() {
  global float A[2, 2];
  global float b[2];
  global float x[2];
  global float x_new[2];
  int N = 2;

  parallel {i, j} by [2, 2] {
    if (i == j) {
      A[i, j] = 4.0f;
    } else {
      A[i, j] = 1.0f;
    }
  }

  parallel {i} by [2] {
    b[i] = (float)((i + 1) * 2);
    x[i] = 0.0f;
  }

  parallel {i} by [2] {
    float sum = b[i];
    foreach j in [0:2] {
      if (j != i) {
        sum = sum - A[i, j] * x[j];
      }
    }
    x_new[i] = sum / A[i, i];
  }

  parallel {i} by [2] {
    x[i] = x_new[i];
  }

  parallel {i} by [2] {
    println("x[", i, "] =", x[i]);
  }
}
`,
      hint: "A = [[4,1],[1,4]], b = [2,4], x starts at [0,0]. First iteration: x = [0.5, 1.0].",
    },
  ],
};
