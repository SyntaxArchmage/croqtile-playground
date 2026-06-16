import type { Tutorial } from "./index";

export const ch21: Tutorial = {
  id: "ch21",
  title: "Pipeline Stages & Events",
  description: "Structure multi-stage kernels with pipeline blocks, sequential exec regions, and event-based handoffs between stages.",
  steps: [
    {
      title: "Basic stage with exec",
      content: `A \`pipeline\` block splits work into ordered \`stage\` sections. Each stage runs to completion before the next begins.

Inside a stage, an \`exec\` block runs its statements **sequentially** — unlike \`parallel\`, which launches many threads at once. Use \`exec\` for setup, logging, or single-threaded work between parallel regions.

\`\`\`croqtile
pipeline {
  stage {
    exec {
      println("stage message");
    }
  }
}
\`\`\`

Stages give you explicit structure: load, compute, store — each in its own section. Start with a single stage and \`println\` to see the execution order.`,
      code: `__co__ void basic_stage_exec() {
  global float data[4];

  parallel {i} by [4] {
    data[i] = (float)((i + 1) * 10);
  }

  pipeline {
    stage {
      exec {
        println("Stage 1: data loaded");
      }
    }
    stage {
      exec {
        println("Stage 2: ready to process");
      }
    }
  }

  parallel {i} by [4] {
    println("data[", i, "] =", data[i]);
  }
}
`,
      hint: "Each stage runs in order. exec { } wraps sequential statements — use it for println or setup before parallel work.",
    },
    {
      title: "Event signaling between stages",
      content: `When stage B depends on output from stage A, use \`shared event\` to coordinate the handoff:

1. Declare \`shared event ready;\`
2. Stage A finishes work, then \`arrive ready;\` (or \`signal ready;\`)
3. Stage B calls \`wait ready;\` before reading the result

This prevents stage B from running before stage A has produced its data. Pair events with \`pipeline\` stages to build producer-consumer chains.

\`\`\`croqtile
pipeline {
  stage {
    // produce data
    arrive ready;
  }
  stage {
    wait ready;
    // consume data
  }
}
\`\`\`

Events are lightweight synchronization points — essential when stages share buffers or shared memory.`,
      code: `__co__ void stage_events() {
  global float raw[4];
  shared float cooked[4];
  shared event stage_done;

  parallel {i} by [4] {
    raw[i] = (float)(i + 1);
  }

  pipeline {
    stage {
      exec {
        parallel {i} by [4] {
          cooked[i] = raw[i] * 2.0f;
        }
        arrive stage_done;
      }
    }
    stage {
      exec {
        wait stage_done;
        parallel {i} by [4] {
          println("cooked[", i, "] =", cooked[i]);
        }
      }
    }
  }
}
`,
    },
    {
      title: "Multi-stage pipeline with DMA and events",
      content: `Combine \`pipeline\`, \`stage\`, \`exec\`, \`dma\`, and \`event\` for a complete load → compute → store flow:

**Stage 1 (Load):** \`wait\` on an empty buffer, \`dma\` global data into shared memory, \`arrive\` a \`loaded\` event.

**Stage 2 (Compute):** \`wait loaded\`, transform data in shared memory with \`parallel\`, \`arrive computed\`.

**Stage 3 (Store):** \`wait computed\`, write results back to global memory.

Each stage signals the next via events. DMA moves data between memory spaces; \`exec\` keeps sequential setup inside each stage; \`parallel\` handles the compute.

This mirrors production GPU kernels where memory transfer and compute are pipelined with explicit synchronization.`,
      code: `__co__ void pipeline_dma_events() {
  global float input[4];
  global float output[4];
  shared float buf[4];
  shared event loaded;
  shared event computed;

  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 5);
  }

  arrive loaded;
  arrive computed;

  pipeline {
    stage {
      exec {
        dma(input[0:4], buf[0:4]);
        arrive loaded;
      }
    }
    stage {
      exec {
        wait loaded;
        parallel {i} by [4] {
          buf[i] = buf[i] * 2.0f;
        }
        arrive computed;
      }
    }
    stage {
      exec {
        wait computed;
        parallel {i} by [4] {
          output[i] = buf[i];
        }
        parallel {i} by [4] {
          println("output[", i, "] =", output[i]);
        }
      }
    }
  }
}
`,
    },
  ],
};
