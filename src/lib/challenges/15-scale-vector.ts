import type { Challenge } from "./index";

export const challenge15: Challenge = {
  id: "ch15",
  title: "Scale Vector (DMA)",
  difficulty: "hard",
  description: `Use shared memory and DMA to scale a vector.

Load data from global to shared memory using DMA, scale each element by 3, then write results back.

Given data = [1, 2, 3, 4, 5, 6, 7, 8], print each scaled value as: scaled[i] = <value>`,
  starterCode: `__co__ void scale_vector() {
  global float data[8];
  shared float buf[8];
  global float scaled[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  // TODO: DMA data to buf, scale by 3, write to scaled
  // 1. dma(data[0:8], buf[0:8])
  // 2. parallel scale buf[i] * 3
  // 3. write scaled[i] = buf[i]

  parallel {i} by [8] {
    println("scaled[", i, "] =", scaled[i]);
  }
}
`,
  tests: [
    { description: "scaled[0] = 3", expectedOutput: "scaled[0] = 3" },
    { description: "scaled[3] = 12", expectedOutput: "scaled[3] = 12" },
    { description: "scaled[7] = 24", expectedOutput: "scaled[7] = 24" },
  ],
  hint: "Use dma(data[0:8], buf[0:8]) to load, then parallel {i} by [8] { buf[i] = buf[i] * 3.0f; scaled[i] = buf[i]; }",
};
