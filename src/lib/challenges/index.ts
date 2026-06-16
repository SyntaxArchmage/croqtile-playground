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
  hints?: string[];
}

export function getChallengeHints(challenge: Challenge): string[] {
  if (challenge.hints?.length) {
    return challenge.hints.filter((h) => h.trim().length > 0);
  }
  if (challenge.hint?.trim()) {
    return [challenge.hint];
  }
  return [];
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
import { challenge71 } from "./71-sum-of-squares";
import { challenge72 } from "./72-matrix-add";
import { challenge73 } from "./73-array-search";
import { challenge74 } from "./74-outer-product";
import { challenge75 } from "./75-parallel-threshold";
import { challenge76 } from "./76-sliding-window-max";
import { challenge77 } from "./77-parallel-double";
import { challenge78 } from "./78-matrix-row-reverse";
import { challenge79 } from "./79-two-way-merge";
import { challenge80 } from "./80-array-rotate-right";
import { challenge81 } from "./81-vector-negate";
import { challenge82 } from "./82-matrix-trace-sum";
import { challenge83 } from "./83-batch-max";
import { challenge84 } from "./84-producer-consumer";
import { challenge85 } from "./85-array-reverse-in-place";
import { challenge86 } from "./86-matrix-scale";
import { challenge87 } from "./87-count-negatives";
import { challenge88 } from "./88-parallel-bitwise-or";
import { challenge89 } from "./89-staircase-pattern";
import { challenge90 } from "./90-three-way-partition";
import { challenge91 } from "./91-element-wise-max";
import { challenge92 } from "./92-matrix-symmetric-check";
import { challenge93 } from "./93-array-shift-left";
import { challenge94 } from "./94-parallel-fibonacci";
import { challenge95 } from "./95-row-wise-sort";
import { challenge96 } from "./96-array-difference";
import { challenge97 } from "./97-parallel-square-root";
import { challenge98 } from "./98-matrix-kronecker-product";
import { challenge99 } from "./99-bitwise-and-reduction";
import { challenge100 } from "./100-grand-reduction";
import { challenge101 } from "./101-parallel-clamp";
import { challenge102 } from "./102-matrix-column-sum";
import { challenge103 } from "./103-array-palindrome-check";
import { challenge104 } from "./104-running-average";
import { challenge105 } from "./105-array-merge";
import { challenge106 } from "./106-dot-product";
import { challenge107 } from "./107-matrix-row-swap";
import { challenge108 } from "./108-array-unique-count";
import { challenge109 } from "./109-parallel-modulo";
import { challenge110 } from "./110-matrix-lower-triangle";
import { challenge111 } from "./111-array-histogram";
import { challenge112 } from "./112-matrix-upper-triangle";
import { challenge113 } from "./113-parallel-absolute-value";
import { challenge114 } from "./114-string-length-counter";
import { challenge115 } from "./115-sliding-window-maximum";
import { challenge116 } from "./116-array-interleave";
import { challenge117 } from "./117-matrix-identity-check";
import { challenge118 } from "./118-parallel-power-of-two";
import { challenge119 } from "./119-array-dedup-adjacent";
import { challenge120 } from "./120-matrix-border-sum";
import { challenge121 } from "./121-parallel-sign";
import { challenge122 } from "./122-matrix-diagonal-sum";
import { challenge123 } from "./123-array-rotate-right";
import { challenge124 } from "./124-parallel-min-index";
import { challenge125 } from "./125-matrix-flatten";
import { challenge126 } from "./126-array-compact";
import { challenge127 } from "./127-parallel-ceiling-division";
import { challenge128 } from "./128-matrix-anti-diagonal";
import { challenge129 } from "./129-array-zip-sum";
import { challenge130 } from "./130-grand-convolution";
import { challenge131 } from "./131-parallel-even-odd-split";
import { challenge132 } from "./132-matrix-multiply-2x2";
import { challenge133 } from "./133-array-moving-sum";
import { challenge134 } from "./134-parallel-bit-count";
import { challenge135 } from "./135-matrix-spiral-border";
import { challenge136 } from "./136-array-group-by-sign";
import { challenge137 } from "./137-parallel-square-check";
import { challenge138 } from "./138-matrix-saddle-point";
import { challenge139 } from "./139-array-prefix-product";
import { challenge140 } from "./140-parallel-gcd";
import { challenge141 } from "./141-element-wise-multiply";
import { challenge142 } from "./142-matrix-row-max";
import { challenge143 } from "./143-array-binary-search";
import { challenge144 } from "./144-parallel-swap-adjacent";
import { challenge145 } from "./145-matrix-column-norm";
import { challenge146 } from "./146-array-count-if";
import { challenge147 } from "./147-parallel-xor";
import { challenge148 } from "./148-matrix-checkerboard";
import { challenge149 } from "./149-array-second-largest";
import { challenge150 } from "./150-grand-stencil";

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
  challenge69, challenge70, challenge71, challenge72,
  challenge73, challenge74, challenge75, challenge76,
  challenge77, challenge78, challenge79, challenge80,
  challenge81, challenge82, challenge83, challenge84,
  challenge85, challenge86, challenge87, challenge88,
  challenge89, challenge90, challenge91, challenge92,
  challenge93, challenge94, challenge95, challenge96,
  challenge97, challenge98, challenge99, challenge100,
  challenge101, challenge102, challenge103, challenge104,
  challenge105, challenge106, challenge107, challenge108,
  challenge109, challenge110,
  challenge111, challenge112, challenge113, challenge114,
  challenge115, challenge116, challenge117, challenge118,
  challenge119, challenge120,
  challenge121, challenge122, challenge123, challenge124,
  challenge125, challenge126, challenge127, challenge128,
  challenge129, challenge130,
  challenge131, challenge132, challenge133, challenge134,
  challenge135, challenge136, challenge137, challenge138,
  challenge139, challenge140,
  challenge141, challenge142, challenge143, challenge144,
  challenge145, challenge146, challenge147, challenge148,
  challenge149, challenge150,
];
