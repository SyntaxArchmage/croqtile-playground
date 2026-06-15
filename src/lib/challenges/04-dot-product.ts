import type { Challenge } from "./index";

export const challenge04: Challenge = {
  id: "c04",
  title: "Dot Product",
  difficulty: "medium",
  description: `Compute the dot product of two 4-element vectors A and B.

Given:
- A = [1, 2, 3, 4]
- B = [2, 3, 4, 5]

dot(A, B) = 1*2 + 2*3 + 3*4 + 4*5 = 2 + 6 + 12 + 20 = 40

Expected output:
\`\`\`
dot = 40
\`\`\`

Use parallel initialization and a foreach loop for the reduction.`,
  starterCode: `__co__ void dot_product() {
  global float A[4];
  global float B[4];

  // Initialize A = [1, 2, 3, 4], B = [2, 3, 4, 5]
  parallel {i} by [4] {
    A[i] = (float)(i + 1);
    B[i] = (float)(i + 2);
  }

  // Compute dot product with a foreach reduction
  float result = 0.0f;
  // foreach k in [0:4] { result = result + A[k] * B[k]; }

  println("dot =", result);
}
`,
  tests: [
    {
      expectedOutput: "dot = 40",
      description: "Should compute dot product = 40",
    },
  ],
  hint: "Accumulate A[k] * B[k] across all indices using a foreach loop and a running sum variable.",
};
