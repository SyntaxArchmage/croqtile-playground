import type { Tutorial } from "./index";

export const ch29: Tutorial = {
  id: "ch29",
  title: "Matrix Operations",
  description: "Common matrix computations: creation and initialization, addition and scalar ops, transpose and rotation.",
  steps: [
    {
      title: "Matrix creation and initialization patterns",
      content: `Matrices in Croqtile use 2D global arrays: \`global float M[rows, cols]\`. Access elements with \`M[i, j]\`.

**Common initialization patterns:**
- **Sequential values:** \`M[i, j] = (float)(i * cols + j)\` — row-major indexing
- **Identity:** ones on the diagonal, zeros elsewhere
- **Constant fill:** every element set to the same scalar

Use \`parallel {i, j} by [rows, cols]\` so each thread initializes one cell independently.

\`\`\`croqtile
parallel {i, j} by [3, 3] {
  if (i == j) {
    M[i, j] = 1.0f;
  } else {
    M[i, j] = 0.0f;
  }
}
\`\`\`

Try the example — it builds a 3×3 identity matrix and a row-major index grid, then prints both.`,
      code: `__co__ void matrix_init_patterns() {
  global float identity[3, 3];
  global float grid[3, 3];
  int rows = 3;
  int cols = 3;

  parallel {i, j} by [3, 3] {
    if (i == j) {
      identity[i, j] = 1.0f;
    } else {
      identity[i, j] = 0.0f;
    }
    grid[i, j] = (float)(i * cols + j);
  }

  parallel {i, j} by [3, 3] {
    println("identity[", i, ",", j, "] =", identity[i, j]);
    println("grid[", i, ",", j, "] =", grid[i, j]);
  }
}
`,
      hint: "Use parallel {i, j} by [rows, cols]. Identity: 1.0f on diagonal, 0.0f elsewhere. Grid: i * cols + j.",
    },
    {
      title: "Matrix addition and scalar operations",
      content: `Element-wise matrix operations map directly to 2D parallelism — each thread handles one \`(i, j)\` cell.

**Addition:** \`C[i, j] = A[i, j] + B[i, j]\`

**Scalar multiply:** \`B[i, j] = A[i, j] * scale\`

**Scalar add:** \`B[i, j] = A[i, j] + offset\`

These are the building blocks for weighted combinations, normalization, and bias terms in neural networks.

\`\`\`croqtile
parallel {i, j} by [2, 2] {
  C[i, j] = A[i, j] + B[i, j];
  D[i, j] = A[i, j] * 2.0f + 1.0f;
}
\`\`\`

Try the example — it adds two 2×2 matrices, then scales and offsets a copy.`,
      code: `__co__ void matrix_add_scalar() {
  global float A[2, 2];
  global float B[2, 2];
  global float sum[2, 2];
  global float scaled[2, 2];
  float scale = 2.0f;
  float offset = 1.0f;

  parallel {i, j} by [2, 2] {
    A[i, j] = (float)(i + j + 1);
    B[i, j] = (float)(i * 2 + j);
  }

  parallel {i, j} by [2, 2] {
    sum[i, j] = A[i, j] + B[i, j];
    scaled[i, j] = A[i, j] * scale + offset;
  }

  parallel {i, j} by [2, 2] {
    println("sum[", i, ",", j, "] =", sum[i, j]);
    println("scaled[", i, ",", j, "] =", scaled[i, j]);
  }
}
`,
      hint: "Initialize A and B in one parallel block. Second block computes sum and scaled in the same pass.",
    },
    {
      title: "Matrix transpose and rotation",
      content: `**Transpose** swaps rows and columns: \`T[j, i] = M[i, j]\`. Each thread reads one source cell and writes to the mirrored position.

**90° rotation** (clockwise) reindexes elements: for an N×N matrix, \`rotated[j, N - 1 - i] = M[i, j]\`.

Both patterns are embarrassingly parallel — no thread reads a cell another thread is writing, as long as source and destination are separate arrays.

\`\`\`croqtile
parallel {i, j} by [N, N] {
  T[j, i] = M[i, j];
}
\`\`\`

Try the example — it transposes a 3×3 matrix, then rotates it 90° clockwise into a third buffer.`,
      code: `__co__ void transpose_and_rotate() {
  global float M[3, 3];
  global float T[3, 3];
  global float rotated[3, 3];
  int N = 3;

  parallel {i, j} by [3, 3] {
    M[i, j] = (float)(i * N + j + 1);
  }

  parallel {i, j} by [3, 3] {
    T[j, i] = M[i, j];
  }

  parallel {i, j} by [3, 3] {
    rotated[j, N - 1 - i] = M[i, j];
  }

  parallel {i, j} by [3, 3] {
    println("T[", i, ",", j, "] =", T[i, j]);
    println("rotated[", i, ",", j, "] =", rotated[i, j]);
  }
}
`,
      hint: "Transpose: T[j, i] = M[i, j]. Clockwise 90° rotation: rotated[j, N - 1 - i] = M[i, j]. Use separate output arrays.",
    },
  ],
};
