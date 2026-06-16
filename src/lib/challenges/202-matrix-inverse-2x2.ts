import type { Challenge } from "./index";

export const challenge202: Challenge = {
  id: "c202",
  title: "Matrix Inverse 2×2",
  difficulty: "hard",
  description: `Compute the **inverse** of a 2×2 matrix by printing the determinant and adjugate entries.

Given:
\`\`\`
A = [[4, 2],
     [1, 3]]
\`\`\`

For \`A = [[a, b], [c, d]]\`, the inverse is \`(1/det) × [[d, -b], [-c, a]]\` where \`det = ad - bc\`.

| value  | computation | result |
|--------|-------------|--------|
| ad - bc | 4×3 - 2×1  | 10     |
| d      | A[1,1]      | 3      |
| -b     | -A[0,1]     | -2     |
| -c     | -A[1,0]     | -1     |
| a      | A[0,0]      | 4      |

Expected output:
\`\`\`
det = 10
adj[0,0] = 3
adj[0,1] = -2
adj[1,0] = -1
adj[1,1] = 4
\`\`\`

Print \`det = ad - bc\`, then the adjugate matrix entries \`d, -b, -c, a\`.`,
  starterCode: `__co__ void matrix_inverse_2x2() {
  global int A[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 4; A[0, 1] = 2;
    A[1, 0] = 1; A[1, 1] = 3;
  }

  int a = A[0, 0];
  int b = A[0, 1];
  int c = A[1, 0];
  int d = A[1, 1];

  // TODO: compute det = a * d - b * c
  // TODO: print det and adjugate entries d, -b, -c, a

  int det = 0;
  println("det =", det);
  println("adj[0,0] =", d);
  println("adj[0,1] =", -b);
  println("adj[1,0] =", -c);
  println("adj[1,1] =", a);
}
`,
  tests: [
    { expectedOutput: "det = 10", description: "Determinant ad - bc = 4×3 - 2×1 = 10" },
    { expectedOutput: "adj[0,0] = 3", description: "Adjugate top-left is d = 3" },
    { expectedOutput: "adj[0,1] = -2", description: "Adjugate top-right is -b = -2" },
    { expectedOutput: "adj[1,0] = -1", description: "Adjugate bottom-left is -c = -1" },
    { expectedOutput: "adj[1,1] = 4", description: "Adjugate bottom-right is a = 4" },
    {
      expectedOutput: "det = 10\nadj[0,0] = 3\nadj[0,1] = -2\nadj[1,0] = -1\nadj[1,1] = 4",
      description: "Full determinant and adjugate output",
    },
  ],
  hint: "Read a=A[0,0], b=A[0,1], c=A[1,0], d=A[1,1]. Compute det = a*d - b*c. Print det, then adj[0,0]=d, adj[0,1]=-b, adj[1,0]=-c, adj[1,1]=a.",
};
