import type { Tutorial } from "./index";

export const ch15: Tutorial = {
  id: "ch15",
  title: "Common Pitfalls",
  description: "Avoid the most frequent GPU programming bugs: races, off-by-one slices, and uninitialized shared memory.",
  steps: [
    {
      title: "Race Conditions When Multiple Threads Write to the Same Location",
      content: `When two or more threads write to the same memory address without synchronization, the result is **undefined** — a race condition.

**Bug — parallel writes to a shared accumulator:**
\`\`\`
parallel {i} by [8] {
  total = total + data[i];  // every thread races on total!
}
\`\`\`

Each thread reads \`total\`, adds its value, and writes back — but other threads may overwrite each other's updates.

**Fix — use sequential reduction or per-thread partial sums:**
\`\`\`
int running = 0;
foreach i in [0:8] {
  running = running + data[i];
}
\`\`\`

Rule: only one thread should write to a given location at a time, unless you use atomic operations or explicit synchronization.

Try the example — it shows the safe sequential sum versus printing per-thread partial reads.`,
      code: `__co__ void avoid_races() {
  global int data[8];

  parallel {i} by [8] {
    data[i] = i + 1;
  }

  // Safe: sequential reduction — no races
  int total = 0;
  foreach i in [0:8] {
    total = total + data[i];
  }
  println("safe total =", total);

  // Each thread writes to its OWN slot — also safe
  global int partial[8];
  parallel {i} by [8] {
    partial[i] = data[i] * 2;
  }

  parallel {i} by [8] {
    println("partial[", i, "] =", partial[i]);
  }
}
`,
    },
    {
      title: "Off-by-One Errors in Slice Bounds",
      content: `Slice notation \`array[start:end]\` uses an **exclusive** end index. An off-by-one mistake is the most common DMA bug.

For an array of length 8, valid indices are 0–7. The full slice is \`[0:8]\`, not \`[0:7]\`.

**Wrong — misses the last element:**
\`\`\`
dma(data[0:7], buf[0:7]);  // only copies 7 elements!
\`\`\`

**Correct — copies all 8:**
\`\`\`
dma(data[0:8], buf[0:8]);
\`\`\`

When tiling, compute offsets carefully: tile \`t\` starting at \`t * TILE\` with length \`TILE\`, ending at \`offset + TILE\` (exclusive).

Try the example — it compares a truncated slice against the full transfer.`,
      code: `__co__ void slice_bounds() {
  global float data[8];
  shared float buf[8];

  parallel {i} by [8] {
    data[i] = (float)((i + 1) * 10);
  }

  // Correct: [0:8] copies all 8 elements
  dma(data[0:8], buf[0:8]);

  println("--- Full transfer (8 elements) ---");
  parallel {i} by [8] {
    println("buf[", i, "] =", buf[i]);
  }

  // Off-by-one: [0:7] would leave buf[7] uninitialized
  println("end index 8 is exclusive — last copied index is 7");
}
`,
    },
    {
      title: "Forgetting to Initialize Shared Memory",
      content: `\`shared\` arrays are **not** zero-initialized. Reading from shared memory before writing or DMA-ing into it gives garbage values.

**Bug — compute before loading:**
\`\`\`
shared float buf[8];
parallel {i} by [8] {
  result[i] = buf[i] * 2;  // buf[i] is uninitialized!
}
\`\`\`

**Fix — always initialize via DMA or explicit writes:**
\`\`\`
dma(data[0:8], buf[0:8]);  // load from global first
parallel {i} by [8] {
  result[i] = buf[i] * 2;
}
\`\`\`

Best practice: after declaring shared memory, either DMA data in or have threads write known values before any read.

Try the example — it DMAs global data into shared memory before computing.`,
      code: `__co__ void init_shared() {
  global float data[8];
  shared float buf[8];
  global float result[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  // MUST load shared memory before reading it
  dma(data[0:8], buf[0:8]);

  parallel {i} by [8] {
    result[i] = buf[i] + 100.0f;
  }

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
    },
  ],
};
