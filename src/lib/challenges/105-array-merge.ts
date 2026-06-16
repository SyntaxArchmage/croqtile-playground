import type { Challenge } from "./index";

export const challenge105: Challenge = {
  id: "c105",
  title: "Array Merge",
  difficulty: "medium",
  description: `Merge two sorted arrays into one sorted array using \`foreach\`.

Given:
- A = [1, 4, 7]
- B = [2, 3, 8]

Produce C = [1, 2, 3, 4, 7, 8].

Expected output:
\`\`\`
C[0] = 1
C[1] = 2
C[2] = 3
C[3] = 4
C[4] = 7
C[5] = 8
\`\`\`

Use a sequential \`foreach k in [0:6]\` loop with two read pointers (\`ia\`, \`ib\`). At each step, copy the smaller head element into \`C[k]\` and advance the corresponding pointer.`,
  starterCode: `__co__ void array_merge() {
  global int A[3];
  global int B[3];
  global int C[6];
  int ia = 0;
  int ib = 0;

  parallel {i} by [1] {
    A[0] = 1; A[1] = 4; A[2] = 7;
    B[0] = 2; B[1] = 3; B[2] = 8;
  }

  // TODO: merge with foreach k in [0:6]
  // foreach k in [0:6] {
  //   if (ib >= 3 || (ia < 3 && A[ia] <= B[ib])) {
  //     C[k] = A[ia]; ia = ia + 1;
  //   } else {
  //     C[k] = B[ib]; ib = ib + 1;
  //   }
  // }

  parallel {i} by [6] {
    println("C[", i, "] =", C[i]);
  }
}
`,
  tests: [
    { expectedOutput: "C[0] = 1", description: "First element from A" },
    { expectedOutput: "C[2] = 3", description: "Third element from B" },
    { expectedOutput: "C[4] = 7", description: "Remaining element from A" },
    { expectedOutput: "C[5] = 8", description: "Last element from B" },
    {
      expectedOutput: "C[0] = 1\nC[1] = 2\nC[2] = 3\nC[3] = 4\nC[4] = 7\nC[5] = 8",
      description: "Full merged sorted output",
    },
  ],
  hint: "Track ia and ib outside the loop. foreach k in [0:6]: compare A[ia] and B[ib], write the smaller to C[k], and increment the winning pointer.",
};
