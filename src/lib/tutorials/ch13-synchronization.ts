import type { Tutorial } from "./index";

export const ch13: Tutorial = {
  id: "ch13",
  title: "Synchronization",
  description: "Coordinate threads and pipeline stages with events, signals, and barriers.",
  steps: [
    {
      title: "Signal and Wait",
      content: `When one stage produces data that another stage consumes, you need synchronization. \`shared event\` declares a coordination point, \`signal\` marks it ready, and \`wait\` blocks until the signal arrives.

Typical flow:
1. Declare \`shared event ready;\`
2. Producer finishes work, then \`signal ready;\`
3. Consumer calls \`wait ready;\` before reading the result

This prevents reading data before it has been written.`,
      code: `__co__ void signal_wait() {
  global float data[4];
  shared float buf[4];
  shared event ready;

  parallel {i} by [4] {
    data[i] = (float)((i + 1) * 10);
  }

  // Producer: load data into shared memory
  dma(data[0:4], buf[0:4]);
  signal ready;

  // Consumer: wait for the signal before reading
  wait ready;

  parallel {i} by [4] {
    println("buf[", i, "] =", buf[i]);
  }
}
`,
    },
    {
      title: "Pipeline stages",
      content: `The \`pipeline\` block structures multi-stage execution explicitly. Each \`stage\` runs in order, which mirrors how GPU kernels overlap load, compute, and store phases.

\`\`\`croqtile
pipeline {
  stage {
    // Stage 1: load
  }
  stage {
    // Stage 2: compute
  }
}
\`\`\`

Stages are separated by implicit synchronization — stage 2 cannot begin until stage 1 completes. This is the foundation of software pipelining on GPUs.`,
      code: `__co__ void pipeline_stages() {
  global float input[4];
  global float output[4];
  shared float buf[4];

  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 5);
  }

  pipeline {
    stage {
      dma(input[0:4], buf[0:4]);
    }
    stage {
      parallel {i} by [4] {
        output[i] = buf[i] * 2.0f;
      }
    }
  }

  parallel {i} by [4] {
    println("out[", i, "] =", output[i]);
  }
}
`,
    },
    {
      title: "Event-driven patterns",
      content: `For producer-consumer pipelines, pair \`event\` declarations with \`arrive\` and \`wait\`. The \`full\` event signals data is ready; the \`empty\` event signals the buffer can be refilled.

This double-event pattern is used in high-performance kernels (GEMM, convolutions) to overlap memory transfers with computation:

1. \`arrive empty\` — buffer starts empty
2. Producer: \`wait empty\` → load data → \`arrive full\`
3. Consumer: \`wait full\` → process data → \`arrive empty\`

Each side waits on one event and signals the other, creating a handoff loop.`,
      code: `__co__ void event_handoff() {
  global float raw[4];
  shared float cooked[4];
  shared event full;
  shared event empty;

  parallel {i} by [4] {
    raw[i] = (float)(i + 1);
  }

  arrive empty;

  // Producer: wait for empty buffer, load, signal full
  wait empty;
  dma(raw[0:4], cooked[0:4]);
  arrive full;

  // Consumer: wait for full buffer, then read
  wait full;
  parallel {i} by [4] {
    println("cooked[", i, "] =", cooked[i]);
  }
  arrive empty;
}
`,
    },
  ],
};
