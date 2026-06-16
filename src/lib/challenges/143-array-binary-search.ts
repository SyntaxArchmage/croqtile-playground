import type { Challenge } from "./index";

export const challenge143: Challenge = {
  id: "c143",
  title: "Array Binary Search",
  difficulty: "hard",
  description: `Implement **binary search** on a sorted array to find a target value.

Given data = [2, 5, 8, 12, 16, 23, 38, 45] and target = 23, the value is at index 5.

Expected output:
\`\`\`
index = 5
\`\`\`

Maintain \`lo\` and \`hi\` bounds. While \`lo <= hi\`, compute \`mid = (lo + hi) / 2\` and narrow the range based on comparison with \`data[mid]\`.`,
  starterCode: `__co__ void array_binary_search() {
  global int data[8];
  int target = 23;
  int N = 8;

  parallel {i} by [1] {
    data[0] = 2;  data[1] = 5;  data[2] = 8;  data[3] = 12;
    data[4] = 16; data[5] = 23; data[6] = 38; data[7] = 45;
  }

  // TODO: binary search with while loop
  // int lo = 0;
  // int hi = N - 1;
  // int index = -1;
  // while (lo <= hi) {
  //   int mid = (lo + hi) / 2;
  //   if (data[mid] == target) { index = mid; lo = hi + 1; }
  //   else if (data[mid] < target) { lo = mid + 1; }
  //   else { hi = mid - 1; }
  // }

  // println("index =", index);
}
`,
  tests: [
    {
      expectedOutput: "index = 5",
      description: "Should find 23 at index 5",
    },
  ],
  hint: "Initialize lo=0, hi=N-1, index=-1. While lo <= hi: mid = (lo+hi)/2. If data[mid]==target, record index and exit. Else narrow lo or hi.",
};
