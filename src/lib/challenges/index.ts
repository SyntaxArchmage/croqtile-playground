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
import { challenge13 } from "./13-element-wise-mul";
import { challenge14 } from "./14-row-sum";
import { challenge15 } from "./15-scale-vector";
import { challenge16 } from "./16-classify";
import { challenge17 } from "./17-transpose";
import { challenge18 } from "./18-histogram";
import { challenge19 } from "./19-swap-pairs";
import { challenge20 } from "./20-moving-average";
import { challenge21 } from "./21-running-maximum";
import { challenge22 } from "./22-matrix-column-sum";
import { challenge23 } from "./23-pipeline-sum";
import { challenge24 } from "./24-pack-unpack";

export const CHALLENGES: Challenge[] = [
  challenge01, challenge02, challenge03, challenge04,
  challenge05, challenge06, challenge07, challenge08,
  challenge09, challenge10, challenge11, challenge12,
  challenge13, challenge14, challenge15, challenge16,
  challenge17, challenge18, challenge19, challenge20,
  challenge21, challenge22, challenge23, challenge24,
];
