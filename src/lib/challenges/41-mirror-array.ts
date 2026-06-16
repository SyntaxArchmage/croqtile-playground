import type { Challenge } from "./index";

export const challenge41: Challenge = {
  id: "c41",
  title: "Mirror Array",
  difficulty: "easy",
  description: `Create a mirrored version of an array by appending it reversed.

Given data = [1, 2, 3, 4], produce mirror = [1, 2, 3, 4, 4, 3, 2, 1].

Expected output:
\`\`\`
mirror[0] = 1
mirror[1] = 2
mirror[2] = 3
mirror[3] = 4
mirror[4] = 4
mirror[5] = 3
mirror[6] = 2
mirror[7] = 1
\`\`\`

Use \`parallel {i} by [8]\` — for i < 4, copy directly; for i >= 4, read from the mirror position.`,
  starterCode: `__co__ void mirror_array() {
  global int data[4];
  global int mirror[8];

  parallel {i} by [4] {
    data[i] = i + 1;
  }

  // TODO: fill mirror with data and its reverse
  // parallel {i} by [8] {
  //   if (i < 4) mirror[i] = data[i];
  //   else mirror[i] = data[7 - i];
  // }

  parallel {i} by [8] {
    println("mirror[", i, "] =", mirror[i]);
  }
}
`,
  tests: [
    { expectedOutput: "mirror[0] = 1", description: "First element copied" },
    { expectedOutput: "mirror[4] = 4", description: "Mirror point" },
    { expectedOutput: "mirror[7] = 1", description: "Last element is first reversed" },
    {
      expectedOutput: "mirror[0] = 1\nmirror[1] = 2\nmirror[2] = 3\nmirror[3] = 4\nmirror[4] = 4\nmirror[5] = 3\nmirror[6] = 2\nmirror[7] = 1",
      description: "Full mirrored output",
    },
  ],
  hint: "For i < 4: mirror[i] = data[i]. For i >= 4: mirror[i] = data[7 - i] (or data[2*4 - 1 - i]).",
};
