import type { Challenge } from "./index";

export const challenge97: Challenge = {
  id: "c97",
  title: "Parallel Square Root",
  difficulty: "easy",
  description: `Compute the **integer square root** of each element in parallel using a loop (not a stdlib function).

Given data = [0, 1, 4, 9, 10, 16, 25, 36], the integer square root is the largest integer \`r\` such that \`r * r <= x\`.

Expected output:
\`\`\`
isqrt[0] = 0
isqrt[1] = 1
isqrt[2] = 2
isqrt[3] = 3
isqrt[4] = 3
isqrt[5] = 4
isqrt[6] = 5
isqrt[7] = 6
\`\`\`

Use \`parallel {i} by [8]\` — each thread scans candidate values with \`foreach\` to find its element's integer root.`,
  starterCode: `__co__ void parallel_square_root() {
  global int data[8];
  global int isqrt[8];

  parallel {i} by [1] {
    data[0] = 0; data[1] = 1; data[2] = 4; data[3] = 9;
    data[4] = 10; data[5] = 16; data[6] = 25; data[7] = 36;
  }

  // TODO: compute integer square root per element in parallel
  // parallel {i} by [8] {
  //   int x = data[i];
  //   int r = 0;
  //   foreach k in [1:x + 1] {
  //     if (k * k <= x) { r = k; }
  //   }
  //   isqrt[i] = r;
  // }

  parallel {i} by [8] {
    println("isqrt[", i, "] =", isqrt[i]);
  }
}
`,
  tests: [
    { expectedOutput: "isqrt[0] = 0", description: "isqrt(0) = 0" },
    { expectedOutput: "isqrt[3] = 3", description: "isqrt(9) = 3" },
    { expectedOutput: "isqrt[4] = 3", description: "isqrt(10) = 3" },
    { expectedOutput: "isqrt[7] = 6", description: "isqrt(36) = 6" },
    {
      expectedOutput: "isqrt[0] = 0\nisqrt[1] = 1\nisqrt[2] = 2\nisqrt[3] = 3\nisqrt[4] = 3\nisqrt[5] = 4\nisqrt[6] = 5\nisqrt[7] = 6",
      description: "Full integer square root output",
    },
  ],
  hint: "In each parallel thread, loop k from 1 to x and keep the largest k where k*k <= x. Assign that k to isqrt[i].",
};
