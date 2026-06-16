import type { Tutorial } from "./index";

export const ch32: Tutorial = {
  id: "ch32",
  title: "Common Algorithms",
  description: "Classic algorithms in Croqtile: binary search, merge-sort building blocks, and matrix chain multiplication DP.",
  steps: [
    {
      title: "Binary search in a sorted array",
      content: `**Binary search** finds a target in a sorted array in O(log n) steps. Maintain \`lo\` and \`hi\` bounds, compute \`mid\`, and narrow the range each iteration.

**Loop invariant:** if the target exists, it lies in \`sorted[lo:hi+1]\`.

\`\`\`croqtile
while (lo <= hi) {
  int mid = (lo + hi) / 2;
  if (sorted[mid] == target) { found = mid; break; }
  else if (sorted[mid] < target) { lo = mid + 1; }
  else { hi = mid - 1; }
}
\`\`\`

Use \`println\` inside the loop to trace each probe — essential for debugging off-by-one errors in bounds.

Try the example — search for 10 in a sorted array of even values.`,
      code: `__co__ void binary_search() {
  global float sorted[8];
  float target = 10.0f;
  int lo = 0;
  int hi = 7;
  int found = -1;

  parallel {i} by [8] {
    sorted[i] = (float)((i + 1) * 2);
  }

  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    println("[probe] lo=", lo, "hi=", hi, "mid=", mid, "val=", sorted[mid]);
    if (sorted[mid] == target) {
      found = mid;
      break;
    } else if (sorted[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  println("target", target, "found at index", found);
}
`,
      hint: "Array holds 2, 4, 6, …, 16. Target 10 sits at index 4. Watch mid shrink each iteration.",
    },
    {
      title: "Merge sort building blocks",
      content: `Full merge sort is recursive; the core **merge step** combines two sorted halves into one sorted output. This is the building block every divide-and-conquer sort relies on.

**Merge algorithm:**
1. Two pointers \`li\` and \`ri\` scan the left and right halves
2. Each iteration picks the smaller head element
3. Write to \`merged[k]\` and advance the winning pointer

\`\`\`croqtile
foreach k in [0:total] {
  if (left[li] <= right[ri]) { merged[k] = left[li]; li++; }
  else { merged[k] = right[ri]; ri++; }
}
\`\`\`

Try the example — merge \`[1,3,5,7]\` with \`[2,4,6]\` into a single sorted array.`,
      code: `__co__ void merge_sorted_halves() {
  global float left[4];
  global float right[3];
  global float merged[7];
  int li = 0;
  int ri = 0;

  parallel {i} by [4] {
    left[i] = (float)(i * 2 + 1);
  }
  parallel {i} by [3] {
    right[i] = (float)(i * 2 + 2);
  }

  println("[merge] left + right -> merged");
  foreach k in [0:7] {
    if (li >= 4) {
      merged[k] = right[ri];
      ri = ri + 1;
    } else if (ri >= 3) {
      merged[k] = left[li];
      li = li + 1;
    } else if (left[li] <= right[ri]) {
      merged[k] = left[li];
      li = li + 1;
    } else {
      merged[k] = right[ri];
      ri = ri + 1;
    }
    println("merged[", k, "] =", merged[k]);
  }
}
`,
      hint: "Track li and ri manually. When one half is exhausted, drain the other with the remaining branches.",
    },
    {
      title: "Matrix chain multiplication pattern",
      content: `**Matrix chain multiplication** asks: in what order should we multiply a chain of matrices to minimize scalar multiplications? Dynamic programming fills a cost table bottom-up.

Given dimensions \`dims[0..n]\` where matrix \`i\` has shape \`dims[i] × dims[i+1]\`:
- \`cost[i,j]\` = min cost to multiply matrices \`i\` through \`j\`
- Base case: \`cost[i,i] = 0\`
- Recurrence: try every split \`k\` between \`i\` and \`j\`

\`\`\`croqtile
cost[i,j] = min over k of (
  cost[i,k] + cost[k+1,j] + dims[i]*dims[k+1]*dims[j+1]
);
\`\`\`

Nested \`foreach\` loops over chain length and start index implement the classic DP table fill.

Try the example — three matrices with dims \`[2,3,4,5]\` and print the optimal chain cost.`,
      code: `__co__ void matrix_chain_mult() {
  global int dims[4];
  global int cost[3, 3];
  int n = 3;

  dims[0] = 2;
  dims[1] = 3;
  dims[2] = 4;
  dims[3] = 5;

  foreach i in [0:3] {
    cost[i, i] = 0;
  }

  foreach len in [2:4] {
    foreach i in [0:3] {
      int j = i + len - 1;
      if (j < n) {
        cost[i, j] = 999999;
        foreach k in [i:j] {
          int split_cost = cost[i, k] + cost[k + 1, j];
          split_cost = split_cost + dims[i] * dims[k + 1] * dims[j + 1];
          if (split_cost < cost[i, j]) {
            cost[i, j] = split_cost;
          }
        }
        println("cost[", i, ",", j, "] =", cost[i, j]);
      }
    }
  }

  println("optimal chain cost =", cost[0, 2]);
}
`,
      hint: "Fill by increasing chain length. For each (i,j), try every split k and keep the minimum cost.",
    },
  ],
};
