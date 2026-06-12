export interface TestCase {
  input?: string;
  expectedOutput: string;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  starterCode: string;
  tests: TestCase[];
  hint?: string;
}

export { challenge01 } from "./01-hello";
export { challenge02 } from "./02-parallel-sum";
export { challenge03 } from "./03-dma-reverse";

import { challenge01 } from "./01-hello";
import { challenge02 } from "./02-parallel-sum";
import { challenge03 } from "./03-dma-reverse";

export const CHALLENGES: Challenge[] = [challenge01, challenge02, challenge03];
