import type { Tutorial } from "./index";

export const ch33: Tutorial = {
  id: "ch33",
  title: "Debugging Techniques",
  description: "Practical Croqtile debugging: println state inspection, assert-driven checks, and isolating parallel bugs with sequential fallback.",
  steps: [
    {
      title: "Using println for state inspection",
      content: `When output is wrong, **print intermediate state** at every decision point. Tag each line with the variable name and index so you can reconstruct the computation mentally.

**State inspection checklist:**
1. Print inputs before the main loop
2. Print loop variables (\`i\`, \`lo\`, \`hi\`, etc.) inside each iteration
3. Print the final accumulator after the loop

\`\`\`croqtile
foreach i in [0:N] {
  println("[state] i=", i, "val=", data[i], "running=", sum);
  sum = sum + data[i];
}
\`\`\`

For \`parallel\` blocks, always include the thread index — output order is nondeterministic, but tagged lines let you sort by index.

Try the example — it traces a prefix-sum loop and prints the running total after each element.`,
      code: `__co__ void println_state_inspection() {
  global float data[6];
  global float prefix[6];

  parallel {i} by [6] {
    data[i] = (float)(i + 1);
  }

  println("=== input ===");
  parallel {i} by [6] {
    println("data[", i, "] =", data[i]);
  }

  float running = 0.0f;
  println("=== prefix build ===");
  foreach i in [0:6] {
    running = running + data[i];
    prefix[i] = running;
    println("[state] i=", i, "added=", data[i], "prefix[", i, "]=", prefix[i]);
  }

  println("final prefix[5] =", prefix[5]);
}
`,
      hint: "Print before and inside the foreach loop. The running variable shows how prefix[i] accumulates step by step.",
    },
    {
      title: "Assert-driven debugging",
      content: `**Assert-driven debugging** turns invariants into executable checks. Use \`assert_true\` to encode what *must* be true at each stage — when an assertion fails, you know exactly which invariant broke.

**Workflow:**
1. Identify a property (e.g., "every doubled value is even")
2. Place \`assert_true\` immediately after the code that must satisfy it
3. Keep \`println\` for the values that feed the assertion

\`\`\`croqtile
parallel {i} by [N] {
  out[i] = in[i] * 2;
  assert_true(out[i] >= 0.0f);
}
assert_true(sum == expected);
\`\`\`

Combine scalar asserts (\`foreach\` sums, counts) with per-thread asserts inside \`parallel\`. Assertions fail fast; println shows the last good state.

Try the example — it squares elements, asserts each result is non-negative, then checks the total sum.`,
      code: `__co__ void assert_driven_debug() {
  global int data[5];
  global int squared[5];
  int expected_sum = 55;

  parallel {i} by [5] {
    data[i] = i + 1;
  }

  parallel {i} by [5] {
    squared[i] = data[i] * data[i];
    assert_true(squared[i] >= 0);
    assert_true(squared[i] >= data[i]);
  }

  int sum = 0;
  foreach i in [0:5] {
    sum = sum + squared[i];
    println("[check] squared[", i, "] =", squared[i], "sum=", sum);
  }
  assert_true(sum == expected_sum);

  println("assertions passed, sum =", sum);
}
`,
      hint: "1²+2²+3²+4²+5² = 55. Each squared[i] should be >= data[i] since values are positive.",
    },
    {
      title: "Isolating parallel bugs with sequential fallback",
      content: `When parallel code gives wrong answers, **replace the suspect region with sequential execution** to confirm a race. If the sequential version is correct, the bug lives in concurrent access.

**Isolation pattern:**
1. Run the buggy \`parallel\` version and print its result
2. Run the same logic inside \`exec { foreach ... }\` as ground truth
3. Compare — mismatch means a race on shared state

\`\`\`croqtile
// Suspect parallel path
parallel {i} by [N] { total = total + data[i]; }

// Sequential fallback — always safe
exec {
  foreach i in [0:N] { safe = safe + data[i]; }
}
\`\`\`

Fix races with per-thread partial arrays, then reduce sequentially. Never debug a race by adding more parallel code — isolate first, fix second.

Try the example — a racy parallel sum vs a sequential fallback that produces the correct total.`,
      code: `__co__ void sequential_fallback() {
  global int data[8];

  parallel {i} by [8] {
    data[i] = i + 1;
  }

  int buggy = 0;
  parallel {i} by [8] {
    buggy = buggy + data[i];
  }
  println("buggy parallel total =", buggy);

  int safe = 0;
  exec {
    foreach i in [0:8] {
      safe = safe + data[i];
    }
  }
  println("sequential fallback =", safe);

  global int partial[8];
  parallel {i} by [8] {
    partial[i] = data[i];
  }
  int fixed = 0;
  exec {
    foreach i in [0:8] {
      fixed = fixed + partial[i];
    }
  }
  println("partial-then-reduce =", fixed);
  assert_true(fixed == safe);
}
`,
      hint: "Expected sum is 1+2+…+8 = 36. The racy parallel path may differ; sequential and partial-then-reduce should both equal 36.",
    },
  ],
};
