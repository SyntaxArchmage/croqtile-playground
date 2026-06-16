import type { Challenge } from "./index";

export const challenge164: Challenge = {
  id: "c164",
  title: "Parallel Lerp",
  difficulty: "medium",
  description: `Linearly interpolate between two arrays using \`parallel\`.

Given A = [0, 10, 20, 30], B = [100, 110, 120, 130], and **t = 0.5**:

\`\`\`
result[i] = A[i] + t * (B[i] - A[i])
\`\`\`

| i | A[i] | B[i] | result[i] |
|---|------|------|-----------|
| 0 | 0    | 100  | 50        |
| 1 | 10   | 110  | 60        |
| 2 | 20   | 120  | 70        |
| 3 | 30   | 130  | 80        |

Expected output:
\`\`\`
result[0] = 50
result[1] = 60
result[2] = 70
result[3] = 80
\`\`\``,
  starterCode: `__co__ void parallel_lerp() {
  global float A[4];
  global float B[4];
  global float result[4];
  float t = 0.5f;

  parallel {i} by [4] {
    A[i] = (float)(i * 10);
    B[i] = (float)(100 + i * 10);
  }

  // TODO: parallel {i} by [4] {
  //   result[i] = A[i] + t * (B[i] - A[i]);
  // }

  parallel {i} by [4] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 50", description: "Lerp midpoint of 0 and 100" },
    { expectedOutput: "result[2] = 70", description: "Lerp midpoint of 20 and 120" },
    { expectedOutput: "result[3] = 80", description: "Lerp midpoint of 30 and 130" },
    {
      expectedOutput: "result[0] = 50\nresult[1] = 60\nresult[2] = 70\nresult[3] = 80",
      description: "Full lerp output at t = 0.5",
    },
  ],
  hint: "Each thread: result[i] = A[i] + t * (B[i] - A[i]). With t = 0.5 this is the midpoint between A and B.",
};
