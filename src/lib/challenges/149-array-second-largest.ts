import type { Challenge } from "./index";

export const challenge149: Challenge = {
  id: "c149",
  title: "Array Second Largest",
  difficulty: "hard",
  description: `Find the **second largest** element in an array.

Given data = [3, 7, 2, 9, 1, 6, 4, 8], the largest is 9 and the second largest is 8.

Expected output:
\`\`\`
second = 8
\`\`\`

Track both the largest and second-largest values in a single \`foreach\` scan. When you find a new maximum, promote the old maximum to second place.`,
  starterCode: `__co__ void array_second_largest() {
  global int data[8];

  parallel {i} by [1] {
    data[0] = 3; data[1] = 7; data[2] = 2; data[3] = 9;
    data[4] = 1; data[5] = 6; data[6] = 4; data[7] = 8;
  }

  // TODO: scan with foreach, tracking largest and second largest
  // int largest = data[0];
  // int second = data[0];
  // foreach i in [0:8] {
  //   if (data[i] > largest) {
  //     second = largest;
  //     largest = data[i];
  //   } else if (data[i] > second && data[i] != largest) {
  //     second = data[i];
  //   }
  // }

  // println("second =", second);
}
`,
  tests: [
    {
      expectedOutput: "second = 8",
      description: "Second largest of the array is 8",
    },
  ],
  hint: "Initialize largest and second from data[0]. In foreach: if data[i] > largest, shift largest to second then update largest; else if data[i] > second, update second.",
};
