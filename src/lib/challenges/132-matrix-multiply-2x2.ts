import type { Challenge } from "./index";

export const challenge132: Challenge = {
  id: "c132",
  title: "Matrix Multiply 2×2",
  difficulty: "hard",
  description: `Multiply two 2×2 **integer** matrices using \`parallel\` for output cells and \`foreach\` for the inner dot product.

\`\`\`
A = [[2, 1],    B = [[1, 0],    C = A × B
     [3, 4]]         [2, 3]]
\`\`\`

| C[i,j] | computation      | value |
|--------|------------------|-------|
| C[0,0] | 2×1 + 1×2        | 4     |
| C[0,1] | 2×0 + 1×3        | 3     |
| C[1,0] | 3×1 + 4×2        | 11    |
| C[1,1] | 3×0 + 4×3        | 12    |

Expected output:
\`\`\`
C[0,0] = 4
C[0,1] = 3
C[1,0] = 11
C[1,1] = 12
\`\`\``,
  starterCode: `__co__ void matrix_multiply_2x2() {
  global int A[2, 2];
  global int B[2, 2];
  global int C[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 2; A[0, 1] = 1; A[1, 0] = 3; A[1, 1] = 4;
    B[0, 0] = 1; B[0, 1] = 0; B[1, 0] = 2; B[1, 1] = 3;
  }

  // TODO: parallel {i, j} with foreach k reduction
  // int sum = 0;
  // foreach k in [0:2] { sum = sum + A[i, k] * B[k, j]; }
  // C[i, j] = sum;

  parallel {i, j} by [2, 2] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0,0] = 4", description: "Top-left: 2×1 + 1×2 = 4" },
    { expectedOutput: "C[0,1] = 3", description: "Top-right: 2×0 + 1×3 = 3" },
    { expectedOutput: "C[1,0] = 11", description: "Bottom-left: 3×1 + 4×2 = 11" },
    { expectedOutput: "C[1,1] = 12", description: "Bottom-right: 3×0 + 4×3 = 12" },
    {
      expectedOutput: "C[0,0] = 4\nC[0,1] = 3\nC[1,0] = 11\nC[1,1] = 12",
      description: "Full 2×2 integer matrix multiply output",
    },
  ],
  hint: "Each thread (i, j) accumulates sum over k: sum += A[i,k] * B[k,j]. The inner k loop must be foreach, not parallel.",
};
