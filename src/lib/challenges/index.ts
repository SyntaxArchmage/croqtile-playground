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
export { challenge04 } from "./04-dot-product";
export { challenge05 } from "./05-shared-accumulate";
export { challenge06 } from "./06-matrix-trace";

import { challenge01 } from "./01-hello";
import { challenge02 } from "./02-parallel-sum";
import { challenge03 } from "./03-dma-reverse";
import { challenge04 } from "./04-dot-product";
import { challenge05 } from "./05-shared-accumulate";
import { challenge06 } from "./06-matrix-trace";

export const CHALLENGES: Challenge[] = [challenge01, challenge02, challenge03, challenge04, challenge05, challenge06];
