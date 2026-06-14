import type { Tutorial } from "./index";

export const ch05: Tutorial = {
  id: "ch05",
  title: "2D Arrays & Matrix Ops",
  description: "Work with 2D arrays and perform matrix computations.",
  steps: [
    {
      title: "2D global arrays",
      content: `Croqtile supports multi-dimensional arrays. Declare them with comma-separated sizes:

\`global float M[rows, cols]\`

Access elements with \`M[i, j]\` where \`i\` is the row and \`j\` is the column.`,
      code: `__co__ void matrix_init() {
  global float M[3, 3];

  parallel {i, j} by [3, 3] {
    M[i, j] = (float)(i * 3 + j);
  }

  parallel {i, j} by [3, 3] {
    println("M[", i, ",", j, "] =", M[i, j]);
  }
}
`,
    },
    {
      title: "Matrix addition",
      content: `With 2D parallel indices, matrix operations map naturally to Croqtile:

Each thread handles one element — true data parallelism.`,
      code: `__co__ void matrix_add() {
  global float A[2, 3];
  global float B[2, 3];
  global float C[2, 3];

  parallel {i, j} by [2, 3] {
    A[i, j] = (float)(i + j);
    B[i, j] = (float)(i * j + 1);
  }

  parallel {i, j} by [2, 3] {
    C[i, j] = A[i, j] + B[i, j];
  }

  parallel {i, j} by [2, 3] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
    },
    {
      title: "Matrix multiply",
      content: `Matrix multiplication combines parallel and sequential patterns:

- Outer dimensions (\`i\`, \`j\`) iterate in parallel — each thread computes one output element
- Inner dimension (\`k\`) iterates sequentially via \`foreach\` — accumulates the dot product

This is the foundation of GPU computing. Real GPUs execute this pattern with thousands of threads simultaneously.`,
      code: `__co__ void matmul() {
  global float A[4, 4];
  global float B[4, 4];
  global float C[4, 4];

  parallel {i, j} by [4, 4] {
    A[i, j] = (float)(i + j);
    B[i, j] = (float)(i * j);
    C[i, j] = 0.0f;
  }

  parallel {i, j} by [4, 4] {
    float sum = 0.0f;
    foreach k in [0:4] {
      sum = sum + A[i, k] * B[k, j];
    }
    C[i, j] = sum;
  }

  println("C[0,0] =", C[0, 0]);
  println("C[1,1] =", C[1, 1]);
  println("C[2,2] =", C[2, 2]);
}
`,
    },
  ],
};
