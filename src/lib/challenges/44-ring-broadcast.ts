import type { Challenge } from "./index";

export const challenge44: Challenge = {
  id: "c44",
  title: "Ring Broadcast",
  difficulty: "hard",
  description: `Use a 3-stage \`pipeline\` and shared memory to pass a value through a ring, doubling it at each stage.

Start with value = 1. Each stage reads from shared memory, doubles the value, and writes to the next slot:

\`\`\`
stage[0] = 2
stage[1] = 4
stage[2] = 8
\`\`\`

Stage 1: DMA the initial value into \`ring[0]\`, then double it.
Stage 2: Read \`ring[0]\`, double, store in \`ring[1]\`.
Stage 3: Read \`ring[1]\`, double, store in \`ring[2]\`.`,
  starterCode: `__co__ void ring_broadcast() {
  global float value[1];
  shared float ring[3];

  parallel {i} by [1] {
    value[0] = 1.0f;
  }

  pipeline {
    stage {
      // Stage 1: load value into ring[0] and double
    }
    stage {
      // Stage 2: ring[1] = ring[0] * 2
    }
    stage {
      // Stage 3: ring[2] = ring[1] * 2
    }
  }

  parallel {i} by [3] {
    println("stage[", i, "] =", ring[i]);
  }
}
`,
  tests: [
    { expectedOutput: "stage[0] = 2", description: "First stage doubles 1 to 2" },
    { expectedOutput: "stage[1] = 4", description: "Second stage doubles 2 to 4" },
    { expectedOutput: "stage[2] = 8", description: "Third stage doubles 4 to 8" },
    {
      expectedOutput: "stage[0] = 2\nstage[1] = 4\nstage[2] = 8",
      description: "Full ring broadcast output",
    },
  ],
  hint: "Stage 1: dma(value[0:1], ring[0:1]) then ring[0] = ring[0] * 2. Stage 2: ring[1] = ring[0] * 2. Stage 3: ring[2] = ring[1] * 2.",
};
