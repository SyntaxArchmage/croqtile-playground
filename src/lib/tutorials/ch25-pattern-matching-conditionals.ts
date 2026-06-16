import type { Tutorial } from "./index";

export const ch25: Tutorial = {
  id: "ch25",
  title: "Pattern Matching & Conditionals",
  description: "Advanced conditional patterns: nested if/else initialization, parallel range bucketing, and multi-way branching with compound conditions.",
  steps: [
    {
      title: "Pattern-based initialization with nested if/else",
      content: `Use **nested if/else** inside \`parallel\` to assign values by index pattern. Each thread picks a branch independently — analogous to GPU thread divergence, but correct for independent per-element setup.

**Three-way pattern by index mod 3:**
\`\`\`croqtile
parallel {i} by [N] {
  if (i % 3 == 0) {
    data[i] = 100;
  } else if (i % 3 == 1) {
    data[i] = 200;
  } else {
    data[i] = 300;
  }
}
\`\`\`

Nest further when a value depends on **two** conditions — e.g. quadrant or parity plus range. Keep branches short; heavy work after initialization should share the same path when possible.

Try the example: indices 0, 3, 6 get 100; 1, 4, 7 get 200; 2, 5 get 300.`,
      code: `__co__ void pattern_init() {
  global int data[8];

  parallel {i} by [8] {
    if (i % 3 == 0) {
      data[i] = 100;
    } else if (i % 3 == 1) {
      data[i] = 200;
    } else {
      data[i] = 300;
    }
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
      hint: "Each parallel thread evaluates its own if/else chain. i % 3 selects one of three initialization branches.",
    },
    {
      title: "Range checking and bucketing in parallel",
      content: `**Range bucketing** assigns each element to a category based on its value. Launch \`parallel {i} by [N]\` and compare \`data[i]\` against thresholds — every thread classifies its own slot without a sequential scan.

**Parallel bucket assignment:**
\`\`\`croqtile
parallel {i} by [N] {
  if (data[i] < 10) {
    bucket[i] = 0;       // low
  } else if (data[i] < 20) {
    bucket[i] = 1;       // mid
  } else {
    bucket[i] = 2;       // high
  }
}
\`\`\`

This is a **map** pattern: no dependencies between elements. For histogram counts, follow with a sequential \`foreach\` over buckets or atomic updates. For labeling, parallel if/else is enough.

Try the example — each value is tagged low (0), mid (1), or high (2) in parallel.`,
      code: `__co__ void range_bucketing() {
  global int data[8];
  global int bucket[8];

  parallel {i} by [8] {
    data[i] = (i * 7 + 3) % 25;
  }

  parallel {i} by [8] {
    if (data[i] < 8) {
      bucket[i] = 0;
    } else if (data[i] < 16) {
      bucket[i] = 1;
    } else {
      bucket[i] = 2;
    }
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i], "-> bucket", bucket[i]);
  }
}
`,
      hint: "Compare data[i] against fixed thresholds inside parallel. Each thread writes its own bucket[i] — no shared state needed for labeling.",
    },
    {
      title: "Multi-way branching with complex conditions",
      content: `Combine **multiple predicates** with \`&&\`, \`||\`, and nested \`else if\` for fine-grained control. Useful for boundary guards, quadrant selection, and filtered processing.

**Complex guard — process only in-range, non-zero values:**
\`\`\`croqtile
parallel {i} by [N] {
  if (i < 2 || i > 5) {
    tag[i] = 0;          // skip zone
  } else if (data[i] == 0) {
    tag[i] = 1;          // zero
  } else if (data[i] > 10 && data[i] < 20) {
    tag[i] = 2;          // sweet spot
  } else {
    tag[i] = 3;          // other
  }
}
\`\`\`

Order matters: put the most selective or cheapest checks first. Divergent branches are fine when each thread's path is independent.

Try the example — a four-way tag based on index bounds, zero check, and value range.`,
      code: `__co__ void multiway_branch() {
  global int data[8];
  global int tag[8];

  parallel {i} by [8] {
    data[i] = (i * 5 + 1) % 22;
  }

  parallel {i} by [8] {
    if (i < 2 || i > 5) {
      tag[i] = 0;
    } else if (data[i] == 0) {
      tag[i] = 1;
    } else if (data[i] > 10 && data[i] < 20) {
      tag[i] = 2;
    } else {
      tag[i] = 3;
    }
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i], "-> tag", tag[i]);
  }
}
`,
      hint: "Chain else if with compound conditions (&&, ||). Boundary guards (i < 2 || i > 5) short-circuit before value checks.",
    },
  ],
};
