import type { Challenge } from "./index";

export const challenge238: Challenge = {
  id: "c238",
  title: "Array Inner Product",
  difficulty: "medium",
  description: `Compute the **inner product** (dot product) of two 5-element arrays.

Given A = [1, 2, 3, 4, 5] and B = [5, 4, 3, 2, 1]:

\`\`\`
inner = 1×5 + 2×4 + 3×3 + 4×2 + 5×1 = 5 + 8 + 9 + 8 + 5 = 35
\`\`\`

Expected output:
\`\`\`
inner = 35
\`\`\`

Use parallel initialization and a \`foreach\` loop for the reduction.`,
  starterCode: `__co__ void array_inner_product() {
  global int A[5];
  global int B[5];

  parallel {i} by [5] {
    A[i] = i + 1;
    B[i] = 5 - i;
  }

  // TODO: compute inner product with a foreach reduction
  // int inner = 0;
  // foreach k in [0:5] { inner = inner + A[k] * B[k]; }

  // println("inner =", inner);
}
`,
  tests: [
    {
      expectedOutput: "inner = 35",
      description: "Inner product of [1,2,3,4,5] and [5,4,3,2,1] is 35",
    },
  ],
  hint: "Accumulate A[k] * B[k] across all indices using a foreach loop and a running sum variable.",
};
