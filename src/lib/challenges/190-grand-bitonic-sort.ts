import type { Challenge } from "./index";

export const challenge190: Challenge = {
  id: "c190",
  title: "Grand Challenge: Bitonic Sort",
  difficulty: "hard",
  description: `Perform a full **bitonic sort** on 8 elements using shared memory and DMA.

Given input \`data = [6, 3, 8, 1, 5, 2, 7, 4]\`, bitonic sort builds bitonic sequences and merges them through compare-exchange stages.

Expected sorted output:
\`\`\`
data[0] = 1
data[1] = 2
data[2] = 3
data[3] = 4
data[4] = 5
data[5] = 6
data[6] = 7
data[7] = 8
\`\`\`

**Steps:** DMA \`data\` into shared memory, then run bitonic compare-exchange stages with \`parallel\` over partner pairs at increasing stride sizes.`,
  starterCode: `__co__ void grand_bitonic_sort() {
  global int data[8];
  shared int buf[8];

  parallel {i} by [1] {
    data[0] = 6; data[1] = 3; data[2] = 8; data[3] = 1;
    data[4] = 5; data[5] = 2; data[6] = 7; data[7] = 4;
  }

  // TODO: DMA data into shared buf

  // TODO: bitonic sort stages with parallel compare-exchange
  // foreach stage in [0:4] {
  //   int stride = 1;
  //   foreach s in [0:stage] { stride = stride * 2; }
  //   parallel {i} by [8] {
  //     if (i + stride < 8) {
  //       int partner = i ^ stride;
  //       if (partner > i && buf[i] > buf[partner]) {
  //         int tmp = buf[i];
  //         buf[i] = buf[partner];
  //         buf[partner] = tmp;
  //       }
  //     }
  //   }
  // }

  // TODO: DMA buf back to data

  parallel {i} by [8] {
    println("data[", i, "] =", data[i]);
  }
}
`,
  tests: [
    { expectedOutput: "data[0] = 1", description: "Smallest element at index 0" },
    { expectedOutput: "data[3] = 4", description: "Fourth element is 4" },
    { expectedOutput: "data[7] = 8", description: "Largest element at index 7" },
    {
      expectedOutput: "data[0] = 1\ndata[1] = 2\ndata[2] = 3\ndata[3] = 4\ndata[4] = 5\ndata[5] = 6\ndata[6] = 7\ndata[7] = 8",
      description: "Full bitonic sorted output",
    },
  ],
  hint: "DMA into shared buf. Run bitonic stages: foreach stage, double stride, parallel compare-exchange buf[i] and buf[i^stride] when buf[i] > buf[partner]. DMA back to data.",
};
