import type { Tutorial } from "./index";

export const ch49: Tutorial = {
  id: "ch49",
  title: "Communication Patterns",
  description: "Inter-thread communication: broadcast, reduction, and all-to-all exchange patterns.",
  steps: [
    {
      title: "Broadcast (one to many)",
      content: `**Broadcast** sends one value to all threads. After a reduce or load phase, every thread reads the same scalar.

\`\`\`croqtile
float scalar = compute_global_value();
parallel {i} by [N] {
  output[i] = input[i] + scalar;
}
\`\`\`

On GPUs, broadcast happens through shared memory (one thread writes, all read) or constant memory. In Croqtile, compute the scalar sequentially, then use \`parallel\` to apply it everywhere.

Try the example — compute a global offset, then add it to every element in parallel.`,
      code: `__co__ void broadcast_pattern() {
  global float data[8];
  global float shifted[8];
  float offset = 100.0f;

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  parallel {i} by [8] {
    shifted[i] = data[i] + offset;
  }

  println("offset =", offset);
  parallel {i} by [8] {
    println("shifted[", i, "] =", shifted[i]);
  }
}
`,
      hint: "offset = 100. shifted[i] = (i+1) + 100, so shifted[0] = 101, shifted[7] = 108.",
    },
    {
      title: "Reduction (many to one)",
      content: `**Reduction** combines many values into one result — sum, product, min, max, or logical AND/OR.

Standard pattern in Croqtile:
\`\`\`croqtile
float acc = 0.0f;
foreach i in [0:N] {
  acc = acc + data[i];
}
\`\`\`

Real GPUs use tree reductions in shared memory (O(log N) depth). The sequential \`foreach\` is always correct for verification.

Try the example — sum, min, and max reduction over the same array in one pass.`,
      code: `__co__ void reduction_pattern() {
  global float data[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (float)((i * 3 + 1) % 10);
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }

  float total = 0.0f;
  float min_val = data[0];
  float max_val = data[0];
  foreach i in [0:N] {
    total = total + data[i];
    if (data[i] < min_val) {
      min_val = data[i];
    }
    if (data[i] > max_val) {
      max_val = data[i];
    }
  }

  println("sum =", total);
  println("min =", min_val);
  println("max =", max_val);
}
`,
      hint: "Values: 1,4,7,0,3,6,9,2. Sum = 32, min = 0, max = 9.",
    },
    {
      title: "All-to-all and butterfly patterns",
      content: `**All-to-all** exchange lets every thread send data to every other thread. A **butterfly** (hypercube) exchange achieves this in O(log N) steps:

Step 0: swap with partner at distance 1
Step 1: swap with partner at distance 2
...
After log₂(N) steps, every element has visited every position.

In Croqtile, model a 4-element butterfly with two swap stages in shared memory:

\`\`\`croqtile
// Stage 1: swap pairs (0↔1, 2↔3)
// Stage 2: swap pairs (0↔2, 1↔3)
\`\`\`

Try the example — two-stage butterfly exchange on four elements in shared memory.`,
      code: `__co__ void butterfly_exchange() {
  global float data[4];
  shared float buf[4];
  shared float tmp[4];

  parallel {i} by [4] {
    data[i] = (float)(i + 1);
  }

  dma(data[0:4], buf[0:4]);

  parallel {i} by [4] {
    println("initial buf[", i, "] =", buf[i]);
  }

  parallel {i} by [2] {
    tmp[i] = buf[i + 2];
    tmp[i + 2] = buf[i];
  }

  parallel {i} by [4] {
    buf[i] = tmp[i];
  }

  parallel {i} by [2] {
    tmp[i] = buf[i + 1];
    tmp[i + 1] = buf[i];
  }

  parallel {i} by [4] {
    buf[i] = tmp[i];
  }

  parallel {i} by [4] {
    println("after butterfly buf[", i, "] =", buf[i]);
  }
}
`,
      hint: "Initial [1,2,3,4]. After distance-2 swap: [3,4,1,2]. After distance-1 swap: [4,3,2,1].",
    },
  ],
};
