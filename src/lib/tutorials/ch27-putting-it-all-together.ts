import type { Tutorial } from "./index";

export const ch27: Tutorial = {
  id: "ch27",
  title: "Putting It All Together",
  description: "Capstone tutorial combining modular vector libraries, DMA–parallel–pipeline workflows, and tiled matrix-vector multiply with shared memory.",
  steps: [
    {
      title: "Build a complete vector operations library",
      content: `Production Croqtile kernels start with **reusable helpers** at file scope. A small vector library keeps \`__co__\` entry points readable and testable.

**Core operations:**
- \`vec_add(a, b)\` — element-wise sum of two scalars passed per thread
- \`vec_scale(x, factor)\` — multiply by a constant
- \`vec_dot_term(a, b)\` — one multiply-add pair for a reduction

Use \`parallel\` to initialize arrays, helpers inside parallel blocks for transforms, and \`foreach\` to reduce the dot product.

\`\`\`croqtile
float vec_scale(float x, float factor) {
  return x * factor;
}
\`\`\`

Try the example — it scales a vector, adds a constant offset, then prints the dot product of the result with a second vector.`,
      code: `float vec_add(float a, float b) {
  return a + b;
}

float vec_scale(float x, float factor) {
  return x * factor;
}

float vec_dot_term(float a, float b) {
  return a * b;
}

__co__ void vector_library() {
  global float A[4];
  global float B[4];
  global float scaled[4];
  int N = 4;

  parallel {i} by [4] {
    A[i] = (float)(i + 1);
    B[i] = (float)(i + 2);
  }

  parallel {i} by [4] {
    scaled[i] = vec_add(vec_scale(A[i], 2.0f), 1.0f);
  }

  float dot = 0.0f;
  foreach i in [0:4] {
    dot = dot + vec_dot_term(scaled[i], B[i]);
  }

  println("dot =", dot);
  parallel {i} by [4] {
    println("scaled[", i, "] =", scaled[i]);
  }
}
`,
      hint: "Helpers take scalars — call them inside parallel {i} with A[i] and B[i]. Accumulate dot with foreach and vec_dot_term.",
    },
    {
      title: "Combine DMA, parallel, and pipeline",
      content: `Real kernels chain **memory transfer**, **parallel compute**, and **stage ordering** in one flow:

1. **Pipeline stage (Load):** \`dma\` global input into shared \`buf\`, then \`arrive loaded\`
2. **Pipeline stage (Compute):** \`wait loaded\`, \`parallel\` transform in shared memory, \`arrive computed\`
3. **Pipeline stage (Store):** \`wait computed\`, \`parallel\` write results to global output

Events (\`arrive\` / \`wait\`) ensure each stage sees finished data from the previous one. DMA moves data into fast shared memory; parallel handles the math; pipeline enforces order.

This is the same load → compute → store pattern used in production GPU kernels.

Try the example — it squares each element through a three-stage pipeline.`,
      code: `__co__ void dma_parallel_pipeline() {
  global float input[4];
  global float output[4];
  shared float buf[4];
  shared event loaded;
  shared event computed;

  parallel {i} by [4] {
    input[i] = (float)(i + 1);
  }

  arrive loaded;
  arrive computed;

  pipeline {
    stage {
      exec {
        dma(input[0:4], buf[0:4]);
        arrive loaded;
      }
    }
    stage {
      exec {
        wait loaded;
        parallel {i} by [4] {
          buf[i] = buf[i] * buf[i];
        }
        arrive computed;
      }
    }
    stage {
      exec {
        wait computed;
        parallel {i} by [4] {
          output[i] = buf[i];
        }
        parallel {i} by [4] {
          println("output[", i, "] =", output[i]);
        }
      }
    }
  }
}
`,
      hint: "Each stage wraps work in exec { }. Signal with arrive after DMA and compute; wait before reading shared buf.",
    },
    {
      title: "Full matrix-vector multiply with tiling and shared memory",
      content: `Matrix-vector multiply \`y = M × v\` is a staple GPU pattern. Each output row is an independent dot product, but loading \`M\` and \`v\` through shared memory keeps accesses fast.

**Tiled matvec pattern:**
1. \`dma\` the full matrix tile and vector into shared buffers
2. \`parallel {i}\` — one thread per output row
3. \`foreach j\` — inner reduction over columns using shared tiles

For a 2×2 matrix stored row-major as \`M[row * N + col]\`:

\`\`\`croqtile
parallel {i} by [2] {
  float sum = 0.0f;
  foreach j in [0:2] {
    sum = sum + tile_M[i * 2 + j] * tile_v[j];
  }
  y[i] = sum;
}
\`\`\`

Try the example — it multiplies a 2×2 matrix by a 2-vector and prints both output elements.`,
      code: `__co__ void tiled_matvec() {
  global float M[4];
  global float v[2];
  global float y[2];
  shared float tile_M[4];
  shared float tile_v[2];
  int rows = 2;
  int cols = 2;

  parallel {i, j} by [2, 2] {
    M[i * cols + j] = (float)(i * cols + j + 1);
  }

  parallel {i} by [2] {
    v[i] = (float)((i + 1) * 2);
  }

  dma(M[0:4], tile_M[0:4]);
  dma(v[0:2], tile_v[0:2]);

  parallel {i} by [2] {
    float sum = 0.0f;
    foreach j in [0:2] {
      sum = sum + tile_M[i * cols + j] * tile_v[j];
    }
    y[i] = sum;
  }

  parallel {i} by [2] {
    println("y[", i, "] =", y[i]);
  }
}
`,
      hint: "DMA both M and v into shared tiles first. Each thread i accumulates tile_M[i*cols+j] * tile_v[j] over j.",
    },
  ],
};
