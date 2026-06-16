import type { Tutorial } from "./index";

export const ch26: Tutorial = {
  id: "ch26",
  title: "Best Practices",
  description: "General programming practices in Croqtile: modular functions, clear naming, and lightweight testing with assert_true and println.",
  steps: [
    {
      title: "Code organization — functions and modularity",
      content: `Well-organized Croqtile code separates **what** each piece does from **how** threads are launched. Extract repeated logic into top-level helper functions and keep \`__co__\` entry points focused on orchestration.

**Guidelines:**
- One responsibility per function — e.g. \`square\`, \`clamp\`, \`load_tile\`
- Keep \`parallel\` blocks thin: call helpers instead of inlining complex math
- Group related globals near the top; initialize, compute, then verify in order

\`\`\`croqtile
float scale(float x, float factor) {
  return x * factor;
}

__co__ void organized() {
  parallel {i} by [N] {
    output[i] = scale(input[i], 2.0f);
  }
}
\`\`\`

Try the example — a small helper keeps the parallel block readable and reusable across kernels.`,
      code: `float square(float x) {
  return x * x;
}

float sum_of_squares(float a, float b) {
  return square(a) + square(b);
}

__co__ void modular_demo() {
  global float data[4];
  global float result[4];

  parallel {i} by [4] {
    data[i] = (float)(i + 1);
  }

  parallel {i} by [4] {
    float a = data[i];
    float b = data[(i + 1) % 4];
    result[i] = sum_of_squares(a, b);
  }

  parallel {i} by [4] {
    println("result[", i, "] =", result[i]);
  }
}
`,
      hint: "Define helpers at file scope. The __co__ function should read top-to-bottom: init → parallel compute → print/verify.",
    },
    {
      title: "Naming conventions and readability",
      content: `Clear names reduce bugs in parallel code where many indices and buffers compete for attention.

**Conventions that scale:**
- Arrays: plural nouns — \`inputs\`, \`weights\`, \`outputs\`
- Scalars: descriptive — \`row_count\`, \`threshold\`, \`total_sum\`
- Loop indices: \`i\`, \`j\`, \`k\` for dimensions; \`t\` for tile/block index
- Booleans: read as questions — \`is_valid\`, \`found\`, \`in_range\`

Avoid single-letter globals and magic numbers. Name constants (\`int WINDOW = 3;\`) and use them in \`foreach\` bounds so intent survives edits.

**Readable parallel block:**
\`\`\`croqtile
parallel {i} by [N] {
  if (values[i] > threshold) {
    flags[i] = 1;
  } else {
    flags[i] = 0;
  }
}
\`\`\`

Try the example — named thresholds and arrays make the classification logic self-documenting.`,
      code: `__co__ void readable_names() {
  global int values[6];
  global int flags[6];
  int threshold = 10;
  int N = 6;

  parallel {i} by [6] {
    values[i] = (i + 1) * 3;
  }

  parallel {i} by [6] {
    if (values[i] > threshold) {
      flags[i] = 1;
    } else {
      flags[i] = 0;
    }
  }

  parallel {i} by [6] {
    println("values[", i, "] =", values[i], "-> flag", flags[i]);
  }
}
`,
      hint: "Replace magic numbers with named locals. Pair array names (values, flags) so each println line tells a complete story.",
    },
    {
      title: "Testing strategies with assert_true and println",
      content: `Combine **println** for observability with **assert_true** for automated checks. This mirrors unit testing: print during development, assert invariants before shipping.

**Lightweight test pattern:**
1. Run a small known input (fixed array values)
2. \`assert_true\` on scalar results (sum, count, bounds)
3. \`assert_true\` per element inside \`parallel\` when checking output properties
4. \`println\` summary lines the playground can match

\`\`\`croqtile
foreach i in [0:N] {
  sum = sum + data[i];
}
assert_true(sum == expected_sum);
println("sum =", sum);
\`\`\`

Assertions fail fast; println confirms the happy path. Use both — asserts catch regressions, prints help you see *why* something broke.

Try the example — it doubles data, asserts every output is even, then prints the verified result.`,
      code: `__co__ void test_with_assert() {
  global int data[4];
  global int doubled[4];
  int N = 4;
  int expected_sum = 20;

  parallel {i} by [4] {
    data[i] = i + 1;
  }

  parallel {i} by [4] {
    doubled[i] = data[i] * 2;
    assert_true(doubled[i] % 2 == 0);
  }

  int sum = 0;
  foreach i in [0:4] {
    sum = sum + doubled[i];
  }
  assert_true(sum == expected_sum);

  println("sum =", sum);
  parallel {i} by [4] {
    println("doubled[", i, "] =", doubled[i]);
  }
}
`,
      hint: "Assert invariants you know must hold (sum == 20, each doubled[i] even). Print the same values you would check manually in a test case.",
    },
  ],
};
