import type { Challenge } from "./index";

export const challenge81: Challenge = {
  id: "c81",
  title: "Vector Negate",
  difficulty: "easy",
  description: `Negate each element in an array using \`parallel\`.

Given data = [4, -2, 7, -5, 0, 3], produce **[-4, 2, -7, 5, 0, -3]**.

Expected output:
\`\`\`
data[0] = -4
data[1] = 2
data[2] = -7
data[3] = 5
data[4] = 0
data[5] = -3
\`\`\`

Use \`parallel {i} by [6] { data[i] = -data[i]; }\` — one thread per element.`,
  starterCode: `__co__ void vector_negate() {
  global int data[6];

  parallel {i} by [1] {
    data[0] = 4; data[1] = -2; data[2] = 7;
    data[3] = -5; data[4] = 0; data[5] = 3;
  }

  // TODO: negate each element in parallel
  // parallel {i} by [6] { data[i] = -data[i]; }

  parallel {i} by [6] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = -4", description: "Positive 4 becomes -4" },
    { expectedOutput: "data[1] = 2", description: "Negative -2 becomes 2" },
    { expectedOutput: "data[4] = 0", description: "Zero stays zero" },
    {
      expectedOutput: "data[0] = -4\ndata[1] = 2\ndata[2] = -7\ndata[3] = 5\ndata[4] = 0\ndata[5] = -3",
      description: "All six elements negated",
    },
  ],
  hint: "Launch parallel {i} by [6] and assign data[i] = -data[i]. Each thread flips the sign of its own element.",
};
