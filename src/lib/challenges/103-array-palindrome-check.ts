import type { Challenge } from "./index";

export const challenge103: Challenge = {
  id: "c103",
  title: "Array Palindrome Check",
  difficulty: "medium",
  description: `Check whether an array reads the same forward and backward.

Given data = [1, 2, 3, 2, 1], compare pairs \`data[i]\` and \`data[n - 1 - i]\` for all \`i < n/2\`.

If every pair matches, the array is a palindrome.

Expected output:
\`\`\`
palindrome = 1
\`\`\`

Use \`foreach\` to scan symmetric index pairs. Set a flag to 0 when any mismatch is found.`,
  starterCode: `__co__ void array_palindrome_check() {
  global int data[5];
  int n = 5;
  int palindrome = 1;

  parallel {i} by [1] {
    data[0] = 1; data[1] = 2; data[2] = 3; data[3] = 2; data[4] = 1;
  }

  // TODO: foreach i in [0:n/2], compare data[i] with data[n - 1 - i]
  // if (data[i] != data[n - 1 - i]) { palindrome = 0; }

  println("palindrome =", palindrome);
}
`,
  tests: [
    { expectedOutput: "palindrome = 1", description: "[1,2,3,2,1] is a palindrome" },
  ],
  hint: "foreach i in [0:2]: if data[i] != data[n - 1 - i], set palindrome = 0. Start with palindrome = 1 and only clear it on mismatch.",
};
