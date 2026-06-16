import type { Challenge } from "./index";

export const challenge114: Challenge = {
  id: "c114",
  title: "String Length Counter",
  difficulty: "easy",
  description: `Count how many **non-zero** elements appear before the first zero — the effective length of a null-terminated "string" stored as integer codes.

Given data = [72, 69, 76, 76, 79, 0, 0, 0] (ASCII for "HELLO" padded with zeros), the length is **5**.

Expected output:
\`\`\`
length = 5
\`\`\`

Use \`foreach\` to scan from index 0 until you hit a zero.`,
  starterCode: `__co__ void string_length_counter() {
  global int data[8];
  int length = 0;

  parallel {i} by [1] {
    data[0] = 72; data[1] = 69; data[2] = 76; data[3] = 76;
    data[4] = 79; data[5] = 0; data[6] = 0; data[7] = 0;
  }

  // TODO: foreach i in [0:8] — increment length while data[i] != 0
  // foreach i in [0:8] {
  //   if (data[i] != 0) { length = length + 1; }
  //   else { break; }
  // }

  println("length =", length);
}
`,
  tests: [
    { expectedOutput: "length = 5", description: "Five non-zero chars before first zero" },
  ],
  hint: "foreach i in [0:8]: if data[i] != 0 increment length, else break out of the loop.",
};
