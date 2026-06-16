import type { Challenge } from "./index";

export const challenge210: Challenge = {
  id: "c210",
  title: "Grand Challenge: Gaussian Elimination",
  difficulty: "hard",
  description: `Perform **forward elimination** on a 3×4 augmented matrix using shared memory and DMA.

Given augmented matrix (coefficients | RHS):
\`\`\`
[1,  2,  3 |  6]
[2,  5,  8 | 16]
[3,  7, 10 | 23]
\`\`\`

Forward elimination produces upper-triangular form:
\`\`\`
[1,  2,  3 |  6]
[0,  1,  2 |  4]
[0,  0, -1 |  1]
\`\`\`

**Steps:**
1. DMA the matrix into shared memory
2. \`foreach\` over pivot rows: eliminate entries below each pivot
3. For pivot row \`p\`, update row \`r > p\`: \`row[r] -= (Aug[r,p]/Aug[p,p]) × row[p]\`

Expected output (non-zero cells):
\`\`\`
Aug[0,0] = 1
Aug[0,1] = 2
Aug[0,2] = 3
Aug[0,3] = 6
Aug[1,1] = 1
Aug[1,2] = 2
Aug[1,3] = 4
Aug[2,2] = -1
Aug[2,3] = 1
\`\`\``,
  starterCode: `__co__ void grand_gaussian_elimination() {
  global int Aug[3, 4];
  shared int buf[3, 4];

  parallel {i, j} by [3, 4] {
    Aug[0, 0] = 1; Aug[0, 1] = 2; Aug[0, 2] = 3; Aug[0, 3] = 6;
    Aug[1, 0] = 2; Aug[1, 1] = 5; Aug[1, 2] = 8; Aug[1, 3] = 16;
    Aug[2, 0] = 3; Aug[2, 1] = 7; Aug[2, 2] = 10; Aug[2, 3] = 23;
  }

  // TODO: DMA Aug into shared buf

  // TODO: forward elimination with foreach
  // foreach p in [0:3] {
  //   foreach r in [p + 1:3] {
  //     int factor = buf[r, p] / buf[p, p];
  //     foreach j in [0:4] {
  //       buf[r, j] = buf[r, j] - factor * buf[p, j];
  //     }
  //   }
  // }

  // TODO: copy buf back to Aug

  parallel {i, j} by [3, 4] {
    if (Aug[i, j] != 0) {
      println("Aug[", i, ",", j, "] =", Aug[i, j]);
    }
  }
}
`,
  tests: [
    { expectedOutput: "Aug[0,0] = 1", description: "Pivot row 0 unchanged" },
    { expectedOutput: "Aug[0,3] = 6", description: "RHS column row 0 = 6" },
    { expectedOutput: "Aug[1,1] = 1", description: "Sub-diagonal eliminated in column 0" },
    { expectedOutput: "Aug[1,3] = 4", description: "Row 1 RHS after elimination = 4" },
    { expectedOutput: "Aug[2,2] = -1", description: "Lower-triangular column 2 pivot = -1" },
    { expectedOutput: "Aug[2,3] = 1", description: "Row 2 RHS after elimination = 1" },
    {
      expectedOutput: "Aug[0,0] = 1\nAug[0,1] = 2\nAug[0,2] = 3\nAug[0,3] = 6\nAug[1,1] = 1\nAug[1,2] = 2\nAug[1,3] = 4\nAug[2,2] = -1\nAug[2,3] = 1",
      description: "Full upper-triangular augmented matrix after forward elimination",
    },
  ],
  hint: "DMA Aug to shared buf. foreach pivot p: foreach row r below p, compute factor = buf[r,p]/buf[p,p], subtract factor×row p from row r. Copy back and print non-zero cells.",
};
