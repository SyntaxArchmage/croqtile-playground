import type { Tutorial } from "./index";

export const ch02: Tutorial = {
  id: "ch02",
  title: "Parallel Execution",
  description: "Learn how Croqtile maps work to GPU threads.",
  steps: [
    {
      title: "parallel_by basics",
      content: `The \`parallel\` block is Croqtile's core primitive. It launches multiple threads that execute the body simultaneously.

\`parallel {i} by [N]\` creates N threads, each with a unique thread index \`i\` from 0 to N-1.

On a GPU, these become real parallel threads. In the mock interpreter, they execute sequentially for correctness checking.`,
      code: `__co__ void parallel_basic() {
  parallel {i} by [8] {
    println("thread", i);
  }
}
`,
    },
    {
      title: "Multi-dimensional parallelism",
      content: `You can use multiple indices for 2D or 3D parallelism:

\`parallel {i, j} by [M, N]\` creates M×N threads.

This maps naturally to GPU thread blocks where \`i\` is the block dimension and \`j\` is the thread dimension.`,
      code: `__co__ void parallel_2d() {
  parallel {i, j} by [2, 4] {
    println("(", i, ",", j, ")");
  }
}
`,
    },
    {
      title: "Using parallel indices for computation",
      content: `Parallel indices are used to partition work. Each thread operates on its own slice of data.

Try changing the computation — for example, compute cubes instead of squares:

\`\`\`croqtile
__co__ void cubes() {
  global float data[8];
  parallel {i} by [8] {
    data[i] = (float)(i * i * i);
  }
  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
\`\`\``,
      code: `__co__ void parallel_compute() {
  global float data[16];

  // Initialize in parallel
  parallel {i} by [16] {
    data[i] = (float)(i * i);
  }

  // Read back
  parallel {i} by [16] {
    println("data[", i, "] =", data[i]);
  }
}
`,
    },
  ],
};
