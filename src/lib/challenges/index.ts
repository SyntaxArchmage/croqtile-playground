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
export { challenge07 } from "./07-pipeline-stages";
export { challenge08 } from "./08-nested-parallel";
export { challenge09 } from "./09-tiled-copy";
export { challenge10 } from "./10-parallel-min";
export { challenge11 } from "./11-prefix-sum";
export { challenge12 } from "./12-broadcast";

import { challenge01 } from "./01-hello";
import { challenge02 } from "./02-parallel-sum";
import { challenge03 } from "./03-dma-reverse";
import { challenge04 } from "./04-dot-product";
import { challenge05 } from "./05-shared-accumulate";
import { challenge06 } from "./06-matrix-trace";
import { challenge07 } from "./07-pipeline-stages";
import { challenge08 } from "./08-nested-parallel";
import { challenge09 } from "./09-tiled-copy";
import { challenge10 } from "./10-parallel-min";
import { challenge11 } from "./11-prefix-sum";
import { challenge12 } from "./12-broadcast";

export const CHALLENGES: Challenge[] = [
  challenge01, challenge02, challenge03, challenge04,
  challenge05, challenge06, challenge07, challenge08,
  challenge09, challenge10, challenge11, challenge12,
];
