import type { Challenge } from "./index";

export const challenge225: Challenge = {
  id: "c225",
  title: "Grand Challenge: K-Means Step",
  difficulty: "hard",
  description: `Perform **one iteration** of K-means clustering with **k = 2** using shared memory and DMA.

Given 4 points in 2D:
\`\`\`
(0, 0), (1, 0), (10, 10), (11, 10)
\`\`\`

Initial centroids: **c0 = (0, 0)**, **c1 = (10, 10)**

**Step 1 — Assign** each point to the nearest centroid (Manhattan distance):
\`\`\`
assign = [0, 0, 1, 1]
\`\`\`

**Step 2 — Update** centroids as the integer mean of assigned points:
\`\`\`
c0 = (0, 0)   ← mean of (0,0) and (1,0)
c1 = (10, 10) ← mean of (10,10) and (11,10)
\`\`\`

Expected output:
\`\`\`
assign[0] = 0
assign[1] = 0
assign[2] = 1
assign[3] = 1
centroid0 = (0, 0)
centroid1 = (10, 10)
\`\`\`

Use DMA to load points into shared memory, then sequential foreach loops for assignment and centroid update.`,
  starterCode: `__co__ void grand_kmeans_step() {
  global int points[4, 2];
  global int assign[4];
  shared int buf[4, 2];

  int c0x = 0; int c0y = 0;
  int c1x = 10; int c1y = 10;

  parallel {i, j} by [1, 1] {
    points[0, 0] = 0; points[0, 1] = 0;
    points[1, 0] = 1; points[1, 1] = 0;
    points[2, 0] = 10; points[2, 1] = 10;
    points[3, 0] = 11; points[3, 1] = 10;
  }

  // TODO: DMA points into shared buf

  // TODO: assign each point to nearest centroid (Manhattan distance)
  // foreach i in [0:4] {
  //   int d0 = abs(buf[i,0] - c0x) + abs(buf[i,1] - c0y);
  //   int d1 = abs(buf[i,0] - c1x) + abs(buf[i,1] - c1y);
  //   if (d0 <= d1) { assign[i] = 0; } else { assign[i] = 1; }
  // }

  // TODO: recompute centroids from assigned points
  // int sum0x = 0; int sum0y = 0; int count0 = 0;
  // int sum1x = 0; int sum1y = 0; int count1 = 0;
  // foreach i in [0:4] { ... accumulate and divide ... }

  parallel {i} by [4] {
    println("assign[", i, "] =", assign[i]);
  }
  println("centroid0 = (", c0x, ",", c0y, ")");
  println("centroid1 = (", c1x, ",", c1y, ")");
}
`,
  tests: [
    { expectedOutput: "assign[0] = 0", description: "Point (0,0) assigned to cluster 0" },
    { expectedOutput: "assign[1] = 0", description: "Point (1,0) assigned to cluster 0" },
    { expectedOutput: "assign[2] = 1", description: "Point (10,10) assigned to cluster 1" },
    { expectedOutput: "assign[3] = 1", description: "Point (11,10) assigned to cluster 1" },
    { expectedOutput: "centroid0 = (0, 0)", description: "Updated centroid 0 is (0, 0)" },
    { expectedOutput: "centroid1 = (10, 10)", description: "Updated centroid 1 is (10, 10)" },
    {
      expectedOutput: "assign[0] = 0\nassign[1] = 0\nassign[2] = 1\nassign[3] = 1\ncentroid0 = (0, 0)\ncentroid1 = (10, 10)",
      description: "Full one-step K-means output",
    },
  ],
  hint: "DMA points to shared buf. Assign with Manhattan distance to c0/c1. Recompute each centroid as integer mean of its cluster points.",
};
