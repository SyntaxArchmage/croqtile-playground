import type { Tutorial } from "./index";

export const ch01: Tutorial = {
  id: "ch01",
  title: "Hello Croqtile",
  description: "Your first Croqtile program — learn the basic structure.",
  steps: [
    {
      title: "The __co__ keyword",
      content: `Every Croqtile function starts with the \`__co__\` keyword. This tells the compiler that this is a Choreo function — it will be compiled to run on a GPU (or simulated on CPU).

Think of \`__co__\` as the entry point, like \`main()\` in C but for GPU kernels.`,
      code: `__co__ void hello() {
  println("Hello from Croqtile!");
}
`,
    },
    {
      title: "Printing output",
      content: `\`println()\` works like you'd expect — it prints values followed by a newline.

You can print multiple values separated by commas. Try this variation:

\`\`\`croqtile
__co__ void greet() {
  println("Hello,", "world!");
  println("1 + 2 =", 1 + 2);
}
\`\`\``,
      code: `__co__ void printing() {
  println("The answer is", 42);
  println("Pi is approximately", 3.14159);
}
`,
    },
    {
      title: "Variables and types",
      content: `Croqtile supports standard numeric types. Variables are declared with their type:

- \`int\` — 32-bit integer
- \`float\` — 32-bit float
- \`double\` — 64-bit float

No pointers needed — Croqtile manages memory for you. Experiment with arithmetic:

\`\`\`croqtile
__co__ void math() {
  int a = 7;
  int b = 3;
  println("a + b =", a + b);
  println("a * b =", a * b);
}
\`\`\``,
      code: `__co__ void variables() {
  int x = 10;
  float y = 3.14f;
  int z = x * 2;
  println("x =", x, "y =", y, "z =", z);
}
`,
    },
  ],
};
