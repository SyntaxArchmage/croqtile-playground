import type { Challenge } from "./index";

export const challenge01: Challenge = {
  id: "c01",
  title: "Hello Threads",
  difficulty: "easy",
  description: `Write a function that prints "Hello from thread X" for each of 4 threads.

The output should be:
\`\`\`
Hello from thread 0
Hello from thread 1
Hello from thread 2
Hello from thread 3
\`\`\`

Use \`parallel {i} by [4]\` and \`println()\`.`,
  starterCode: `__co__ void hello_threads() {
  // Write your code here
}
`,
  tests: [
    {
      expectedOutput: "Hello from thread 0\nHello from thread 1\nHello from thread 2\nHello from thread 3",
      description: "Should print hello from 4 threads",
    },
  ],
  hint: "Use parallel {i} by [4] and println(\"Hello from thread\", i);",
};
