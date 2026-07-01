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
    description: "parallel by thread indexing",
    code: `__co__ void parallel_demo() {
  parallel {i} by [4] {
    println("thread", i);
  }
}
`,
  },
  {
    id: "array-init",
    name: "Array Init",
    description: "Initialize an array with sequential values using parallel",
    code: `__co__ void array_init() {
  s32[8] data;

  parallel p by 8
    data.at(p) = p * 10;

  foreach i in 8
    println("data[", i, "] =", data.at(i));
}
`,
  },
  {
    id: "parallel-copy",
    name: "Parallel Copy",
    description: "Copy elements from one array to another in parallel",
    code: `__co__ void parallel_copy() {
  s32[8] src;
  s32[8] dst;

  parallel p by 8
    src.at(p) = (p + 1) * 10;

  parallel p by 8
    dst.at(p) = src.at(p);

  foreach i in 8
    println("dst[", i, "] =", dst.at(i));
}
`,
  },
  {
    id: "foreach-sequential",
    name: "Sequential Foreach",
    description: "Sequential iteration with foreach for accumulation and ordered output",
    code: `__co__ void foreach_demo() {
  s32[8] data;

  parallel p by 8
    data.at(p) = (p + 1) * 3;

  mutable int total = 0;
  foreach i in 8 {
    total = total + data.at(i);
    println("data[", i, "] =", data.at(i), "  running total =", total);
  }

  println("final total =", total);
}
`,
  },
  {
    id: "reduction",
    name: "Sum Reduction",
    description: "foreach loop sum accumulation",
    code: `__co__ void sum_reduction() {
  s32[8] data;

  parallel p by 8
    data.at(p) = p + 1;

  mutable int total = 0;
  foreach i in 8
    total = total + data.at(i);

  println("sum =", total);
}
`,
  },
  {
    id: "dot-product",
    name: "Dot Product",
    description: "Vector multiply-accumulate with foreach",
    code: `__co__ void dot_product() {
  s32[8] a;
  s32[8] b;

  parallel p by 8 {
    a.at(p) = p + 1;
    b.at(p) = p * 2;
  }

  mutable int dot = 0;
  foreach i in 8
    dot = dot + a.at(i) * b.at(i);

  println("dot product =", dot);
}
`,
  },
  {
    id: "find-max",
    name: "Find Maximum",
    description: "Conditional foreach reduction for maximum",
    code: `__co__ void find_max() {
  s32[8] data;

  parallel p by 8
    data.at(p) = (p * 7 + 3) % 20;

  foreach i in 8
    println("data[", i, "] =", data.at(i));

  mutable int maxVal = data.at(0);
  foreach i in 7 {
    if (data.at(i + 1) > maxVal)
      maxVal = data.at(i + 1);
  }

  println("max =", maxVal);
}
`,
  },
  {
    id: "reduction-pattern",
    name: "Min/Max Reduction",
    description: "Combined min/max reduction over an array with foreach",
    code: `__co__ void reduction_pattern() {
  s32[8] data;

  parallel p by 8
    data.at(p) = (p * 7 + 3) % 20;

  mutable int minVal = data.at(0);
  mutable int maxVal = data.at(0);
  foreach i in 7 {
    if (data.at(i + 1) < minVal)
      minVal = data.at(i + 1);
    if (data.at(i + 1) > maxVal)
      maxVal = data.at(i + 1);
  }

  println("min =", minVal, " max =", maxVal);
}
`,
  },
  {
    id: "prefix-sum",
    name: "Prefix Sum",
    description: "Classic inclusive prefix sum (scan) with foreach",
    code: `__co__ void prefix_sum() {
  s32[8] data;
  s32[8] prefix;

  parallel p by 8
    data.at(p) = p + 1;

  prefix.at(0) = data.at(0);
  foreach i in 7
    prefix.at(i + 1) = prefix.at(i) + data.at(i + 1);

  foreach i in 8
    println("prefix[", i, "] =", prefix.at(i));
}
`,
  },
  {
    id: "histogram",
    name: "Histogram",
    description: "Histogram counting with sequential accumulation",
    code: `__co__ void histogram() {
  s32[8] data;
  s32[4] bins;

  parallel p by 8
    data.at(p) = p % 4;

  parallel p by 4
    bins.at(p) = 0;

  foreach i in 8
    bins.at(data.at(i)) = bins.at(data.at(i)) + 1;

  foreach i in 4
    println("bin[", i, "] =", bins.at(i));
}
`,
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    description: "Sequential Fibonacci computation with foreach dependency chain",
    code: `__co__ void fibonacci() {
  s32[8] fib;

  fib.at(0) = 0;
  fib.at(1) = 1;
  foreach i in 6
    fib.at(i + 2) = fib.at(i + 1) + fib.at(i);

  foreach i in 8
    println("fib[", i, "] =", fib.at(i));
}
`,
  },
  {
    id: "conditional",
    name: "Conditional Logic",
    description: "if/else branching inside parallel blocks",
    code: `__co__ void classify() {
  s32[8] data;

  parallel p by 8
    data.at(p) = (p * 7 + 3) % 20;

  parallel p by 8 {
    if (data.at(p) < 5)
      println("data[", p, "] =", data.at(p), " -> LOW");
    else if (data.at(p) < 15)
      println("data[", p, "] =", data.at(p), " -> MID");
    else
      println("data[", p, "] =", data.at(p), " -> HIGH");
  }
}
`,
  },
  {
    id: "conditional-print",
    name: "Conditional Print",
    description: "if/else branching with println inside parallel threads",
    code: `__co__ void conditional_print() {
  s32[8] values;

  parallel p by 8
    values.at(p) = p + 1;

  parallel p by 8 {
    if (values.at(p) % 2 == 0)
      println("values[", p, "] =", values.at(p), " is even");
    else
      println("values[", p, "] =", values.at(p), " is odd");
  }
}
`,
  },
  {
    id: "conditional-processing",
    name: "Conditional Processing",
    description: "Predicate-based parallel filtering",
    code: `__co__ void even_odd() {
  s32[8] out;

  parallel p by 8 {
    if (p % 2 == 0)
      out.at(p) = p * 2;
    else
      out.at(p) = p * 2 + 1;
  }

  parallel p by 8 {
    if (p % 2 == 0)
      println("out[", p, "] =", out.at(p), " (even)");
    else
      println("out[", p, "] =", out.at(p), " (odd)");
  }
}
`,
  },
  {
    id: "ifelse",
    name: "If-Else Parallel",
    description: "Parallel threads with conditional value assignment",
    code: `__co__ void ifelse_test() {
  s32[8] arr;

  parallel p by 8 {
    if (p < 4)
      arr.at(p) = 0;
    else
      arr.at(p) = 1;
  }

  foreach i in 8
    println("arr[", i, "] =", arr.at(i));
}
`,
  },
  {
    id: "2d-parallel",
    name: "2D Parallel Grid",
    description: "parallel {i, j} by [N, M] 2D grid",
    code: `__co__ void grid_2d() {
  s32[4, 4] grid;

  parallel {i, j} by [4, 4]
    grid.at(i, j) = i * 10 + j;

  parallel {i, j} by [4, 4]
    println("grid[", i, ",", j, "] =", grid.at(i, j));
}
`,
  },
  {
    id: "array2d",
    name: "2D Array",
    description: "Two-dimensional array with foreach loops",
    code: `__co__ void array2d_test() {
  s32[3, 4] mat;

  foreach i in 3 {
    foreach j in 4
      mat.at(i, j) = i * 4 + j;
  }

  println(mat.at(0, 0));
  println(mat.at(0, 3));
  println(mat.at(1, 0));
  println(mat.at(2, 3));
}
`,
  },
  {
    id: "transpose",
    name: "Matrix Transpose",
    description: "2D index swapping for matrix transpose",
    code: `__co__ void transpose() {
  s32[4, 4] A;
  s32[4, 4] T;

  parallel {i, j} by [4, 4]
    A.at(i, j) = i * 10 + j;

  parallel {i, j} by [4, 4]
    T.at(j, i) = A.at(i, j);

  parallel {i, j} by [4, 4]
    println("T[", i, ",", j, "] =", T.at(i, j));
}
`,
  },
  {
    id: "matmul",
    name: "Matrix Multiply",
    description: "Parallel matrix multiply with foreach accumulation",
    code: `__co__ void matmul() {
  s32[4, 4] A;
  s32[4, 4] B;
  s32[4, 4] C;

  parallel {i, j} by [4, 4] {
    A.at(i, j) = i + j;
    B.at(i, j) = i * j;
    C.at(i, j) = 0;
  }

  foreach i in 4 {
    foreach j in 4 {
      mutable int sum = 0;
      foreach k in 4
        sum = sum + A.at(i, k) * B.at(k, j);
      C.at(i, j) = sum;
    }
  }

  println("C[0,0] =", C.at(0, 0));
  println("C[1,1] =", C.at(1, 1));
}
`,
  },
  {
    id: "matrix-diagonal",
    name: "Matrix Diagonal",
    description: "Extract main diagonal elements from a 2D matrix",
    code: `__co__ void matrix_diagonal() {
  s32[4, 4] M;
  s32[4] diag;

  parallel {i, j} by [4, 4]
    M.at(i, j) = i * 4 + j + 1;

  parallel p by 4
    diag.at(p) = M.at(p, p);

  foreach i in 4
    println("diag[", i, "] =", diag.at(i));
}
`,
  },
  {
    id: "pattern-fill",
    name: "Pattern Fill",
    description: "Fill a 2D array with a checkerboard pattern",
    code: `__co__ void pattern_fill() {
  s32[4, 4] grid;

  parallel {i, j} by [4, 4] {
    if ((i + j) % 2 == 0)
      grid.at(i, j) = 1;
    else
      grid.at(i, j) = 0;
  }

  parallel {i, j} by [4, 4]
    println("grid[", i, ",", j, "] =", grid.at(i, j));
}
`,
  },
  {
    id: "multi-dimensional",
    name: "Multi-Dimensional",
    description: "Extract and process a 2D submatrix from a larger matrix",
    code: `__co__ void multi_dimensional() {
  s32[4, 4] M;
  s32[2, 2] sub;

  parallel {i, j} by [4, 4]
    M.at(i, j) = i * 4 + j;

  parallel {i, j} by [2, 2]
    sub.at(i, j) = M.at(i + 1, j + 1);

  parallel {i, j} by [2, 2]
    println("sub[", i, ",", j, "] =", sub.at(i, j));
}
`,
  },
  {
    id: "nested-loops",
    name: "Nested Loops",
    description: "Nested foreach loops for sequential 2D iteration",
    code: `__co__ void nested_loops() {
  s32[3, 3] grid;

  foreach i in 3 {
    foreach j in 3
      grid.at(i, j) = i * 3 + j;
  }

  parallel {i, j} by [3, 3]
    println("grid[", i, ",", j, "] =", grid.at(i, j));
}
`,
  },
  {
    id: "nested-parallel",
    name: "Nested Parallel",
    description: "Nested parallel blocks for multi-level thread indexing",
    code: `__co__ void nested_parallel_test() {
  s32[12] result;

  parallel p by 3 {
    parallel q by 4 {
      int idx = p * 4 + q;
      result.at(idx) = idx * 10;
    }
  }

  println(result.at(0));
  println(result.at(5));
  println(result.at(11));
}
`,
  },
  {
    id: "multi-array",
    name: "Multi-Array",
    description: "Element-wise operations across multiple arrays in parallel",
    code: `__co__ void multi_array() {
  s32[8] a;
  s32[8] b;
  s32[8] c;

  parallel p by 8 {
    a.at(p) = p + 1;
    b.at(p) = (p + 1) * 10;
  }

  parallel p by 8
    c.at(p) = a.at(p) + b.at(p);

  foreach i in 8
    println("c[", i, "] =", c.at(i));
}
`,
  },
  {
    id: "dma",
    name: "DMA Transfer",
    description: "Full array DMA copy between global arrays",
    code: `__co__ void dma_test() {
  s32[4] src;
  s32[4] dst;

  parallel p by 4
    src.at(p) = (p + 1) * 100;

  f = dma.copy src => dst;

  foreach i in 4
    println("dst[", i, "] =", dst.at(i));
}
`,
  },
  {
    id: "async-dma",
    name: "Async DMA",
    description: "Asynchronous DMA copy with future and wait",
    code: `__co__ void async_dma_test() {
  s32[4] src;
  s32[4] dst;

  parallel p by 4
    src.at(p) = (p + 1) * 11;

  f = dma.copy.async src => dst;
  wait(f);

  foreach i in 4
    println("dst[", i, "] =", dst.at(i));
}
`,
  },
  {
    id: "stencil",
    name: "1D Stencil",
    description: "Neighbor averaging with boundary handling",
    code: `__co__ void stencil_1d() {
  s32[8] input;
  s32[8] output;

  parallel p by 8
    input.at(p) = p * 10;

  parallel p by 8 {
    if (p == 0 || p == 7)
      output.at(p) = input.at(p);
    else
      output.at(p) = (input.at(p - 1) + input.at(p) + input.at(p + 1)) / 3;
  }

  foreach i in 8
    println("smoothed[", i, "] =", output.at(i));
}
`,
  },
  {
    id: "scatter-write",
    name: "Scatter Write",
    description: "Parallel scatter writes to computed destination indices",
    code: `__co__ void scatter_write() {
  s32[8] src;
  s32[8] dst;

  parallel p by 8 {
    src.at(p) = (p + 1) * 10;
    dst.at(p) = 0;
  }

  parallel p by 8
    dst.at((p * 3) % 8) = src.at(p);

  foreach i in 8
    println("dst[", i, "] =", dst.at(i));
}
`,
  },
  {
    id: "gather-read",
    name: "Gather Read",
    description: "Parallel gather reads from computed source indices",
    code: `__co__ void gather_read() {
  s32[8] src;
  s32[8] dst;

  parallel p by 8
    src.at(p) = (p + 1) * 10;

  parallel p by 8
    dst.at(p) = src.at((p * 3) % 8);

  foreach i in 8
    println("dst[", i, "] =", dst.at(i));
}
`,
  },
  {
    id: "thread-id-math",
    name: "Thread ID Math",
    description: "Compute 2D row/col indices from a linear thread ID",
    code: `__co__ void thread_id_math() {
  s32[8] row;
  s32[8] col;
  int WIDTH = 4;

  parallel p by 8 {
    row.at(p) = p / WIDTH;
    col.at(p) = p % WIDTH;
  }

  foreach i in 8
    println("tid", i, "-> (", row.at(i), ",", col.at(i), ")");
}
`,
  },
  {
    id: "bitwise-ops",
    name: "Bitwise Operations",
    description: "Bit manipulation with AND, OR, shift, and XOR in parallel",
    code: `__co__ void bitwise_ops() {
  s32[8] data;
  s32[8] masked;
  s32[8] shifted;

  parallel p by 8
    data.at(p) = (p + 1) * 5;

  parallel p by 8 {
    masked.at(p) = data.at(p) & 7;
    shifted.at(p) = data.at(p) >> 1;
  }

  foreach i in 8
    println("data[", i, "] =", data.at(i), " &7 =", masked.at(i), " >>1 =", shifted.at(i));
}
`,
  },
  {
    id: "while-loop",
    name: "While Loop",
    description: "While loop for iterative computation (factorial)",
    code: `__co__ void while_test() {
  s32[1] counter;
  s32[1] result;
  counter.at(0) = 1;
  result.at(0) = 1;

  while (counter.at(0) <= 5) {
    result.at(0) = result.at(0) * counter.at(0);
    counter.at(0) = counter.at(0) + 1;
  }

  println("5! =", result.at(0));
}
`,
  },
  {
    id: "break-continue",
    name: "Break & Continue",
    description: "Loop control flow with break and continue",
    code: `__co__ void break_continue_test() {
  s32[1] sum;
  s32[1] i;
  sum.at(0) = 0;
  i.at(0) = 0;

  while (i.at(0) < 20) {
    i.at(0) = i.at(0) + 1;
    if (i.at(0) > 10)
      break;
    if (i.at(0) % 2 == 0)
      continue;
    sum.at(0) = sum.at(0) + i.at(0);
  }

  println("sum of odd 1..10 =", sum.at(0));
  println("stopped at i =", i.at(0));
}
`,
  },
  {
    id: "expressions",
    name: "Expressions",
    description: "Arithmetic, comparison, bitwise, and ternary expressions",
    code: `__co__ void expr_test() {
  s32[1] a;
  s32[1] b;
  a.at(0) = 7;
  b.at(0) = 3;

  println(a.at(0) + b.at(0));
  println(a.at(0) - b.at(0));
  println(a.at(0) * b.at(0));
  println(a.at(0) / b.at(0));
  println(a.at(0) % b.at(0));

  println(a.at(0) > b.at(0));
  println(a.at(0) < b.at(0));
  println(a.at(0) == b.at(0));

  s32[1] c;
  c.at(0) = (a.at(0) > 5) ? 100 : 200;
  println("ternary:", c.at(0));

  s32[1] e;
  e.at(0) = a.at(0) & 3;
  println("AND:", e.at(0));

  s32[1] f;
  f.at(0) = a.at(0) | 8;
  println("OR:", f.at(0));
}
`,
  },
  {
    id: "scope",
    name: "Scope & Variables",
    description: "Variable scoping with parallel blocks",
    code: `__co__ void scope_test() {
  int x = 10;
  s32[4] result;

  parallel p by 4
    result.at(p) = p * 2;

  println(result.at(2));
  println(x);
}
`,
  },
  {
    id: "two-pass",
    name: "Two-Pass",
    description: "Two-pass algorithm: first pass counts, second pass compacts results",
    code: `__co__ void two_pass() {
  s32[8] data;
  s32[8] result;

  parallel p by 8
    data.at(p) = (p + 1) * 3;

  mutable int count = 0;
  foreach i in 8 {
    if (data.at(i) > 10)
      count = count + 1;
  }

  mutable int write = 0;
  foreach i in 8 {
    if (data.at(i) > 10) {
      result.at(write) = data.at(i);
      write = write + 1;
    }
  }

  println("count =", count);
  foreach i in count
    println("result[", i, "] =", result.at(i));
}
`,
  },
  {
    id: "array-reduction",
    name: "Array Reduction",
    description: "Multi-stage parallel chunk reduction",
    code: `__co__ void array_reduction() {
  s32[16] data;
  s32[4] partial;

  parallel p by 16
    data.at(p) = p + 1;

  parallel blk by 4 {
    mutable int chunk_sum = 0;
    foreach i in 4
      chunk_sum = chunk_sum + data.at(blk * 4 + i);
    partial.at(blk) = chunk_sum;
  }

  mutable int total = 0;
  foreach i in 4
    total = total + partial.at(i);

  println("sum of 1..16 =", total);
}
`,
  },
  {
    id: "multi-stage-reduction",
    name: "Multi-Stage Reduction",
    description: "Three-stage pipeline for hierarchical sum reduction",
    code: `__co__ void multi_stage_reduction() {
  s32[16] data;
  s32[4] partial;
  s32[2] pair_sum;

  parallel p by 16
    data.at(p) = p + 1;

  parallel blk by 4 {
    mutable int chunk_sum = 0;
    foreach i in 4
      chunk_sum = chunk_sum + data.at(blk * 4 + i);
    partial.at(blk) = chunk_sum;
  }

  parallel p by 2
    pair_sum.at(p) = partial.at(p * 2) + partial.at(p * 2 + 1);

  mutable int total = 0;
  foreach i in 2
    total = total + pair_sum.at(i);

  println("sum of 1..16 =", total);
}
`,
  },
  {
    id: "nested-reduction",
    name: "Nested Reduction",
    description: "Hierarchical row/column sums with foreach",
    code: `__co__ void nested_reduction() {
  s32[4, 4] matrix;
  s32[4] row_sum;
  s32[4] col_sum;

  parallel {i, j} by [4, 4]
    matrix.at(i, j) = i * 4 + j + 1;

  foreach i in 4 {
    mutable int rsum = 0;
    foreach j in 4
      rsum = rsum + matrix.at(i, j);
    row_sum.at(i) = rsum;
  }

  foreach j in 4 {
    mutable int csum = 0;
    foreach i in 4
      csum = csum + matrix.at(i, j);
    col_sum.at(j) = csum;
  }

  foreach i in 4 {
    println("row_sum[", i, "] =", row_sum.at(i));
    println("col_sum[", i, "] =", col_sum.at(i));
  }
}
`,
  },
  {
    id: "pipeline",
    name: "Two-Stage Pipeline",
    description: "Two-stage processing with DMA copy",
    code: `__co__ void pipeline_demo() {
  s32[4] raw;
  s32[4] buf;
  s32[4] processed;

  parallel p by 4
    raw.at(p) = (p + 1) * 10;

  f = dma.copy raw => buf;

  parallel p by 4
    processed.at(p) = buf.at(p) * 2 + 1;

  foreach i in 4
    println("processed[", i, "] =", processed.at(i));
}
`,
  },
  {
    id: "coalesced-access",
    name: "Coalesced Access",
    description: "Coalesced contiguous reads vs strided access pattern",
    code: `__co__ void coalesced_access() {
  s32[32] data;
  s32[8] coalesced;
  s32[8] strided;

  parallel p by 32
    data.at(p) = p + 1;

  parallel p by 8
    coalesced.at(p) = data.at(p);

  parallel p by 8
    strided.at(p) = data.at(p * 4);

  foreach i in 8
    println("coalesced[", i, "] =", coalesced.at(i), " strided[", i, "] =", strided.at(i));
}
`,
  },
  {
    id: "type-casting",
    name: "Type Mixing",
    description: "Working with both integer and float types",
    code: `__co__ void type_mixing() {
  s32[8] integers;
  f32[8] floats;

  parallel p by 8
    integers.at(p) = p * 3 + 2;

  foreach i in 8
    println("int =", integers.at(i));
}
`,
  },
  {
    id: "local-memory",
    name: "Local Variables",
    description: "Per-thread local variables with parallel computation",
    code: `__co__ void local_vars() {
  s32[8] data;
  s32[8] out;

  parallel p by 8
    data.at(p) = p + 1;

  parallel p by 8 {
    mutable int local_val = data.at(p);
    local_val = local_val * local_val + 1;
    out.at(p) = local_val;
  }

  foreach i in 8
    println("out[", i, "] =", out.at(i));
}
`,
  },
  {
    id: "chunk-at",
    name: "Chunk Access",
    description: "Using .at() to extract scalar values from arrays",
    code: `__co__ void chunk_at_test() {
  s32[4] arr;

  parallel p by 4
    arr.at(p) = (p + 1) * 100;

  s32 elem0 = arr.at(0);
  s32 elem2 = arr.at(2);
  println(elem0);
  println(elem2);
}
`,
  },
  {
    id: "math-builtins",
    name: "Math Builtins",
    description: "Built-in math functions: alignup and aligndown",
    code: `__co__ void math_bif_test() {
  s32 a = 7;
  s32 b = 3;
  s32 c = __alignup(a, b);
  println("alignup(7,3) =", c);

  s32 d = __aligndown(a, b);
  println("aligndown(7,3) =", d);

  s32 e = (a + b - 1) / b;
  println("ceildiv(7,3) =", e);
}
`,
  },
  {
    id: "barrier-sync",
    name: "Phase Sync",
    description: "Multi-phase parallel computation with inter-phase dependency",
    code: `__co__ void barrier_sync() {
  s32[4] phase1;
  s32[4] phase2;

  parallel p by 4
    phase1.at(p) = p * 2;

  println("phase 1 complete:");
  foreach i in 4
    println("  phase1[", i, "] =", phase1.at(i));

  parallel p by 4
    phase2.at(p) = phase1.at(p) + phase1.at((p + 1) % 4);

  println("phase 2 (neighbor sum):");
  foreach i in 4
    println("  phase2[", i, "] =", phase2.at(i));
}
`,
  },
  {
    id: "mma-gemm",
    name: "MMA Matrix Multiply",
    description:
      "Matrix multiply-accumulate using mma.fill / mma.load / mma.exec / mma.store",
    code: `__co__ void mma_gemm() {
  s32[2, 3] A;
  s32[3, 2] B;
  s32[2, 2] C;

  // A = [[1,2,3],[4,5,6]]
  foreach i in 2
    foreach j in 3
      A.at(i, j) = i * 3 + j + 1;

  // B = [[1,2],[3,4],[5,6]]
  foreach i in 3
    foreach j in 2
      B.at(i, j) = i * 2 + j + 1;

  // C = A @ B using MMA operations
  mc = mma.fill.s32 0;
  ma = mma.load A;
  mb = mma.load B;
  mma.row.col mc, ma, mb;
  mma.store mc, C;

  println("C = A[2x3] @ B[3x2]:");
  foreach i in 2
    foreach j in 2
      println("  C[", i, ",", j, "] =", C.at(i, j));
}
`,
  },
  {
    id: "mma-accum",
    name: "MMA with Accumulation",
    description: "MMA with non-zero initial accumulator value",
    code: `__co__ void mma_accum() {
  s32[2, 2] A;
  s32[2, 2] B;
  s32[2, 2] C;

  // Identity-like inputs
  foreach i in 2
    foreach j in 2 {
      A.at(i, j) = 1;
      B.at(i, j) = 1;
    }

  // acc starts at 10, GEMM adds [[2,2],[2,2]]
  mc = mma.fill.s32 10;
  ma = mma.load A;
  mb = mma.load B;
  mma.row.col mc, ma, mb;
  mma.store mc, C;

  println("C = 10 + ones[2x2] @ ones[2x2]:");
  foreach i in 2
    foreach j in 2
      println("  C[", i, ",", j, "] =", C.at(i, j));
}
`,
  },
  {
    id: "mma-apply",
    name: "MMA + Apply",
    description:
      "GEMM then element-wise transform using apply block on fragment",
    code: `__co__ void mma_apply_demo() {
  s32[2, 3] A;
  s32[3, 2] B;
  s32[2, 2] C;

  // A = [[1,2,3],[4,5,6]]
  foreach i in 2
    foreach j in 3
      A.at(i, j) = i * 3 + j + 1;

  // B (column-major layout for row.col)
  foreach i in 3
    foreach j in 2
      B.at(i, j) = i + j * 3 + 1;

  mc = mma.fill.s32 0;
  ma = mma.load A;
  mb = mma.load B;
  mma.row.col mc, ma, mb;

  // Element-wise: double each value
  apply {i, j} in mc.span {
    mc.at(i, j) = mc.at(i, j) * 2;
  }

  mma.store mc, C;

  println("C = 2 * (A @ B):");
  foreach i in 2
    foreach j in 2
      println("  C[", i, ",", j, "] =", C.at(i, j));
}
`,
  },
];
