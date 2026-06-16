import type { Tutorial } from "./index";

export const ch23: Tutorial = {
  id: "ch23",
  title: "Working with Strings",
  description: "String handling patterns: formatted output with variables, building messages in parallel, and conditional output from comparisons.",
  steps: [
    {
      title: "Printing formatted output with variables",
      content: `\`println()\` accepts a mix of **string literals** and **variables** — commas insert spaces between parts automatically.

Use this to build readable log lines without manual concatenation:

\`\`\`croqtile
int id = 2;
float value = 3.14f;
println("sensor[", id, "] reading =", value);
\`\`\`

Each argument is printed in order. Numeric types (\`int\`, \`float\`) convert to text at print time. This is the primary way to produce formatted debug output in Croqtile.`,
      code: `__co__ void formatted_output() {
  int thread_id = 3;
  float score = 98.5f;
  int count = 7;

  println("thread", thread_id, "score =", score);
  println("processed", count, "elements");
  println("status:", "OK", "at step", thread_id + 1);
}
`,
      hint: "Separate labels and values with commas inside println. The compiler handles spacing between each part.",
    },
    {
      title: "Building messages in parallel",
      content: `Each parallel thread can emit its own formatted message independently. Tag every line with the **thread index** so scrambled output stays traceable.

\`\`\`croqtile
parallel {i} by [4] {
  println("[worker", i, "] starting task");
}
\`\`\`

This pattern is essential for debugging parallel code: prefix with a consistent tag (\`[worker]\`, \`[block]\`, etc.) and include both the index and the value being inspected.`,
      code: `__co__ void parallel_messages() {
  global float data[4];

  parallel {i} by [4] {
    data[i] = (float)((i + 1) * 10);
  }

  parallel {i} by [4] {
    println("[thread", i, "] loaded value =", data[i]);
  }

  parallel {i} by [4] {
    float doubled = data[i] * 2.0f;
    println("[thread", i, "] doubled =", doubled);
  }
}
`,
      hint: "Include the thread index in every println inside a parallel block. Without it, you cannot tell which thread produced each line.",
    },
    {
      title: "String comparison and conditional output",
      content: `Character literals compare with \`==\` and \`!=\` inside \`if/else\` branches — the same as numeric comparisons.

Use this to classify or label data based on character content:

\`\`\`croqtile
global char tag[4];
parallel {i} by [4] {
  if (tag[i] == 'A') {
    println("slot", i, "-> alpha");
  } else {
    println("slot", i, "-> other");
  }
}
\`\`\`

Combine character comparison with parallel guards when only some threads should emit output.`,
      code: `__co__ void string_compare_conditional() {
  global char labels[6];

  parallel {i} by [1] {
    labels[0] = 'A';
    labels[1] = 'B';
    labels[2] = 'A';
    labels[3] = 'C';
    labels[4] = 'B';
    labels[5] = 'A';
  }

  parallel {i} by [6] {
    if (labels[i] == 'A') {
      println("labels[", i, "] = A -> match");
    } else if (labels[i] == 'B') {
      println("labels[", i, "] = B -> beta");
    } else {
      println("labels[", i, "] =", labels[i], "-> unknown");
    }
  }
}
`,
      hint: "Compare char variables to char literals with ==. Use if/else if/else inside parallel blocks to branch on the character value.",
    },
  ],
};
