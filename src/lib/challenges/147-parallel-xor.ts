import type { Challenge } from "./index";

export const challenge147: Challenge = {
  id: "c147",
  title: "Parallel XOR",
  difficulty: "medium",
  description: `Compute element-wise **XOR** of two arrays using \`parallel\`.

Given A = [12, 10, 15, 0] and B = [10, 12, 5, 15], compute \`out[i] = A[i] ^ B[i]\`.

Expected output:
\`\`\`
out[0] = 6
out[1] = 6
out[2] = 10
out[3] = 15
\`\`\`

Use \`parallel {i} by [4]\` — one thread per element applies the \`^\` operator.`,
  starterCode: `__co__ void parallel_xor() {
  global int A[4];
  global int B[4];
  global int out[4];

  parallel {i} by [1] {
    A[0] = 12; A[1] = 10; A[2] = 15; A[3] = 0;
    B[0] = 10; B[1] = 12; B[2] = 5;  B[3] = 15;
  }

  // TODO: compute out[i] = A[i] ^ B[i] in parallel
  // parallel {i} by [4] { out[i] = A[i] ^ B[i]; }

  parallel {i} by [4] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 6", description: "12 ^ 10 = 6" },
    { expectedOutput: "out[1] = 6", description: "10 ^ 12 = 6" },
    { expectedOutput: "out[2] = 10", description: "15 ^ 5 = 10" },
    { expectedOutput: "out[3] = 15", description: "0 ^ 15 = 15" },
    {
      expectedOutput: "out[0] = 6\nout[1] = 6\nout[2] = 10\nout[3] = 15",
      description: "Full parallel XOR output",
    },
  ],
  hint: "Launch parallel {i} by [4] and assign out[i] = A[i] ^ B[i]. Each thread handles one index independently.",
};
