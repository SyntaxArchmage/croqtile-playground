import type { Challenge } from "./index";

export const challenge13: Challenge = {
  id: "ch13",
  title: "Element-wise Multiply",
  difficulty: "easy",
  description: `Multiply two arrays element-wise in parallel.

Given A = [1, 2, 3, 4] and B = [10, 20, 30, 40], compute C[i] = A[i] * B[i].

Print each result as: C[i] = <value>`,
  starterCode: `__co__ void element_mul() {
  global float A[4];
  global float B[4];
  global float C[4];

  parallel {i} by [4] { A[i] = (float)(i + 1); }
  parallel {i} by [4] { B[i] = (float)((i + 1) * 10); }

  // TODO: compute C[i] = A[i] * B[i] in parallel

  parallel {i} by [4] {
    println("C[", i, "] =", C[i]);
  }
}
`,
  tests: [
    { description: "C[0] = 10", expectedOutput: "C[0] = 10" },
    { description: "C[1] = 40", expectedOutput: "C[1] = 40" },
    { description: "C[3] = 160", expectedOutput: "C[3] = 160" },
  ],
  hint: "Use parallel {i} by [4] { C[i] = A[i] * B[i]; }",
};
