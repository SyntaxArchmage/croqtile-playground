import type { Tutorial } from "./index";

export const ch50: Tutorial = {
  id: "ch50",
  title: "Putting It All Together: Mini Project",
  description: "Building a complete application: problem specification, kernel implementation, and testing with optimization.",
  steps: [
    {
      title: "Problem specification and data layout",
      content: `Before writing kernels, define the **problem** and **data layout**:

**Project:** Normalize a score vector into a probability distribution — \`output[i] = data[i] / Σ data[j]\`

**Data layout:**
- \`global float input[N]\` — raw scores (must be non-negative)
- \`global float output[N]\` — normalized probabilities summing to 1.0

**Pipeline:**
1. Initialize scores in parallel
2. Sum all scores (reduce)
3. Divide each score by the sum (broadcast + parallel)

Try the example — set up the data arrays and print the input vector.`,
      code: `__co__ void normalize_setup() {
  global float input[4];
  int N = 4;

  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 2);
  }

  println("Normalize input (N =", N, "):");
  parallel {i} by [4] {
    println("  input[", i, "] =", input[i]);
  }
}
`,
      hint: "Input vector is [2, 4, 6, 8]. Sum is 20 — these become probabilities in later steps.",
    },
    {
      title: "Kernel implementation",
      content: `Implement the full normalization kernel combining reduce and broadcast:

\`\`\`croqtile
// 1. Reduce sum
float total = 0.0f;
foreach i in [0:N] { total = total + input[i]; }

// 2. Normalize in parallel
parallel {i} by [N] { output[i] = input[i] / total; }
\`\`\`

Each stage uses a different parallel pattern — map for init, reduce for sum, map for divide.

Try the example — normalize [2, 4, 6, 8] into probabilities.`,
      code: `__co__ void normalize_kernel() {
  global float input[4];
  global float output[4];
  int N = 4;

  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 2);
  }

  float total = 0.0f;
  foreach i in [0:N] {
    total = total + input[i];
  }

  parallel {i} by [4] {
    output[i] = input[i] / total;
  }

  println("total =", total);
  parallel {i} by [4] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "total = 20. output = [0.1, 0.2, 0.3, 0.4]. Probabilities sum to 1.0.",
    },
    {
      title: "Testing and optimization",
      content: `After implementing a kernel, **verify** and **optimize**:

**Testing checklist:**
1. Print intermediate values (total, per-element output)
2. Check invariants (probabilities sum to 1.0)
3. Test edge cases (all equal inputs, single large value)

**Optimization opportunities:**
- Use DMA to load input into shared buffer before parallel divide
- Pipeline load → reduce → store for larger vectors
- Fuse reduce and normalize when data fits in shared memory

Try the example — optimized normalization with shared memory staging and invariant checks.`,
      code: `__co__ void normalize_optimized() {
  global float input[4];
  global float output[4];
  shared float buf[4];
  int N = 4;

  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 2);
  }

  dma(input[0:4], buf[0:4]);

  float total = 0.0f;
  foreach i in [0:N] {
    total = total + buf[i];
  }

  parallel {i} by [4] {
    output[i] = buf[i] / total;
  }

  float check_sum = 0.0f;
  foreach i in [0:N] {
    check_sum = check_sum + output[i];
  }

  println("total =", total);
  println("check_sum =", check_sum);

  parallel {i} by [4] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "check_sum should be 1.0. DMA loads input into shared buf before normalize.",
    },
  ],
};
