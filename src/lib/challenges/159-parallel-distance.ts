import type { Challenge } from "./index";

export const challenge159: Challenge = {
  id: "c159",
  title: "Parallel Distance",
  difficulty: "medium",
  description: `Compute the **element-wise absolute difference** of two arrays using \`parallel\`.

Given A = [10, 20, 30, 40] and B = [1, 15, 28, 35], compute \`dist[i] = |A[i] - B[i]|\`.

Expected output:
\`\`\`
dist[0] = 9
dist[1] = 5
dist[2] = 2
dist[3] = 5
\`\`\`

Use \`parallel {i} by [4]\` — each thread subtracts and takes the absolute value with \`if/else\`.`,
  starterCode: `__co__ void parallel_distance() {
  global int A[4];
  global int B[4];
  global int dist[4];

  parallel {i} by [4] { A[i] = (i + 1) * 10; }
  parallel {i} by [1] {
    B[0] = 1; B[1] = 15; B[2] = 28; B[3] = 35;
  }

  // TODO: compute dist[i] = |A[i] - B[i]| in parallel
  // parallel {i} by [4] {
  //   int d = A[i] - B[i];
  //   if (d < 0) dist[i] = -d;
  //   else dist[i] = d;
  // }

  parallel {i} by [4] {
    println("dist[", i, "] =", dist[i]);
  }
}
`,
  tests: [
    { expectedOutput: "dist[0] = 9", description: "|10 - 1| = 9" },
    { expectedOutput: "dist[1] = 5", description: "|20 - 15| = 5" },
    { expectedOutput: "dist[2] = 2", description: "|30 - 28| = 2" },
    { expectedOutput: "dist[3] = 5", description: "|40 - 35| = 5" },
    {
      expectedOutput: "dist[0] = 9\ndist[1] = 5\ndist[2] = 2\ndist[3] = 5",
      description: "Full element-wise distance output",
    },
  ],
  hint: "parallel {i} by [4]: d = A[i] - B[i]; if d < 0 then dist[i] = -d else dist[i] = d.",
};
