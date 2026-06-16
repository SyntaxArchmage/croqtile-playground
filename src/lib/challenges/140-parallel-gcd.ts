import type { Challenge } from "./index";

export const challenge140: Challenge = {
  id: "c140",
  title: "Parallel GCD",
  difficulty: "hard",
  description: `Compute the **GCD** (greatest common divisor) of all array elements using sequential \`foreach\` reduction.

Given data = [48, 18, 12, 6]:

\`\`\`
gcd(48, 18) = 6
gcd(6, 12)  = 6
gcd(6, 6)   = 6
\`\`\`

Expected output:
\`\`\`
gcd = 6
\`\`\`

Use the Euclidean algorithm pairwise: while \`b != 0\`, set \`(a, b) = (b, a % b)\`. Fold across the array with \`foreach\`.`,
  starterCode: `__co__ void parallel_gcd() {
  global int data[4];

  parallel {i} by [1] {
    data[0] = 48; data[1] = 18; data[2] = 12; data[3] = 6;
  }

  // TODO: sequential GCD reduction with foreach
  // int result = data[0];
  // foreach i in [1:4] {
  //   int a = result;
  //   int b = data[i];
  //   while (b != 0) {
  //     int t = b;
  //     b = a % b;
  //     a = t;
  //   }
  //   result = a;
  // }

  // println("gcd =", result);
}
`,
  tests: [
    {
      expectedOutput: "gcd = 6",
      description: "GCD of [48, 18, 12, 6] is 6",
    },
  ],
  hint: "Start result = data[0]. For each data[i], run Euclidean GCD: while b != 0 swap with a % b, then result = a.",
};
