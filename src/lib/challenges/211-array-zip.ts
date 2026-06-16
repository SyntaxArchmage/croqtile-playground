import type { Challenge } from "./index";

export const challenge211: Challenge = {
  id: "c211",
  title: "Array Zip",
  difficulty: "easy",
  description: `Create an array of **pairs** by zipping two arrays with \`parallel\`.

Given A = [1, 2, 3, 4] and B = [10, 20, 30, 40]:

| i | pair[i,0] | pair[i,1] |
|---|-----------|-----------|
| 0 | 1         | 10        |
| 1 | 2         | 20        |
| 2 | 3         | 30        |
| 3 | 4         | 40        |

Expected output:
\`\`\`
pair[0,0] = 1
pair[0,1] = 10
pair[1,0] = 2
pair[1,1] = 20
pair[2,0] = 3
pair[2,1] = 30
pair[3,0] = 4
pair[3,1] = 40
\`\`\`

Use \`parallel {i} by [4]\` to set \`pair[i, 0] = A[i]\` and \`pair[i, 1] = B[i]\`.`,
  starterCode: `__co__ void array_zip() {
  global int A[4];
  global int B[4];
  global int pair[4, 2];

  parallel {i} by [4] {
    A[i] = i + 1;
    B[i] = (i + 1) * 10;
  }

  // TODO: zip A and B into pair with parallel {i} by [4]
  // pair[i, 0] = A[i];
  // pair[i, 1] = B[i];

  parallel {i, j} by [4, 2] {
    println("pair[", i, ",", j, "] =", pair[i, j]);
  }
}
`,
  tests: [
    { expectedOutput: "pair[0,0] = 1", description: "First pair left element is 1" },
    { expectedOutput: "pair[0,1] = 10", description: "First pair right element is 10" },
    { expectedOutput: "pair[3,0] = 4", description: "Last pair left element is 4" },
    { expectedOutput: "pair[3,1] = 40", description: "Last pair right element is 40" },
    {
      expectedOutput: "pair[0,0] = 1\npair[0,1] = 10\npair[1,0] = 2\npair[1,1] = 20\npair[2,0] = 3\npair[2,1] = 30\npair[3,0] = 4\npair[3,1] = 40",
      description: "Full zipped pair output",
    },
  ],
  hint: "parallel {i} by [4]: pair[i,0] = A[i] and pair[i,1] = B[i]. Each thread builds one pair.",
};
