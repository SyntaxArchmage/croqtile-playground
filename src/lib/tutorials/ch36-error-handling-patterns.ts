import type { Tutorial } from "./index";

export const ch36: Tutorial = {
  id: "ch36",
  title: "Error Handling Patterns",
  description: "Robust error handling in Croqtile: preconditions with assert_true, bounds checking before array access, and graceful failure modes in parallel code.",
  steps: [
    {
      title: "Using assert_true for preconditions",
      content: `Production kernels should **fail fast** when inputs violate assumptions. \`assert_true(condition)\` aborts immediately with a clear error instead of producing silent garbage.

**Common preconditions:**
- Array length is positive and within capacity
- Tile size divides the problem dimension evenly (or tail handling is implemented)
- Scalar parameters are in a valid range

\`\`\`croqtile
assert_true(N > 0);
assert_true(tile_size <= N);
\`\`\`

Place assertions at the **entry point** of a kernel, before any parallel work touches memory. This catches bad caller state before thousands of threads propagate the mistake.

Try the example — it validates \`N\` and \`tile\` before initializing and summing data.`,
      code: `__co__ void assert_preconditions() {
  global float data[16];
  global float result[1];
  int N = 16;
  int tile = 4;

  assert_true(N > 0);
  assert_true(tile > 0);
  assert_true(N % tile == 0);

  parallel {i} by [16] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;
  int blocks = N / tile;
  foreach block in [0:blocks] {
    int base = block * tile;
    foreach k in [0:tile] {
      total = total + data[base + k];
    }
  }

  assert_true(total > 0.0f);
  result[0] = total;
  println("sum =", result[0]);
}
`,
      hint: "Assert N > 0, tile > 0, and N % tile == 0 before the parallel init. Sum of 1..16 is 136.",
    },
    {
      title: "Bounds checking before array access",
      content: `Whenever an index is **computed** — not taken directly from the loop variable — validate it before the access. Neighbor reads, permutations, and hash probes all need guards.

**Safe access pattern:**
\`\`\`croqtile
int idx = (i + offset) % N;
assert_true(idx >= 0);
assert_true(idx < N);
value = data[idx];
\`\`\`

For boundary threads (e.g. \`i == 0\`), use an explicit branch instead of asserting failure — handle the edge case, assert only on the general path.

**Rule:** parallel loop variable \`i\` is safe by construction; derived indices are not.

Try the example — it reads left neighbors with per-thread bounds checks.`,
      code: `__co__ void bounds_before_access() {
  global int data[8];
  global int left[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (i + 1) * 10;
  }

  parallel {i} by [8] {
    if (i == 0) {
      left[i] = 0;
    } else {
      int src = i - 1;
      assert_true(src >= 0);
      assert_true(src < N);
      left[i] = data[src];
    }
  }

  parallel {i} by [8] {
    println("left[", i, "] =", left[i]);
  }
}
`,
      hint: "Thread 0 has no left neighbor — store 0. Threads 1..7 read data[i-1] after asserting src is in [0, N).",
    },
    {
      title: "Graceful failure modes in parallel code",
      content: `Not every invalid input should crash the kernel. Sometimes you **skip work** or write a sentinel value while keeping other threads productive.

**Graceful patterns in parallel blocks:**
- \`if (valid) { compute; } else { output[i] = sentinel; }\`
- Per-thread \`assert_true\` only when the thread's own state is corrupt
- Sequential \`exec\` block to validate global state once, then parallel with guarded branches

\`\`\`croqtile
parallel {i} by [N] {
  if (mask[i] != 0) {
    output[i] = transform(input[i]);
  } else {
    output[i] = -1.0f;
  }
}
\`\`\`

Combine a global precondition assert with per-element guards so one bad element does not abort the entire launch.

Try the example — threads with a zero mask skip computation and write -1.`,
      code: `__co__ void graceful_parallel() {
  global float input[8];
  global int mask[8];
  global float output[8];

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
    if (i % 3 == 0) {
      mask[i] = 0;
    } else {
      mask[i] = 1;
    }
  }

  assert_true(true);

  parallel {i} by [8] {
    if (mask[i] != 0) {
      output[i] = input[i] * 2.0f;
      assert_true(output[i] > 0.0f);
    } else {
      output[i] = -1.0f;
    }
  }

  parallel {i} by [8] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "Indices 0, 3, 6 have mask=0 and get -1.0f. Others are doubled: 4, 6, 8, 10, 12, 14.",
    },
  ],
};
