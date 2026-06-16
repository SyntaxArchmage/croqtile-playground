import type { Tutorial } from "./index";

export const ch42: Tutorial = {
  id: "ch42",
  title: "Memory Access Patterns",
  description: "Efficient memory access: coalesced vs uncoalesced access, bank conflicts in shared memory, and memory alignment with padding.",
  steps: [
    {
      title: "Coalesced vs uncoalesced access",
      content: `A **coalesced** access pattern has consecutive threads read consecutive addresses — the hardware merges them into one wide memory transaction.

**Coalesced** — thread \`i\` reads \`data[i]\`:
\`\`\`croqtile
parallel {i} by [8] {
  val = data[i];
}
\`\`\`

**Uncoalesced** — strided or permuted indices waste bandwidth:
\`\`\`croqtile
parallel {i} by [8] {
  val = data[i * 4];  // large gaps between addresses
}
\`\`\`

Prefer contiguous indexing in \`parallel\` loops. Use \`dma()\` for bulk contiguous transfers instead of scattered global reads.

Try the example — compare coalesced (index \`i\`) vs uncoalesced (index \`i*4\`) reads.`,
      code: `__co__ void coalesced_vs_uncoalesced() {
  global float data[32];
  global float coalesced[8];
  global float uncoalesced[8];

  parallel {i} by [32] {
    data[i] = (float)(i + 1);
  }

  parallel {i} by [8] {
    coalesced[i] = data[i];
  }

  parallel {i} by [8] {
    uncoalesced[i] = data[i * 4];
  }

  parallel {i} by [8] {
    println("coalesced[", i, "] =", coalesced[i],
            "uncoalesced[", i, "] =", uncoalesced[i]);
  }
}
`,
      hint: "coalesced reads 1..8. uncoalesced reads data[0,4,8,12,16,20,24,28] → 1,5,9,13,17,21,25,29.",
    },
    {
      title: "Bank conflicts in shared memory",
      content: `Shared memory is divided into **32 banks**. When threads in a warp access different addresses that map to the same bank, the hardware serializes those accesses — a **bank conflict**.

**Conflict-prone** — stride-2 access:
\`\`\`croqtile
parallel {i} by [8] {
  val = buf[i * 2];  // threads may collide on same banks
}
\`\`\`

**Conflict-free** — consecutive access:
\`\`\`croqtile
parallel {i} by [8] {
  val = buf[i];  // thread i → bank i mod 32
}
\`\`\`

When strided patterns are unavoidable (matrix transpose, FFT), pad array dimensions so adjacent threads hit different banks.

Try the example — consecutive indexing avoids bank conflicts during the scale step.`,
      code: `__co__ void bank_conflicts() {
  global float data[8];
  shared float buf[8];
  global float result[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  dma(data[0:8], buf[0:8]);

  parallel {i} by [8] {
    result[i] = buf[i] * 3.0f;
  }

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
      hint: "Each thread reads buf[i] consecutively — no bank conflicts. Values 1..8 tripled → 3,6,...,24.",
    },
    {
      title: "Memory alignment and padding",
      content: `Arrays stored in memory should be **aligned** so that consecutive threads access cache-line-friendly addresses. **Padding** adds unused elements to break bad stride patterns.

For a matrix stored row-major, transposed access reads columns — each thread jumps by \`rows\` elements (strided). Padding the row stride to an odd multiple of 32 breaks bank conflicts:

\`\`\`croqtile
int padded_cols = cols + 1;  // pad to avoid stride-N bank conflicts
shared float tile[rows, padded_cols];
\`\`\`

In Croqtile, model padding by using a wider array and skipping the pad column during writes.

Try the example — store an 8-element array with padding, then access only the valid slots.`,
      code: `__co__ void alignment_padding() {
  global float input[8];
  shared float padded[10];
  global float output[8];
  int valid = 8;
  int stride = 10;

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
  }

  dma(input[0:8], padded[0:8]);

  padded[0] = 0.0f;

  parallel {i} by [8] {
    output[i] = padded[i];
  }

  parallel {i} by [8] {
    println("output[", i, "] =", output[i], "(stride=", stride, ")");
  }
}
`,
      hint: "Pad slot 0 cleared to 0. Slots 1..7 hold input values 2..8.",
    },
  ],
};
