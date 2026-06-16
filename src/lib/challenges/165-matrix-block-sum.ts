import type { Challenge } from "./index";

export const challenge165: Challenge = {
  id: "c165",
  title: "Matrix Block Sum",
  difficulty: "hard",
  description: `Sum every **2×2 block** in a **4×4** matrix using shared memory and DMA.

Given:
\`\`\`
M = [[ 1,  2,  3,  4],
     [ 5,  6,  7,  8],
     [ 9, 10, 11, 12],
     [13, 14, 15, 16]]
\`\`\`

There are nine 2×2 blocks (one per top-left corner). Examples:

| block (r,c) | cells        | sum |
|-------------|--------------|-----|
| (0,0)       | 1,2,5,6      | 14  |
| (1,1)       | 6,7,10,11    | 34  |
| (2,2)       | 11,12,15,16  | 54  |

Expected output:
\`\`\`
block[0,0] = 14
block[0,1] = 18
block[0,2] = 22
block[1,0] = 30
block[1,1] = 34
block[1,2] = 38
block[2,0] = 46
block[2,1] = 50
block[2,2] = 54
\`\`\`

**Steps:** DMA M into shared memory, then \`parallel {r, c} by [3, 3]\` to sum each 2×2 block.`,
  starterCode: `__co__ void matrix_block_sum() {
  global int M[4, 4];
  global int block[3, 3];
  shared int buf[4, 4];

  parallel {i, j} by [4, 4] {
    M[i, j] = i * 4 + j + 1;
  }

  // TODO: DMA M into shared buf

  // TODO: parallel {r, c} by [3, 3] {
  //   block[r, c] = buf[r, c] + buf[r, c + 1]
  //               + buf[r + 1, c] + buf[r + 1, c + 1];
  // }

  parallel {r, c} by [3, 3] {
    println("block[", r, ",", c, "] =", block[r, c]);
  }
}
`,
  tests: [
    { expectedOutput: "block[0,0] = 14", description: "Top-left 2×2 block: 1+2+5+6" },
    { expectedOutput: "block[1,1] = 34", description: "Center 2×2 block: 6+7+10+11" },
    { expectedOutput: "block[2,2] = 54", description: "Bottom-right 2×2 block: 11+12+15+16" },
    {
      expectedOutput: "block[0,0] = 14\nblock[0,1] = 18\nblock[0,2] = 22\nblock[1,0] = 30\nblock[1,1] = 34\nblock[1,2] = 38\nblock[2,0] = 46\nblock[2,1] = 50\nblock[2,2] = 54",
      description: "All nine 2×2 block sums correct",
    },
  ],
  hint: "DMA M into shared buf. parallel {r,c} by [3,3]: block[r,c] = buf[r,c]+buf[r,c+1]+buf[r+1,c]+buf[r+1,c+1].",
};
