import type { Challenge } from "./index";

export const challenge79: Challenge = {
  id: "c79",
  title: "Two-Way Merge",
  difficulty: "hard",
  description: `Merge two sorted arrays into one sorted output using \`foreach\`.

Given:
- A = [1, 3, 5, 7]
- B = [2, 4, 6, 8]

Produce C = [1, 2, 3, 4, 5, 6, 7, 8].

Expected output:
\`\`\`
C[0] = 1
C[1] = 2
C[2] = 3
C[3] = 4
C[4] = 5
C[5] = 6
C[6] = 7
C[7] = 8
\`\`\`

Use a sequential \`foreach k in [0:8]\` loop with two read pointers (\`ia\`, \`ib\`). At each step, copy the smaller head element into \`C[k]\` and advance the corresponding pointer.`,
  starterCode: `__co__ void two_way_merge() {
  global int A[4];
  global int B[4];
  global int C[8];
  int ia = 0;
  int ib = 0;

  parallel {i} by [1] {
    A[0] = 1; A[1] = 3; A[2] = 5; A[3] = 7;
    B[0] = 2; B[1] = 4; B[2] = 6; B[3] = 8;
  }

  // TODO: merge with foreach k in [0:8]
  // foreach k in [0:8] {
  //   if (ib >= 4 || (ia < 4 && A[ia] <= B[ib])) {
  //     C[k] = A[ia]; ia = ia + 1;
  //   } else {
  //     C[k] = B[ib]; ib = ib + 1;
  //   }
  // }

  parallel {i} by [8] {
    println("C[", i, "] =", C[i]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0] = 1", description: "First element from A" },
    { expectedOutput: "C[1] = 2", description: "First element from B" },
    { expectedOutput: "C[4] = 5", description: "Middle merge picks from A" },
    { expectedOutput: "C[7] = 8", description: "Last element from B" },
    {
      expectedOutput: "C[0] = 1\nC[1] = 2\nC[2] = 3\nC[3] = 4\nC[4] = 5\nC[5] = 6\nC[6] = 7\nC[7] = 8",
      description: "Full merged sorted output",
    },
  ],
  hint: "Track ia and ib outside the loop. foreach k in [0:8]: compare A[ia] and B[ib], write the smaller to C[k], and increment the winning pointer.",
};
