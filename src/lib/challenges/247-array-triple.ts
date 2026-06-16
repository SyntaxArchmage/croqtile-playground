import type { Challenge } from "./index";

export const challenge247: Challenge = {
  id: "c247",
  title: "Array Triple",
  difficulty: "easy",
  description: `Triple each element using \`parallel\`.

Given data = [2, 4, 6, 8], the result is **[6, 12, 18, 24]**.

Expected output:
\`\`\`
out[0] = 6
out[1] = 12
out[2] = 18
out[3] = 24
\`\`\`

Use \`parallel {i} by [4] { out[i] = data[i] * 3; }\` — one thread per element.`,
  starterCode: `__co__ void array_triple() {
  global int data[4];
  global int out[4];

  parallel {i} by [1] {
    data[0] = 2; data[1] = 4; data[2] = 6; data[3] = 8;
  }

  // TODO: parallel {i} by [4] { out[i] = data[i] * 3; }

  parallel {i} by [4] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 6", description: "Triple 2 to 6" },
    { expectedOutput: "out[1] = 12", description: "Triple 4 to 12" },
    { expectedOutput: "out[3] = 24", description: "Triple 8 to 24" },
    {
      expectedOutput: "out[0] = 6\nout[1] = 12\nout[2] = 18\nout[3] = 24",
      description: "All tripled values correct",
    },
  ],
  hint: "Launch parallel {i} by [4] and assign out[i] = data[i] * 3. Each thread triples its own index.",
};
