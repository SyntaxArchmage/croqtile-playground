import type { Challenge } from "./index";

export const challenge45: Challenge = {
  id: "c45",
  title: "String Builder",
  difficulty: "easy",
  description: `Build a string by printing characters from an array using \`foreach\`.

Given chars = ['H', 'E', 'L', 'L', 'O'], print each character in order to produce:

\`\`\`
HELLO
\`\`\`

Use \`print()\` inside the loop (no newline per character), then \`println()\` to finish the line.`,
  starterCode: `__co__ void string_builder() {
  global char chars[5];

  parallel {i} by [1] {
    chars[0] = 'H';
    chars[1] = 'E';
    chars[2] = 'L';
    chars[3] = 'L';
    chars[4] = 'O';
  }

  // TODO: foreach over chars and print each one
  // foreach i in [0:5] { print(chars[i]); }
  // println();
}
`,
  tests: [
    { expectedOutput: "HELLO", description: "Prints HELLO on one line" },
  ],
  hint: "Use foreach i in [0:5] { print(chars[i]); } then println() to emit a newline after the word.",
};
