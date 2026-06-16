import type { Challenge } from "./index";

export const challenge250: Challenge = {
  id: "c250",
  title: "Grand Challenge: PageRank Step",
  difficulty: "hard",
  description: `Perform **one PageRank iteration** on a 3-page web graph using shared memory and DMA.

**Graph (outgoing links):**
- Page 0 → pages 1, 2 (outdegree 2)
- Page 1 → page 0 (outdegree 1)
- Page 2 → page 0 (outdegree 1)

**Parameters:** N = 3 pages, damping **d = 85** (represents 0.85), initial rank = **100** per page.

**Formula:** \`PR'[i] = (100 - d) / N + d × Σ(PR[j] / outdeg[j])\` for each incoming link j → i.

\`\`\`
PR'[0] = 5 + 85 × (100/1 + 100/1) / 100 = 175
PR'[1] = 5 + 85 × (100/2) / 100 = 47
PR'[2] = 5 + 85 × (100/2) / 100 = 47
\`\`\`

Expected output:
\`\`\`
rank[0] = 175
rank[1] = 47
rank[2] = 47
\`\`\`

Use DMA to load link/outdegree arrays, then \`parallel {i} by [3]\` to compute each new rank.`,
  starterCode: `__co__ void grand_pagerank_step() {
  global int links[3, 2];
  global int outdeg[3];
  global int rank[3];
  global int new_rank[3];
  shared int s_links[3, 2];
  shared int s_outdeg[3];
  shared int s_rank[3];
  int N = 3;
  int d = 85;

  parallel {i} by [1] {
    links[0, 0] = 1; links[0, 1] = 2; outdeg[0] = 2;
    links[1, 0] = 0; links[1, 1] = -1; outdeg[1] = 1;
    links[2, 0] = 0; links[2, 1] = -1; outdeg[2] = 1;
    rank[0] = 100; rank[1] = 100; rank[2] = 100;
  }

  // TODO: DMA links, outdeg, rank into shared arrays

  // TODO: parallel {i} by [3] {
  //   int sum = 0;
  //   foreach j in [0:N] {
  //     foreach k in [0:2] {
  //       if (s_links[j, k] == i) {
  //         sum = sum + s_rank[j] / s_outdeg[j];
  //       }
  //     }
  //   }
  //   new_rank[i] = (100 - d) / N + d * sum / 100;
  // }

  parallel {i} by [3] {
    println("rank[", i, "] =", new_rank[i]);
  }
}
`,
  tests: [
    { expectedOutput: "rank[0] = 175", description: "Page 0 receives links from pages 1 and 2" },
    { expectedOutput: "rank[1] = 47", description: "Page 1 receives link from page 0" },
    { expectedOutput: "rank[2] = 47", description: "Page 2 receives link from page 0" },
    {
      expectedOutput: "rank[0] = 175\nrank[1] = 47\nrank[2] = 47",
      description: "Full one-step PageRank output",
    },
  ],
  hint: "DMA graph data to shared memory. Each page i: sum incoming rank/outdeg contributions, then new_rank[i] = (100-d)/N + d*sum/100.",
};
