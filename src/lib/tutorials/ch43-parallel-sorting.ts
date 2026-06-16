import type { Tutorial } from "./index";

export const ch43: Tutorial = {
  id: "ch43",
  title: "Parallel Sorting",
  description: "Sorting algorithms in Croqtile: bubble sort with parallel comparisons, bitonic sort building blocks, and merge-based parallel sort.",
  steps: [
    {
      title: "Bubble sort with parallel comparisons",
      content: `**Bubble sort** compares adjacent pairs and swaps when out of order. Each pass pushes the largest element to the end. The inner comparison step can be expressed with \`parallel\`, but swaps must be done carefully to avoid races.

In the mock interpreter, use \`foreach\` for the sequential pass structure and \`parallel\` only where elements are independent (e.g., detecting which pairs need swapping):

\`\`\`croqtile
foreach pass in [0:N-1] {
  foreach i in [0:N-1-pass] {
    if (data[i] > data[i+1]) { swap data[i] and data[i+1]; }
  }
}
\`\`\`

Try the example — bubble sort an 8-element array and print each pass.`,
      code: `__co__ void bubble_sort() {
  global float data[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (float)((i * 3 + 7) % 10);
  }

  println("[init]");
  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }

  foreach pass in [0:7] {
    foreach i in [0:6] {
      if (i <= 6 - pass && data[i] > data[i + 1]) {
        float tmp = data[i];
        data[i] = data[i + 1];
        data[i + 1] = tmp;
      }
    }
    println("[pass", pass, "done]");
  }

  parallel {i} by [8] {
    println("sorted[", i, "] =", data[i]);
  }
}
`,
      hint: "Initial values: 7,0,3,6,9,2,5,8. After 7 passes → 0,2,3,5,6,7,8,9.",
    },
    {
      title: "Bitonic sort building blocks",
      content: `**Bitonic sort** builds a bitonic sequence (first increasing, then decreasing) and merges it into sorted order. The core operation is **compare-exchange** on pairs at a given stride.

For stride \`s\`, threads compare elements at \`i\` and \`i XOR s\` (conceptually). In Croqtile, model this with \`foreach\` over pairs:

\`\`\`croqtile
foreach i in [0:N/2] {
  int lo = i;
  int hi = i + stride;
  if (data[lo] > data[hi]) { swap; }
}
\`\`\`

Bitonic sort runs O(log² n) compare-exchange stages — ideal for GPU parallelism because each stage has independent pairs.

Try the example — one compare-exchange stage at stride 1 on an 8-element array.`,
      code: `__co__ void bitonic_compare_exchange() {
  global float data[8];
  int N = 8;

  parallel {i} by [8] {
    data[i] = (float)(8 - i);
  }

  println("[before]");
  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }

  foreach i in [0:3] {
    int lo = i;
    int hi = i + 4;
    if (data[lo] > data[hi]) {
      float tmp = data[lo];
      data[lo] = data[hi];
      data[hi] = tmp;
    }
  }

  println("[after stride-4 compare-exchange]");
  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
      hint: "Input 8,7,6,5,4,3,2,1. Pairs (0,4),(1,5),(2,6),(3,7) swap → 4,3,2,1,8,7,6,5.",
    },
    {
      title: "Merge-based parallel sort",
      content: `**Merge sort** divides the array, sorts halves, then **merges** them. The merge step is the GPU-friendly building block — two sorted runs combine into one sorted output with two pointers.

\`\`\`croqtile
foreach k in [0:total] {
  if (left[li] <= right[ri]) { merged[k] = left[li]; li++; }
  else { merged[k] = right[ri]; ri++; }
}
\`\`\`

Full parallel merge sort uses recursive splits; in Croqtile, model the merge step directly after sorting each half with \`foreach\`.

Try the example — merge two sorted halves into one sorted array.`,
      code: `__co__ void merge_parallel_sort() {
  global float left[4];
  global float right[4];
  global float merged[8];
  int li = 0;
  int ri = 0;

  parallel {i} by [4] {
    left[i] = (float)(i * 2 + 1);
    right[i] = (float)(i * 2 + 2);
  }

  println("[merge] left=[1,3,5,7] right=[2,4,6,8]");
  foreach k in [0:8] {
    if (li >= 4) {
      merged[k] = right[ri];
      ri = ri + 1;
    } else if (ri >= 4) {
      merged[k] = left[li];
      li = li + 1;
    } else if (left[li] <= right[ri]) {
      merged[k] = left[li];
      li = li + 1;
    } else {
      merged[k] = right[ri];
      ri = ri + 1;
    }
  }

  parallel {i} by [8] {
    println("merged[", i, "] =", merged[i]);
  }
}
`,
      hint: "Merge [1,3,5,7] + [2,4,6,8] → 1,2,3,4,5,6,7,8.",
    },
  ],
};
