import type { Tutorial } from "./index";

export const ch04: Tutorial = {
  id: "ch04",
  title: "Loops & Reductions",
  description: "Learn foreach loops and how to reduce data across iterations.",
  steps: [
    {
      title: "The foreach loop",
      content: `\`foreach\` is Croqtile's sequential loop — unlike \`parallel\`, each iteration runs one after another.

Use \`foreach\` when you need a sequential accumulation (like summing values) that can't be parallelized.

\`foreach i in [start:end]\` iterates \`i\` from \`start\` to \`end-1\`.`,
      code: `__co__ void foreach_demo() {
  foreach i in [0:5] {
    println("step", i);
  }
}
`,
    },
    {
      title: "Sum reduction",
      content: `A common pattern: initialize data in parallel, then reduce sequentially.

\`parallel\` is great for independent work (each thread touches its own data).
\`foreach\` is needed when results depend on previous iterations.`,
      code: `__co__ void sum_reduction() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;
  foreach i in [0:8] {
    total = total + data[i];
  }

  println("sum =", total);
}
`,
    },
    {
      title: "Max reduction",
      content: `Finding the maximum value follows the same pattern — sequential scan with a running maximum.

Try computing the product instead:

\`\`\`croqtile
__co__ void product() {
  global float data[5];
  parallel {i} by [5] { data[i] = (float)(i + 1); }
  float prod = 1.0f;
  foreach i in [0:5] { prod = prod * data[i]; }
  println("product =", prod);
}
\`\`\``,
      code: `__co__ void max_reduction() {
  global float data[6];

  parallel {i} by [6] {
    data[i] = (float)((i * 7 + 3) % 10);
  }

  parallel {i} by [6] {
    println("data[", i, "] =", data[i]);
  }

  float max_val = data[0];
  foreach i in [1:6] {
    if (data[i] > max_val) {
      max_val = data[i];
    }
  }

  println("max =", max_val);
}
`,
    },
  ],
};
