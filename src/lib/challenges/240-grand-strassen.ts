import type { Challenge } from "./index";

export const challenge240: Challenge = {
  id: "c240",
  title: "Grand Challenge: Strassen",
  difficulty: "hard",
  description: `Multiply two 2×2 matrices using **Strassen's algorithm** (7 sub-multiplications).

\`\`\`
A = [[1, 2],    B = [[5, 6],    C = A × B
     [3, 4]]         [7, 8]]
\`\`\`

Strassen sub-products:
\`\`\`
M1 = (A00+A11)(B00+B11) = 65
M2 = (A10+A11)B00       = 35
M3 = A00(B01-B11)       = -2
M4 = A11(B10-B00)       = 8
M5 = (A00+A01)B11       = 24
M6 = (A10-A00)(B00+B01) = 22
M7 = (A01-A11)(B10+B11) = -30
\`\`\`

Result cells:
\`\`\`
C00 = M1+M4-M5+M7 = 19
C01 = M3+M5         = 22
C10 = M2+M4         = 43
C11 = M1-M2+M3+M6   = 50
\`\`\`

Expected output:
\`\`\`
C[0,0] = 19
C[0,1] = 22
C[1,0] = 43
C[1,1] = 50
\`\`\`

Compute the seven M values sequentially, then assemble C in parallel.`,
  starterCode: `__co__ void grand_strassen() {
  global int A[2, 2];
  global int B[2, 2];
  global int C[2, 2];

  parallel {i, j} by [2, 2] {
    A[0, 0] = 1; A[0, 1] = 2; A[1, 0] = 3; A[1, 1] = 4;
    B[0, 0] = 5; B[0, 1] = 6; B[1, 0] = 7; B[1, 1] = 8;
  }

  // TODO: compute Strassen sub-products M1..M7
  // int M1 = (A[0,0]+A[1,1]) * (B[0,0]+B[1,1]);
  // int M2 = (A[1,0]+A[1,1]) * B[0,0];
  // ... M3..M7 ...

  // TODO: assemble C from M1..M7
  // C[0,0] = M1 + M4 - M5 + M7;
  // C[0,1] = M3 + M5;
  // C[1,0] = M2 + M4;
  // C[1,1] = M1 - M2 + M3 + M6;

  parallel {i, j} by [2, 2] {
    println("C[", i, ",", j, "] =", C[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0,0] = 19", description: "Strassen C[0,0] = 19" },
    { expectedOutput: "C[0,1] = 22", description: "Strassen C[0,1] = 22" },
    { expectedOutput: "C[1,0] = 43", description: "Strassen C[1,0] = 43" },
    { expectedOutput: "C[1,1] = 50", description: "Strassen C[1,1] = 50" },
    {
      expectedOutput: "C[0,0] = 19\nC[0,1] = 22\nC[1,0] = 43\nC[1,1] = 50",
      description: "Full Strassen 2×2 multiply output",
    },
  ],
  hint: "Compute M1..M7 from A/B sub-blocks, then C00=M1+M4-M5+M7, C01=M3+M5, C10=M2+M4, C11=M1-M2+M3+M6.",
};
