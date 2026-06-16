import type { Tutorial } from "./index";

export const ch18: Tutorial = {
  id: "ch18",
  title: "Error Handling & Assertions",
  description: "Use assert_true and defensive checks to catch invalid state early in Croqtile kernels.",
  steps: [
    {
      title: "Using assert_true for runtime checks",
      content: `Croqtile provides \`assert_true(condition)\` to abort execution when a condition is false. Use it to enforce invariants that must hold before and after computation.

**When to assert:**
- Preconditions — array length matches expected size
- Postconditions — computed result satisfies a known property
- Impossible branches — logic that should never run

\`\`\`
assert_true(N > 0);
assert_true(sum >= 0.0f);
\`\`\`

Unlike silent failures, a failed assertion stops immediately with a clear error — much easier to debug than garbage output.

Try the example — it initializes data, checks the length, then verifies the sum is positive.`,
      code: `__co__ void assert_basics() {
  global float data[6];
  int N = 6;

  assert_true(N > 0);

  parallel {i} by [6] {
    data[i] = (float)(i + 1);
  }

  float sum = 0.0f;
  foreach i in [0:6] {
    sum = sum + data[i];
  }

  assert_true(sum > 0.0f);
  println("sum =", sum);
}
`,
      hint: "Place assert_true before the parallel block to validate N, and after the reduction to validate the result.",
    },
    {
      title: "Validating array bounds and indices",
      content: `Defensive programming means validating indices **before** accessing memory. Out-of-bounds reads and writes are a top cause of GPU kernel bugs.

**Pattern — guard before access:**
\`\`\`
if (idx >= 0 && idx < N) {
  value = data[idx];
} else {
  assert_true(false);
}
\`\`\`

For a known-safe parallel loop, each thread \`i\` already satisfies \`0 <= i < N\`. Assertions become valuable when indices are computed — for example, \`(i + offset) % N\` or neighbor access \`i - 1\`.

**Rule:** assert the index is in range whenever it is derived from arithmetic rather than the loop variable directly.

Try the example — it uses a safe neighbor read with an explicit bounds check.`,
      code: `__co__ void bounds_check() {
  global int data[8];
  global int neighbors[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = i + 10;
  }

  parallel {i} by [8] {
    int src = i - 1;
    if (i == 0) {
      neighbors[i] = data[i];
    } else {
      assert_true(src >= 0);
      assert_true(src < N);
      neighbors[i] = data[src];
    }
  }

  parallel {i} by [8] {
    println("neighbors[", i, "] =", neighbors[i]);
  }
}
`,
    },
    {
      title: "Combining assertions with parallel execution",
      content: `Every thread in a \`parallel\` block can run its own assertions independently. This is ideal for verifying per-element invariants after a computation.

**Pattern — assert inside parallel:**
\`\`\`
parallel {i} by [N] {
  output[i] = input[i] * 2.0f;
  assert_true(output[i] >= 0.0f);
}
\`\`\`

Each thread checks only its own output slot — no races, no shared state. Combine with a sequential assertion on global scalars (like a total count or sum) computed via \`foreach\`.

**Best practice:** assert postconditions in the same parallel block that writes the data, so the check is right next to the computation.

Try the example — each thread doubles its element and asserts the result is even.`,
      code: `__co__ void parallel_assert() {
  global int data[8];
  global int doubled[8];

  parallel {i} by [8] {
    data[i] = i + 1;
  }

  parallel {i} by [8] {
    doubled[i] = data[i] * 2;
    assert_true(doubled[i] % 2 == 0);
    assert_true(doubled[i] > 0);
  }

  int count = 0;
  foreach i in [0:8] {
    if (doubled[i] > 0) {
      count = count + 1;
    }
  }
  assert_true(count == 8);

  parallel {i} by [8] {
    println("doubled[", i, "] =", doubled[i]);
  }
}
`,
    },
  ],
};
