import type { Tutorial } from "./index";

export const ch17: Tutorial = {
  id: "ch17",
  title: "Rotate & Shuffle",
  description: "Use rotate and index arithmetic to shift, reverse, and permute arrays in parallel.",
  steps: [
    {
      title: "Circular shift with modular indexing",
      content: `A circular left shift moves every element one position to the left, wrapping the first element around to the last position.

**Key idea:** each thread \`i\` reads from index \`(i + 1) % N\`. The modulo operator handles the wrap-around — thread N-1 reads from index 0.

\`\`\`
parallel {i} by [N] {
  output[i] = input[(i + 1) % N];
}
\`\`\`

This is an embarrassingly parallel operation — no thread depends on another. Every thread independently computes its source index.

Try the example — it shifts [10, 20, 30, 40, 50] one position left, producing [20, 30, 40, 50, 10].`,
      code: `__co__ void circular_shift() {
  global int input[5];
  global int output[5];

  parallel {i} by [5] {
    input[i] = (i + 1) * 10;
  }

  parallel {i} by [5] {
    output[i] = input[(i + 1) % 5];
  }

  parallel {i} by [5] {
    println("output[", i, "] =", output[i]);
  }
}
`,
    },
    {
      title: "In-place array reversal",
      content: `Reversing an array in parallel is straightforward: each thread \`i\` writes to the mirrored position \`N - 1 - i\`.

\`\`\`
parallel {i} by [N] {
  reversed[i] = data[N - 1 - i];
}
\`\`\`

For an in-place reversal, you need a temporary buffer because reading and writing the same array in parallel creates a data race. Copy first, then write back.

**Important:** never read and write the same array in a single parallel block unless each thread accesses only its own index. Reversal violates this — thread 0 reads data[N-1], which thread N-1 also writes.

Try the example — it reverses [1, 2, 3, 4, 5, 6] via a shared temporary buffer.`,
      code: `__co__ void array_reverse() {
  global int data[6];
  shared int tmp[6];

  parallel {i} by [6] {
    data[i] = i + 1;
  }

  dma(data[0:6], tmp[0:6]);

  parallel {i} by [6] {
    data[i] = tmp[6 - 1 - i];
  }

  parallel {i} by [6] {
    println("data[", i, "] =", data[i]);
  }
}
`,
    },
    {
      title: "Even-odd permutation",
      content: `More complex permutations use index arithmetic to rearrange elements according to a pattern. A common one is the even-odd split: place all even-indexed elements first, then odd-indexed elements.

\`\`\`
parallel {i} by [N] {
  int src = (i < N/2) ? i * 2 : (i - N/2) * 2 + 1;
  output[i] = input[src];
}
\`\`\`

Threads 0 through N/2-1 pull from even indices (0, 2, 4, ...), and threads N/2 through N-1 pull from odd indices (1, 3, 5, ...).

This pattern appears in FFT butterfly operations and interleave/deinterleave steps in signal processing.

Try the example — it splits [A, B, C, D, E, F] into [A, C, E, B, D, F].`,
      code: `__co__ void even_odd_split() {
  global int input[6];
  global int output[6];

  parallel {i} by [6] {
    input[i] = (i + 1) * 10;
  }

  parallel {i} by [6] {
    int src;
    if (i < 3) {
      src = i * 2;
    } else {
      src = (i - 3) * 2 + 1;
    }
    output[i] = input[src];
  }

  parallel {i} by [6] {
    println("output[", i, "] =", output[i]);
  }
}
`,
    },
  ],
};
