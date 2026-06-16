import type { Tutorial } from "./index";

export const ch38: Tutorial = {
  id: "ch38",
  title: "Parallel Patterns: Reduce",
  description: "The reduce pattern in Croqtile: sum reduction with foreach, min/max reduction, and multi-value reduction for computing averages.",
  steps: [
    {
      title: "Sum reduction with foreach",
      content: `**Reduce** combines many values into one (or a few) results. In the mock interpreter, the simplest correct approach is a sequential \`foreach\` accumulation after parallel initialization.

\`\`\`croqtile
float total = 0.0f;
foreach i in [0:N] {
  total = total + data[i];
}
\`\`\`

Pattern: \`parallel\` to fill data independently, \`foreach\` to fold it sequentially. Real GPU code uses tree reductions; \`foreach\` is always correct and easy to verify.

Try the example — initialize 1..8 and print the sum.`,
      code: `__co__ void reduce_sum() {
  global float data[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;
  foreach i in [0:N] {
    total = total + data[i];
  }

  println("sum =", total);
}
`,
      hint: "Sum of 1 through 8 is 36.",
    },
    {
      title: "Min/max reduction",
      content: `Min and max follow the same fold pattern with a different combiner:

\`\`\`croqtile
float max_val = data[0];
foreach i in [1:N] {
  if (data[i] > max_val) {
    max_val = data[i];
  }
}
\`\`\`

Initialize from \`data[0]\` and scan from index 1. For min, flip the comparison. You can run both passes in one \`foreach\` when you need both extrema.

Try the example — find the minimum and maximum of a seeded array.`,
      code: `__co__ void reduce_minmax() {
  global float data[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (float)((i * 7 + 3) % 10);
  }

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }

  float min_val = data[0];
  float max_val = data[0];
  foreach i in [1:N] {
    if (data[i] < min_val) {
      min_val = data[i];
    }
    if (data[i] > max_val) {
      max_val = data[i];
    }
  }

  println("min =", min_val);
  println("max =", max_val);
}
`,
      hint: "Values are (i*7+3)%10 for i=0..7: 3,0,1,4,7,2,5,8. Min=0, max=8.",
    },
    {
      title: "Multi-value reduction (sum + count → average)",
      content: `Some reductions produce **multiple accumulators** in one pass. Computing an average needs both \`sum\` and \`count\` (or count only when all elements contribute).

\`\`\`croqtile
float sum = 0.0f;
int count = 0;
foreach i in [0:N] {
  if (mask[i] != 0) {
    sum = sum + data[i];
    count = count + 1;
  }
}
float avg = sum / (float)count;
\`\`\`

A single \`foreach\` loop updates all accumulators — no need for separate passes. Guard against \`count == 0\` with \`assert_true\` when the mask could exclude every element.

Try the example — average only the positive elements.`,
      code: `__co__ void reduce_average() {
  global float data[8];
  global int mask[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (float)(i - 3);
    if (data[i] > 0.0f) {
      mask[i] = 1;
    } else {
      mask[i] = 0;
    }
  }

  float sum = 0.0f;
  int count = 0;
  foreach i in [0:N] {
    if (mask[i] != 0) {
      sum = sum + data[i];
      count = count + 1;
    }
  }

  assert_true(count > 0);
  float avg = sum / (float)count;

  println("sum =", sum);
  println("count =", count);
  println("avg =", avg);
}
`,
      hint: "data[i] = i-3 gives positives at i=4..7 (values 1,2,3,4). Sum=10, count=4, avg=2.5.",
    },
  ],
};
