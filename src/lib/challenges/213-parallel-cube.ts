import type { Challenge } from "./index";

export const challenge213: Challenge = {
  id: "c213",
  title: "Parallel Cube",
  difficulty: "easy",
  description: `Compute the **cube** of each array element using \`parallel\`.

Given data = [1, 2, 3, 4, 5]:

| i | data[i] | cube[i] |
|---|---------|---------|
| 0 | 1       | 1       |
| 1 | 2       | 8       |
| 2 | 3       | 27      |
| 3 | 4       | 64      |
| 4 | 5       | 125     |

Expected output:
\`\`\`
cube[0] = 1
cube[1] = 8
cube[2] = 27
cube[3] = 64
cube[4] = 125
\`\`\`

Use \`parallel {i} by [5] { cube[i] = data[i] * data[i] * data[i]; }\`.`,
  starterCode: `__co__ void parallel_cube() {
  global int data[5];
  global int cube[5];

  parallel {i} by [5] {
    data[i] = i + 1;
  }

  // TODO: compute cube of each element in parallel
  // parallel {i} by [5] { cube[i] = data[i] * data[i] * data[i]; }

  parallel {i} by [5] {
    println("cube[", i, "] =", cube[i]);
  }
}
`,
  tests: [
    { expectedOutput: "cube[0] = 1", description: "1³ = 1" },
    { expectedOutput: "cube[2] = 27", description: "3³ = 27" },
    { expectedOutput: "cube[4] = 125", description: "5³ = 125" },
    {
      expectedOutput: "cube[0] = 1\ncube[1] = 8\ncube[2] = 27\ncube[3] = 64\ncube[4] = 125",
      description: "All cubes correct",
    },
  ],
  hint: "Launch parallel {i} by [5] and assign cube[i] = data[i] * data[i] * data[i].",
};
