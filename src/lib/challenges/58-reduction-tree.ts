import type { Challenge } from "./index";

export const challenge58: Challenge = {
  id: "c58",
  title: "Reduction Tree",
  difficulty: "hard",
  description: `Implement a tree reduction pattern for sum using \`pipeline\` stages and \`dma\`.

Given data = [1, 2, 3, 4, 5, 6, 7, 8], compute the sum via a reduction tree:

1. **Stage 1 (Load):** DMA global data into shared memory
2. **Stage 2 (Level 1):** Pairwise sum 8 → 4 elements
3. **Stage 3 (Level 2):** Pairwise sum 4 → 2 elements
4. **Stage 4 (Level 3):** Combine the last 2 elements into the final sum

Expected output:
\`\`\`
sum = 36
\`\`\`

Use \`shared event\` to synchronize between stages. Each reduction level halves the active elements.`,
  starterCode: `__co__ void reduction_tree() {
  global float data[8];
  shared float buf[8];
  shared float level1[4];
  shared float level2[2];
  shared event loaded;
  shared event reduced1;
  shared event reduced2;

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;

  pipeline {
    stage {
      // Stage 1: DMA data -> buf, signal loaded
    }
    stage {
      // Stage 2: wait loaded, pairwise sum buf -> level1
    }
    stage {
      // Stage 3: wait reduced1, pairwise sum level1 -> level2
    }
    stage {
      // Stage 4: wait reduced2, combine level2[0] + level2[1] -> total
    }
  }

  println("sum =", total);
}
`,
  tests: [
    {
      expectedOutput: "sum = 36",
      description: "Tree reduction should sum all 8 elements",
    },
  ],
  hint: "Stage 1: dma(data[0:8], buf[0:8]); arrive loaded. Stage 2: wait loaded; parallel {i} by [4] { level1[i] = buf[i*2] + buf[i*2+1]; }; arrive reduced1. Stage 3: parallel {i} by [2] { level2[i] = level1[i*2] + level1[i*2+1]; }; arrive reduced2. Stage 4: total = level2[0] + level2[1].",
};
