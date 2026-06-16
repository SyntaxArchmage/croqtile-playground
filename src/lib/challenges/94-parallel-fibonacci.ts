import type { Challenge } from "./index";

export const challenge94: Challenge = {
  id: "c94",
  title: "Parallel Fibonacci",
  difficulty: "hard",
  description: `Compute the first 8 Fibonacci numbers **sequentially**, then print each with \`foreach\`.

Seed \`fib[0] = 0\` and \`fib[1] = 1\`. Each later term is \`fib[i] = fib[i-1] + fib[i-2]\`.

Expected output:
\`\`\`
fib[0] = 0
fib[1] = 1
fib[2] = 1
fib[3] = 2
fib[4] = 3
fib[5] = 5
fib[6] = 8
fib[7] = 13
\`\`\`

Use a sequential \`foreach i in [2:8]\` to build the sequence — each step depends on the previous two values.`,
  starterCode: `__co__ void parallel_fibonacci() {
  global int fib[8];

  // TODO: seed and compute sequentially with foreach
  // fib[0] = 0;
  // fib[1] = 1;
  // foreach i in [2:8] {
  //   fib[i] = fib[i - 1] + fib[i - 2];
  // }

  // TODO: print each term with foreach
  // foreach i in [0:8] {
  //   println("fib[", i, "] =", fib[i]);
  // }
}
`,
  tests: [
    { expectedOutput: "fib[0] = 0", description: "First Fibonacci number is 0" },
    { expectedOutput: "fib[1] = 1", description: "Second Fibonacci number is 1" },
    { expectedOutput: "fib[5] = 5", description: "fib[5] = 5" },
    { expectedOutput: "fib[7] = 13", description: "Eighth Fibonacci number is 13" },
    {
      expectedOutput: "fib[0] = 0\nfib[1] = 1\nfib[2] = 1\nfib[3] = 2\nfib[4] = 3\nfib[5] = 5\nfib[6] = 8\nfib[7] = 13",
      description: "Full Fibonacci sequence output",
    },
  ],
  hint: "Set fib[0] and fib[1], then foreach i in [2:8] { fib[i] = fib[i-1] + fib[i-2]; }. Print with foreach i in [0:8].",
};
