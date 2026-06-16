import type { Challenge } from "./index";

export const challenge243: Challenge = {
  id: "c243",
  title: "Parallel Negate",
  difficulty: "easy",
  description: `Negate each element using \`parallel\`.

Given data = [3, -7, 0, 12, -5], the result is **[-3, 7, 0, -12, 5]**.

Expected output:
\`\`\`
out[0] = -3
out[1] = 7
out[2] = 0
out[3] = -12
out[4] = 5
\`\`\`

Use \`parallel {i} by [5] { out[i] = -data[i]; }\` — one thread per element.`,
  starterCode: `__co__ void parallel_negate() {
  global int data[5];
  global int out[5];

  parallel {i} by [1] {
    data[0] = 3; data[1] = -7; data[2] = 0; data[3] = 12; data[4] = -5;
  }

  // TODO: parallel {i} by [5] { out[i] = -data[i]; }

  parallel {i} by [5] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = -3", description: "Negate 3 to -3" },
    { expectedOutput: "out[1] = 7", description: "Negate -7 to 7" },
    { expectedOutput: "out[3] = -12", description: "Negate 12 to -12" },
    {
      expectedOutput: "out[0] = -3\nout[1] = 7\nout[2] = 0\nout[3] = -12\nout[4] = 5",
      description: "All negated values correct",
    },
  ],
  hint: "Launch parallel {i} by [5] and assign out[i] = -data[i]. Each thread negates its own index.",
};
