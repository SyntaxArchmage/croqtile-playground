import type { Challenge } from "./index";

export const challenge70: Challenge = {
  id: "c70",
  title: "Double Buffer Copy",
  difficulty: "hard",
  description: `Copy an array through a **two-buffer pipeline** using DMA and shared memory.

Given input = [1, 2, 3, 4, 5, 6, 7, 8], copy to output via two shared buffers:

1. **Stage 1 (Load):** \`dma\` input → \`buf_a\`, then \`arrive loaded\`
2. **Stage 2 (Transfer):** \`wait loaded\`, copy \`buf_a\` → \`buf_b\` in parallel, then \`arrive copied\`
3. **Stage 3 (Store):** \`wait copied\`, write \`buf_b\` → output and print

Expected output:
\`\`\`
out[0] = 1
out[1] = 2
out[2] = 3
out[3] = 4
out[4] = 5
out[5] = 6
out[6] = 7
out[7] = 8
\`\`\`

Use \`pipeline\` with \`shared event\` handoffs between stages.`,
  starterCode: `__co__ void double_buffer_copy() {
  global float input[8];
  global float output[8];
  shared float buf_a[8];
  shared float buf_b[8];
  shared event loaded;
  shared event copied;

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
  }

  arrive loaded;
  arrive copied;

  pipeline {
    stage {
      exec {
        // Stage 1: DMA input -> buf_a
      }
    }
    stage {
      exec {
        // Stage 2: wait loaded; copy buf_a -> buf_b; arrive copied
      }
    }
    stage {
      exec {
        // Stage 3: wait copied; write buf_b -> output; print
      }
    }
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 1", description: "First element copied through pipeline" },
    { expectedOutput: "out[4] = 5", description: "Middle element copied through pipeline" },
    { expectedOutput: "out[7] = 8", description: "Last element copied through pipeline" },
    {
      expectedOutput: "out[0] = 1\nout[1] = 2\nout[2] = 3\nout[3] = 4\nout[4] = 5\nout[5] = 6\nout[6] = 7\nout[7] = 8",
      description: "Full double-buffer copy output",
    },
  ],
  hint: "Stage 1: dma(input[0:8], buf_a[0:8]); arrive loaded. Stage 2: wait loaded; parallel {i} by [8] { buf_b[i] = buf_a[i]; }; arrive copied. Stage 3: wait copied; parallel {i} by [8] { output[i] = buf_b[i]; println(...); }.",
};
