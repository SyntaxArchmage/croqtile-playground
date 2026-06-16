import type { Challenge } from "./index";

export const challenge223: Challenge = {
  id: "c223",
  title: "Parallel Sum of Digits",
  difficulty: "hard",
  description: `Compute the **sum of digits** of each integer element using \`parallel\`.

Given data = [123, 45, 789, 1000]:

| value | digits   | sum |
|-------|----------|-----|
| 123   | 1+2+3    | 6   |
| 45    | 4+5      | 9   |
| 789   | 7+8+9    | 24  |
| 1000  | 1+0+0+0  | 1   |

Expected output:
\`\`\`
digit_sum[0] = 6
digit_sum[1] = 9
digit_sum[2] = 24
digit_sum[3] = 1
\`\`\`

Each thread repeatedly takes \`n % 10\`, adds to a running total, and divides \`n\` by 10 until zero.`,
  starterCode: `__co__ void parallel_sum_of_digits() {
  global int data[4];
  global int digit_sum[4];

  parallel {i} by [1] {
    data[0] = 123; data[1] = 45;
    data[2] = 789; data[3] = 1000;
  }

  // TODO: sum digits per element in parallel {i} by [4]
  // int n = data[i];
  // int sum = 0;
  // while (n > 0) {
  //   sum = sum + (n % 10);
  //   n = n / 10;
  // }
  // digit_sum[i] = sum;

  parallel {i} by [4] {
    println("digit_sum[", i, "] =", digit_sum[i]);
  }
}
`,
  tests: [
    { expectedOutput: "digit_sum[0] = 6", description: "Sum of digits of 123 is 6" },
    { expectedOutput: "digit_sum[1] = 9", description: "Sum of digits of 45 is 9" },
    { expectedOutput: "digit_sum[2] = 24", description: "Sum of digits of 789 is 24" },
    { expectedOutput: "digit_sum[3] = 1", description: "Sum of digits of 1000 is 1" },
    {
      expectedOutput: "digit_sum[0] = 6\ndigit_sum[1] = 9\ndigit_sum[2] = 24\ndigit_sum[3] = 1",
      description: "Full digit-sum output",
    },
  ],
  hint: "Each thread: loop while n > 0, add n % 10 to sum, then n = n / 10.",
};
