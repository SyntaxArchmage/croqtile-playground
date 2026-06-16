import type { Tutorial } from "./index";

export const ch30: Tutorial = {
  id: "ch30",
  title: "Event-Driven Programming",
  description: "Signal/wait and event patterns: basic coordination, multi-event handoffs, and event-driven producer-consumer pipelines.",
  steps: [
    {
      title: "Basic signal and wait with events",
      content: `Event-driven code decouples **producers** from **consumers**. Declare \`shared event\` variables, then use \`signal\` (or \`arrive\`) when work is done and \`wait\` before reading shared data.

**Basic flow:**
1. Producer writes to shared memory
2. \`signal ready;\` — marks the event
3. Consumer calls \`wait ready;\` before accessing the buffer

This prevents reading data before it has been written — the same guarantee as a mutex, but lighter-weight for pipeline stages.

\`\`\`croqtile
shared event ready;
// producer
dma(input[0:N], buf[0:N]);
signal ready;
// consumer
wait ready;
\`\`\`

Try the example — a producer loads shared memory, signals, and the consumer waits before printing.`,
      code: `__co__ void basic_signal_wait() {
  global float input[4];
  shared float buf[4];
  shared event ready;

  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 3);
  }

  dma(input[0:4], buf[0:4]);
  signal ready;

  wait ready;

  parallel {i} by [4] {
    println("buf[", i, "] =", buf[i]);
  }
}
`,
      hint: "DMA into shared buf, then signal ready. Consumer waits on ready before the parallel println loop.",
    },
    {
      title: "Multi-event coordination",
      content: `Complex kernels track **multiple events** — one per resource or stage. Each event guards a specific buffer or phase transition.

**Pattern:**
- \`shared event data_ready;\` and \`shared event config_ready;\`
- Producer A signals \`data_ready\` after loading values
- Producer B signals \`config_ready\` after setting parameters
- Consumer waits on **both** before combining them

\`\`\`croqtile
wait data_ready;
wait config_ready;
parallel {i} by [N] {
  output[i] = data[i] * scale;
}
\`\`\`

Multi-event coordination ensures all prerequisites are satisfied before compute begins. Initialize events with \`arrive\` when starting in a known state.

Try the example — data and a scale factor load independently; compute waits for both events.`,
      code: `__co__ void multi_event_coord() {
  global float data[4];
  shared float buf[4];
  shared float scale;
  shared event data_ready;
  shared event config_ready;

  parallel {i} by [4] {
    data[i] = (float)(i + 1);
  }

  dma(data[0:4], buf[0:4]);
  signal data_ready;

  scale = 3.0f;
  signal config_ready;

  wait data_ready;
  wait config_ready;

  parallel {i} by [4] {
    float result = buf[i] * scale;
    println("result[", i, "] =", result);
  }
}
`,
      hint: "Signal data_ready after DMA and config_ready after setting scale. Wait on both before the parallel multiply.",
    },
    {
      title: "Event-driven producer-consumer pipeline",
      content: `The classic **producer-consumer** loop uses two events: \`full\` (data ready) and \`empty\` (buffer available).

**Handoff cycle:**
1. \`arrive empty\` — buffer starts empty
2. Producer: \`wait empty\` → load data → \`arrive full\`
3. Consumer: \`wait full\` → process data → \`arrive empty\`

Each side waits on one event and signals the other, creating a safe ping-pong between load and compute. This pattern appears in GEMM tiling, streaming pipelines, and double-buffered DMA.

Wrap stages in \`pipeline { stage { exec { ... } } }\` for explicit ordering when multiple handoffs chain together.

Try the example — a producer loads raw data, a consumer squares it, and the empty/full events guard the shared buffer.`,
      code: `__co__ void producer_consumer_pipeline() {
  global float raw[4];
  global float cooked[4];
  shared float buf[4];
  shared event full;
  shared event empty;

  parallel {i} by [4] {
    raw[i] = (float)(i + 1);
  }

  arrive empty;

  pipeline {
    stage {
      exec {
        wait empty;
        dma(raw[0:4], buf[0:4]);
        arrive full;
      }
    }
    stage {
      exec {
        wait full;
        parallel {i} by [4] {
          cooked[i] = buf[i] * buf[i];
        }
        parallel {i} by [4] {
          println("cooked[", i, "] =", cooked[i]);
        }
        arrive empty;
      }
    }
  }
}
`,
      hint: "Start with arrive empty. Producer waits empty, DMAs, arrives full. Consumer waits full, computes, arrives empty.",
    },
  ],
};
