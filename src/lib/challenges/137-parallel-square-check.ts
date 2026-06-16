import type { Challenge } from "./index";

export const challenge137: Challenge = {
  id: "c137",
  title: "Parallel Square Check",
  difficulty: "easy",
  description: `Check whether each element is a **perfect square** using \`parallel\`.

Given data = [0, 1, 2, 4, 5, 9, 16]:

| value | perfect square? |
|-------|-----------------|
| 0     | true (0×0)      |
| 1     | true (1×1)      |
| 2     | false           |
| 4     | true (2×2)      |
| 5     | false           |
| 9     | true (3×3)      |
| 16    | true (4×4)      |

Expected output:
\`\`\`
sq[0] = true
sq[1] = true
sq[2] = false
sq[3] = true
sq[4] = false
sq[5] = true
sq[6] = true
\`\`\`

Each thread tries \`r * r == n\` for \`r\` from 0 up to \`n\`.`,
  starterCode: `__co__ void parallel_square_check() {
  global int data[7];
  global bool sq[7];

  parallel {i} by [1] {
    data[0] = 0; data[1] = 1; data[2] = 2; data[3] = 4;
    data[4] = 5; data[5] = 9; data[6] = 16;
  }

  // TODO: check perfect square in parallel {i} by [7]
  // int n = data[i];
  // sq[i] = false;
  // foreach r in [0:n+1] {
  //   if (r * r == n) sq[i] = true;
  // }

  parallel {i} by [7] {
    println("sq[", i, "] =", sq[i]);
  }
}
`,
  tests: [
    { expectedOutput: "sq[0] = true", description: "0 is a perfect square" },
    { expectedOutput: "sq[2] = false", description: "2 is not a perfect square" },
    { expectedOutput: "sq[3] = true", description: "4 is 2×2" },
    { expectedOutput: "sq[6] = true", description: "16 is 4×4" },
    {
      expectedOutput: "sq[0] = true\nsq[1] = true\nsq[2] = false\nsq[3] = true\nsq[4] = false\nsq[5] = true\nsq[6] = true",
      description: "All perfect-square checks correct",
    },
  ],
  hint: "Each thread: set sq[i] = false, then foreach r in [0:n+1] check if r*r == n.",
};
