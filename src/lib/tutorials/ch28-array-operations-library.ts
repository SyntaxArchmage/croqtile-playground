import type { Tutorial } from "./index";

export const ch28: Tutorial = {
  id: "ch28",
  title: "Array Operations Library",
  description: "Build reusable array utilities: copy and fill helpers, map and filter patterns, and reduce and scan operations.",
  steps: [
    {
      title: "Array copy and fill functions",
      content: `Start a reusable array library with **copy** and **fill** helpers at file scope. These wrap the per-element logic you call from \`parallel\` blocks.

**Fill helper:** \`fill_element(i, base)\` returns \`base + i\` — each thread writes one slot.

**Copy helper:** \`copy_element(x)\` returns \`x\` unchanged — keeps the map step explicit and reusable.

\`\`\`croqtile
float fill_element(int i, float base) {
  return base + (float)i;
}

parallel {i} by [N] {
  arr[i] = fill_element(i, 10.0f);
}
\`\`\`

Extract helpers so \`__co__\` entry points stay readable: init with fill, transform, then copy results to an output buffer.

Try the example — it fills an array with indices, copies to a second buffer, then prints both.`,
      code: `float fill_element(int i, float base) {
  return base + (float)i;
}

float copy_element(float x) {
  return x;
}

__co__ void copy_and_fill() {
  global float source[4];
  global float backup[4];
  int N = 4;

  parallel {i} by [4] {
    source[i] = fill_element(i, 10.0f);
  }

  parallel {i} by [4] {
    backup[i] = copy_element(source[i]);
  }

  parallel {i} by [4] {
    println("source[", i, "] =", source[i]);
    println("backup[", i, "] =", backup[i]);
  }
}
`,
      hint: "Define scalar helpers at file scope. fill_element returns base + i; copy_element passes through source[i] into backup[i].",
    },
    {
      title: "Array map and filter patterns",
      content: `**Map** applies a function to every element independently. **Filter** keeps elements that pass a predicate — store matching values and a running count.

Library-style helpers take scalars and are called inside \`parallel\` blocks:

\`\`\`croqtile
float map_square(float x) {
  return x * x;
}

int filter_positive(float x) {
  if (x > 0.0f) { return 1; }
  return 0;
}
\`\`\`

Map is a single parallel pass. Filter often needs two phases: parallel classification, then a sequential compaction step with \`foreach\`.

Try the example — it maps values through \`map_square\`, then counts how many inputs were positive with \`filter_positive\`.`,
      code: `float map_square(float x) {
  return x * x;
}

int filter_positive(float x) {
  if (x > 0.0f) {
    return 1;
  }
  return 0;
}

__co__ void map_and_filter() {
  global float data[5];
  global float mapped[5];
  global int flags[5];
  int N = 5;

  parallel {i} by [5] {
    data[i] = (float)(i - 2);
  }

  parallel {i} by [5] {
    mapped[i] = map_square(data[i]);
    flags[i] = filter_positive(data[i]);
  }

  int positive_count = 0;
  foreach i in [0:5] {
    positive_count = positive_count + flags[i];
  }

  parallel {i} by [5] {
    println("mapped[", i, "] =", mapped[i], "flag =", flags[i]);
  }
  println("positive_count =", positive_count);
}
`,
      hint: "Call map_square and filter_positive inside parallel {i}. Use foreach to sum flags into positive_count.",
    },
    {
      title: "Array reduce and scan operations",
      content: `**Reduce** collapses an array to one scalar (sum, max, product). **Scan** (prefix sum) produces running totals — each output slot holds the sum of all elements up to and including the current index.

**Reduce** — sequential \`foreach\` is the simplest correct approach in the playground:

\`\`\`croqtile
float total = 0.0f;
foreach i in [0:N] {
  total = total + arr[i];
}
\`\`\`

**Inclusive scan** — seed \`prefix[0]\`, then accumulate:

\`\`\`croqtile
prefix[0] = data[0];
foreach i in [1:N] {
  prefix[i] = prefix[i - 1] + data[i];
}
\`\`\`

Try the example — it reduces to a total sum, then builds an inclusive prefix scan.`,
      code: `float add_term(float a, float b) {
  return a + b;
}

__co__ void reduce_and_scan() {
  global float data[4];
  global float prefix[4];
  int N = 4;

  parallel {i} by [4] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;
  foreach i in [0:4] {
    total = add_term(total, data[i]);
  }

  prefix[0] = data[0];
  foreach i in [1:4] {
    prefix[i] = add_term(prefix[i - 1], data[i]);
  }

  println("reduce_sum =", total);
  parallel {i} by [4] {
    println("prefix[", i, "] =", prefix[i]);
  }
}
`,
      hint: "Reduce with foreach over [0:4]. Inclusive scan: prefix[0] = data[0], then foreach i in [1:4] adds data[i] to prefix[i-1].",
    },
  ],
};
