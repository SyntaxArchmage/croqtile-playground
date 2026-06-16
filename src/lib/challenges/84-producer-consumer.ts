import type { Challenge } from "./index";

export const challenge84: Challenge = {
  id: "c84",
  title: "Producer Consumer",
  difficulty: "hard",
  description: `Implement a producer-consumer pipeline using \`signal\`/\`wait\` events.

**Producer stage:** Load global input into shared \`buf\` via DMA, then \`arrive ready\`.
**Consumer stage:** \`wait ready\`, double each value in \`buf\`, write to global \`output\`.

Given input = [2, 4, 6, 8], expected output:
\`\`\`
out[0] = 4
out[1] = 8
out[2] = 12
out[3] = 16
\`\`\`

Use a \`pipeline\` block with separate \`stage\` sections and \`shared event ready\`.`,
  starterCode: `__co__ void producer_consumer() {
  global float input[4];
  global float output[4];
  shared float buf[4];
  shared event ready;

  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 2);
  }

  arrive ready;

  pipeline {
    stage {
      exec {
        // TODO: Producer — DMA input into buf, then arrive ready
      }
    }
    stage {
      exec {
        // TODO: Consumer — wait ready, double buf into output
      }
    }
  }

  parallel {i} by [4] {
    println("out[", i, "] =", output[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 4", description: "First element doubled to 4" },
    { expectedOutput: "out[3] = 16", description: "Last element doubled to 16" },
    {
      expectedOutput: "out[0] = 4\nout[1] = 8\nout[2] = 12\nout[3] = 16",
      description: "Full producer-consumer output",
    },
  ],
  hint: "Producer: dma(input[0:4], buf[0:4]); arrive ready;. Consumer: wait ready; parallel {i} by [4] { output[i] = buf[i] * 2.0f; }.",
};
