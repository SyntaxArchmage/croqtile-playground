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
import { challenge25 } from "./25-rotate-left";
import { challenge26 } from "./26-diagonal-sum";
import { challenge27 } from "./27-vector-normalize";
import { challenge28 } from "./28-checkerboard";
import { challenge29 } from "./29-clamp-values";
import { challenge30 } from "./30-stencil-average";
import { challenge31 } from "./31-all-positive";
import { challenge32 } from "./32-matrix-multiply";
import { challenge33 } from "./33-interleave-arrays";
import { challenge34 } from "./34-matrix-row-swap";
import { challenge35 } from "./35-count-evens";
import { challenge36 } from "./36-parallel-max-index";
import { challenge37 } from "./37-array-reverse";
import { challenge38 } from "./38-even-odd-split";
import { challenge39 } from "./39-matrix-diagonal";
import { challenge40 } from "./40-weighted-average";
import { challenge41 } from "./41-running-sum";
import { challenge42 } from "./42-matrix-flatten";
import { challenge43 } from "./43-parallel-absolute";
import { challenge44 } from "./44-ring-broadcast";
import { challenge45 } from "./45-string-builder";
import { challenge46 } from "./46-matrix-border";
import { challenge47 } from "./47-prefix-product";
import { challenge48 } from "./48-scatter-gather";
import { challenge49 } from "./49-parallel-copy";
import { challenge50 } from "./50-zigzag-traversal";
import { challenge51 } from "./51-vector-add";
import { challenge52 } from "./52-spiral-count";
import { challenge53 } from "./53-batch-normalize";
import { challenge54 } from "./54-parallel-sort-check";
import { challenge55 } from "./55-matrix-identity";
import { challenge56 } from "./56-array-deduplicate";
import { challenge57 } from "./57-parallel-clamp";
import { challenge58 } from "./58-reduction-tree";
import { challenge59 } from "./59-array-fill";
import { challenge60 } from "./60-matrix-row-norm";
import { challenge61 } from "./61-parallel-guard";
import { challenge62 } from "./62-two-pass-filter";
import { challenge63 } from "./63-parallel-min-max";
import { challenge64 } from "./64-matrix-column-swap";
import { challenge65 } from "./65-exclusive-prefix-sum";
import { challenge66 } from "./66-array-compress";
import { challenge67 } from "./67-parallel-decrement";
import { challenge68 } from "./68-matrix-diagonal-fill";
import { challenge69 } from "./69-running-minimum";
import { challenge70 } from "./70-double-buffer-copy";

export const CHALLENGES: Challenge[] = [
  challenge01, challenge02, challenge03, challenge04,
  challenge05, challenge06, challenge07, challenge08,
  challenge09, challenge10, challenge11, challenge12,
  challenge13, challenge14, challenge15, challenge16,
  challenge17, challenge18, challenge19, challenge20,
  challenge21, challenge22, challenge23, challenge24,
  challenge25, challenge26, challenge27, challenge28,
  challenge29, challenge30, challenge31, challenge32,
  challenge33, challenge34, challenge35, challenge36,
  challenge37, challenge38, challenge39, challenge40,
  challenge41, challenge42, challenge43, challenge44,
  challenge45, challenge46, challenge47, challenge48,
  challenge49, challenge50, challenge51, challenge52,
  challenge53, challenge54, challenge55, challenge56,
  challenge57, challenge58, challenge59, challenge60,
  challenge61, challenge62, challenge63, challenge64,
  challenge65, challenge66, challenge67, challenge68,
  challenge69, challenge70,
];
