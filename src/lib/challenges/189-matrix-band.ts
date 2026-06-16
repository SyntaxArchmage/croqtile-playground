import type { Challenge } from "./index";

export const challenge189: Challenge = {
  id: "c189",
  title: "Matrix Band",
  difficulty: "medium",
  description: `Extract **band elements** from a 3×3 matrix where \`|i - j| ≤ 1\` (main diagonal and adjacent diagonals).

Given:
\`\`\`
M = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
\`\`\`

Band elements in row-major order: **1, 2, 4, 5, 6, 8, 9** (7 elements total).

Expected output:
\`\`\`
band_size = 7
band[0] = 1
band[1] = 2
band[2] = 4
band[3] = 5
band[4] = 6
band[5] = 8
band[6] = 9
\`\`\`

**Pass 1:** \`foreach\` count band elements. **Pass 2:** \`parallel\` collect elements where \`|i - j| ≤ 1\`.`,
  starterCode: `__co__ void matrix_band() {
  global int M[3, 3];
  global int band[7];

  parallel {i, j} by [3, 3] {
    M[i, j] = i * 3 + j + 1;
  }

  int band_size = 0;

  // TODO: pass 1 — foreach count band elements
  // foreach i in [0:3] {
  //   foreach j in [0:3] {
  //     if (i - j <= 1 && j - i <= 1) { band_size = band_size + 1; }
  //   }
  // }

  // TODO: pass 2 — parallel collect band elements
  // parallel {i, j} by [3, 3] {
  //   if (i - j <= 1 && j - i <= 1) {
  //     int rank = 0;
  //     foreach r in [0:i] {
  //       foreach c in [0:3] {
  //         if (r - c <= 1 && c - r <= 1) { rank = rank + 1; }
  //       }
  //     }
  //     foreach c in [0:j] {
  //       if (i - c <= 1 && c - i <= 1) { rank = rank + 1; }
  //     }
  //     band[rank - 1] = M[i, j];
  //   }
  // }

  println("band_size =", band_size);
  parallel {k} by [7] {
    println("band[", k, "] =", band[k]);
  }
}
`,
  tests: [
    { expectedOutput: "band_size = 7", description: "Seven elements in the band" },
    { expectedOutput: "band[0] = 1", description: "First band element is M[0,0] = 1" },
    { expectedOutput: "band[3] = 5", description: "Center band element is M[1,1] = 5" },
    { expectedOutput: "band[6] = 9", description: "Last band element is M[2,2] = 9" },
    {
      expectedOutput: "band_size = 7\nband[0] = 1\nband[1] = 2\nband[2] = 4\nband[3] = 5\nband[4] = 6\nband[5] = 8\nband[6] = 9",
      description: "Full matrix band extraction output",
    },
  ],
  hint: "Pass 1: foreach count cells where |i-j|<=1. Pass 2: parallel {i,j} — foreach prior band cells to compute rank, store M[i,j] in band[rank-1].",
};
