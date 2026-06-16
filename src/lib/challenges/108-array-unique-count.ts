import type { Challenge } from "./index";

export const challenge108: Challenge = {
  id: "c108",
  title: "Array Unique Count",
  difficulty: "hard",
  description: `Count **unique** elements in an array using a sequential scan with nested \`foreach\` loops.

Given data = [3, 1, 4, 1, 5, 3], the unique values are {3, 1, 4, 5} → **count = 4**.

For each index \`i\`, scan all earlier indices \`j < i\`. If \`data[i]\` never appeared before, increment the unique count.

Expected output:
\`\`\`
unique = 4
\`\`\``,
  starterCode: `__co__ void array_unique_count() {
  global int data[6];
  int n = 6;
  int unique = 0;

  parallel {i} by [1] {
    data[0] = 3; data[1] = 1; data[2] = 4;
    data[3] = 1; data[4] = 5; data[5] = 3;
  }

  // TODO: foreach i in [0:n], check if data[i] is new using foreach j in [0:i]
  // int seen = 0;
  // foreach j in [0:i] { if (data[j] == data[i]) { seen = 1; } }
  // if (seen == 0) { unique = unique + 1; }

  println("unique =", unique);
}
`,
  tests: [
    { expectedOutput: "unique = 4", description: "Four distinct values in [3,1,4,1,5,3]" },
  ],
  hint: "foreach i in [0:6]: set seen=0, foreach j in [0:i] check for duplicate; if seen stays 0, increment unique.",
};
