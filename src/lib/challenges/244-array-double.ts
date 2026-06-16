import type { Challenge } from "./index";

export const challenge244: Challenge = {
  id: "c244",
  title: "Array Double",
  difficulty: "easy",
  description: `Double each element using \`parallel\`.

Given data = [1, 3, 5, 7, 9], the result is **[2, 6, 10, 14, 18]**.

Expected output:
\`\`\`
out[0] = 2
out[1] = 6
out[2] = 10
out[3] = 14
out[4] = 18
\`\`\`

Use \`parallel {i} by [5] { out[i] = data[i] * 2; }\` — one thread per element.`,
  starterCode: `__co__ void array_double() {
  global int data[5];
  global int out[5];

  parallel {i} by [1] {
    data[0] = 1; data[1] = 3; data[2] = 5; data[3] = 7; data[4] = 9;
  }

  // TODO: parallel {i} by [5] { out[i] = data[i] * 2; }

  parallel {i} by [5] {
    println("out[", i, "] =", out[i]);
  }
}
`,
  tests: [
    { expectedOutput: "out[0] = 2", description: "Double 1 to 2" },
    { expectedOutput: "out[2] = 10", description: "Double 5 to 10" },
    { expectedOutput: "out[4] = 18", description: "Double 9 to 18" },
    {
      expectedOutput: "out[0] = 2\nout[1] = 6\nout[2] = 10\nout[3] = 14\nout[4] = 18",
      description: "All doubled values correct",
    },
  ],
  hint: "Launch parallel {i} by [5] and assign out[i] = data[i] * 2. Each thread doubles its own index.",
};
