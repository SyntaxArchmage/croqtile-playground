import type { Tutorial } from "./index";

export const ch19: Tutorial = {
  id: "ch19",
  title: "Multi-Dimensional Arrays",
  description: "Work with 3D and higher-dimensional arrays, row-major layout, and nested parallel access patterns.",
  steps: [
    {
      title: "3D array indexing with linearized access",
      content: `Croqtile supports arrays of any rank. Declare a 3D array with comma-separated sizes:

\`global float A[depth, rows, cols]\`

Access elements directly with \`A[i, j, k]\`, or compute a **linear index** for flat 1D storage.

**Row-major linear index** (last index varies fastest):
\`\`\`
idx = i * (rows * cols) + j * cols + k
\`\`\`

For \`A[2, 3, 4]\`, valid indices are \`i ∈ [0,2)\`, \`j ∈ [0,3)\`, \`k ∈ [0,4)\`, and the total element count is \`2 × 3 × 4 = 24\`.

Both \`A[i, j, k]\` and \`flat[idx]\` refer to the same memory layout when \`flat\` is the underlying 1D view.

Try the example — it fills a 2×3×4 volume and verifies direct vs linear indexing match.`,
      code: `__co__ void index_3d() {
  global float A[2, 3, 4];
  int rows = 3;
  int cols = 4;

  parallel {i, j, k} by [2, 3, 4] {
    A[i, j, k] = (float)(i * 12 + j * 4 + k);
  }

  parallel {i, j, k} by [2, 3, 4] {
    int idx = i * rows * cols + j * cols + k;
    float direct = A[i, j, k];
    println("A[", i, ",", j, ",", k, "] idx=", idx, "val=", direct);
  }
}
`,
      hint: "The linear index formula multiplies earlier dimensions by the product of all later dimension sizes.",
    },
    {
      title: "Row-major traversal patterns",
      content: `In **row-major** order, the last index (\`k\`) changes fastest as you walk through memory — just like C/C++ multidimensional arrays.

**Traversal strategies:**
- \`parallel {i, j, k}\` — all dimensions at once (embarrassingly parallel)
- Nested \`foreach\` loops — sequential row-major walk, good for reductions
- \`parallel {i, j}\` + \`foreach k\` — parallel over slices, sequential within each

For a 3D tensor \`A[D0, D1, D2]\`, iterating \`i\` outermost and \`k\` innermost visits contiguous memory blocks — the pattern GPUs prefer for coalesced access.

Try the example — it sums each row (fixed \`i\` and \`j\`, varying \`k\`) using sequential inner loops.`,
      code: `__co__ void row_major_sum() {
  global float A[2, 3, 4];
  global float row_sum[2, 3];

  parallel {i, j, k} by [2, 3, 4] {
    A[i, j, k] = (float)(i * 100 + j * 10 + k);
  }

  parallel {i, j} by [2, 3] {
    float sum = 0.0f;
    foreach k in [0:4] {
      sum = sum + A[i, j, k];
    }
    row_sum[i, j] = sum;
  }

  parallel {i, j} by [2, 3] {
    println("row_sum[", i, ",", j, "] =", row_sum[i, j]);
  }
}
`,
    },
    {
      title: "Nested parallel over multi-dimensional data",
      content: `For higher-dimensional data, you can nest \`parallel\` blocks — an outer loop over one dimension and an inner parallel block over the rest. This mirrors GPU thread-block structure.

**Pattern — outer parallel, inner parallel:**
\`\`\`
parallel {i} by [D0] {
  parallel {j, k} by [D1, D2] {
    A[i, j, k] = ...;
  }
}
\`\`\`

The outer dimension often corresponds to batch or depth slices; the inner block handles the 2D plane in parallel. Each \`(i, j, k)\` triple still maps to a unique thread.

Alternatively, flatten to a single \`parallel {i, j, k} by [D0, D1, D2]\` when all dimensions are independent — simpler and equally correct.

Try the example — nested parallel initializes a 2×3×4 tensor with a batch-outer pattern.`,
      code: `__co__ void nested_parallel_3d() {
  global float A[2, 3, 4];

  parallel {i} by [2] {
    parallel {j, k} by [3, 4] {
      A[i, j, k] = (float)((i + 1) * (j + 1) * (k + 1));
    }
  }

  parallel {i, j, k} by [2, 3, 4] {
    println("A[", i, ",", j, ",", k, "] =", A[i, j, k]);
  }
}
`,
    },
  ],
};
