import type { Tutorial } from "./index";

export const ch46: Tutorial = {
  id: "ch46",
  title: "Atomic Operations",
  description: "Understanding atomics in parallel programming: race conditions, safe accumulation, and compare-and-swap patterns.",
  steps: [
    {
      title: "Race conditions without atomics",
      content: `When multiple threads write to the **same memory location** without coordination, the result is undefined — a **race condition**.

\`\`\`croqtile
parallel {i} by [N] {
  counter = counter + 1;  // unsafe: all threads read/write the same slot
}
\`\`\`

In the mock interpreter, parallel blocks run sequentially for verification, so races may not appear. On real GPUs, only the last write (or a partial sum) survives.

**Safe alternatives:**
- Each thread writes to its **own** slot, then reduce sequentially
- Use **atomic** operations (real GPUs) or model them with \`foreach\`

Try the example — each thread increments a private slot, then a sequential pass sums them correctly.`,
      code: `__co__ void race_condition_demo() {
  global int per_thread[4];
  global int counter;
  int N = 4;

  counter = 0;

  parallel {i} by [4] {
    per_thread[i] = 1;
  }

  foreach i in [0:N] {
    counter = counter + per_thread[i];
  }

  println("counter =", counter);
  parallel {i} by [4] {
    println("per_thread[", i, "] =", per_thread[i]);
  }
}
`,
      hint: "Each thread writes per_thread[i] = 1 independently. The foreach fold gives counter = 4.",
    },
    {
      title: "Using atomic add for safe accumulation",
      content: `**Atomic add** guarantees that concurrent increments to one location are all applied — no updates are lost.

On real GPUs:
\`\`\`croqtile
// atomicAdd(&total, value);
\`\`\`

In Croqtile, model atomic accumulation with a sequential \`foreach\` after parallel initialization — always correct for verification:

\`\`\`croqtile
parallel {i} by [N] {
  partial[i] = compute(i);
}
float total = 0.0f;
foreach i in [0:N] {
  total = total + partial[i];  // safe fold
}
\`\`\`

This pattern appears in histograms, dot products, and any global counter. Try the example — parallel partial sums folded into one total.`,
      code: `__co__ void atomic_add_pattern() {
  global float partial[8];
  global float data[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
    partial[i] = data[i] * 2.0f;
  }

  float total = 0.0f;
  foreach i in [0:N] {
    total = total + partial[i];
  }

  println("total =", total);
  parallel {i} by [8] {
    println("partial[", i, "] =", partial[i]);
  }
}
`,
      hint: "partial[i] = 2*(i+1). Sum of 2,4,6,...,16 = 72.",
    },
    {
      title: "Compare-and-swap patterns",
      content: `**Compare-and-swap (CAS)** atomically updates a value only if it still equals an expected value:

\`\`\`
if (old == expected) { old = desired; return true; }
else { return false; }
\`\`\`

Use cases:
- **Lock-free max:** repeatedly CAS until you win the comparison
- **Linked-list insert:** CAS the next pointer only if it hasn't changed
- **Min/max tracking:** CAS when a thread finds a new extremum

In Croqtile, model CAS with a sequential \`foreach\` that conditionally updates a shared variable:

\`\`\`croqtile
foreach i in [0:N] {
  if (data[i] > max_val) {
    max_val = data[i];
  }
}
\`\`\`

Try the example — find the maximum using a sequential CAS-like update loop.`,
      code: `__co__ void compare_and_swap_max() {
  global float data[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (float)((i * 7 + 3) % 10);
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }

  float max_val = data[0];
  foreach i in [1:N] {
    if (data[i] > max_val) {
      max_val = data[i];
    }
  }

  println("max =", max_val);
}
`,
      hint: "Values: 3,0,7,4,1,8,5,2. Maximum is 8.",
    },
  ],
};
