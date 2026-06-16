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
import { challenge151 } from "./151-matrix-trace";
import { challenge152 } from "./152-array-left-rotate-k";
import { challenge153 } from "./153-parallel-sigmoid";
import { challenge154 } from "./154-matrix-outer-product";
import { challenge155 } from "./155-array-mode";
import { challenge156 } from "./156-parallel-ceil";
import { challenge157 } from "./157-matrix-submatrix-sum";
import { challenge158 } from "./158-array-longest-run";
import { challenge159 } from "./159-parallel-distance";
import { challenge160 } from "./160-grand-matrix-lu";
import { challenge161 } from "./161-parallel-floor";
import { challenge162 } from "./162-matrix-norm";
import { challenge163 } from "./163-array-rotate-copy";
import { challenge164 } from "./164-parallel-lerp";
import { challenge165 } from "./165-matrix-block-sum";
import { challenge166 } from "./166-array-has-duplicate";
import { challenge167 } from "./167-parallel-rounding";
import { challenge168 } from "./168-matrix-horizontal-flip";
import { challenge169 } from "./169-array-pairwise-min";
import { challenge170 } from "./170-grand-fft-butterfly";
import { challenge171 } from "./171-parallel-normalize";
import { challenge172 } from "./172-matrix-vertical-flip";
import { challenge173 } from "./173-array-pack";
import { challenge174 } from "./174-parallel-threshold-zero";
import { challenge175 } from "./175-grand-spmv";
import { challenge176 } from "./176-parallel-min";
import { challenge177 } from "./177-matrix-row-sort";
import { challenge178 } from "./178-array-cumulative-max";
import { challenge179 } from "./179-parallel-ternary";
import { challenge180 } from "./180-matrix-determinant-2x2";
import { challenge181 } from "./181-array-split-even-odd";
import { challenge182 } from "./182-parallel-invert";
import { challenge183 } from "./183-matrix-minor";
import { challenge184 } from "./184-array-all-positive";
import { challenge185 } from "./185-parallel-map-apply";
import { challenge186 } from "./186-matrix-cofactor";
import { challenge187 } from "./187-array-scan-min";
import { challenge188 } from "./188-parallel-abs-diff";
import { challenge189 } from "./189-matrix-band";
import { challenge190 } from "./190-grand-bitonic-sort";
import { challenge191 } from "./191-array-segment-sum";
import { challenge192 } from "./192-parallel-exponential";
import { challenge193 } from "./193-matrix-cholesky";
import { challenge194 } from "./194-array-running-product";
import { challenge195 } from "./195-parallel-log-approx";
import { challenge196 } from "./196-matrix-skew-check";
import { challenge197 } from "./197-array-majority-element";
import { challenge198 } from "./198-parallel-saturate";
import { challenge199 } from "./199-matrix-eigenvalue-2x2";
import { challenge200 } from "./200-grand-jacobi-solver";
import { challenge201 } from "./201-array-flatten-2d";
import { challenge202 } from "./202-matrix-inverse-2x2";
import { challenge203 } from "./203-parallel-index-of";
import { challenge204 } from "./204-array-fill-pattern";
import { challenge205 } from "./205-matrix-hadamard";
import { challenge206 } from "./206-array-right-shift";
import { challenge207 } from "./207-parallel-reciprocal";
import { challenge208 } from "./208-matrix-power-diagonal";
import { challenge209 } from "./209-array-weighted-sum";
import { challenge210 } from "./210-grand-gaussian-elimination";
import { challenge211 } from "./211-array-zip";
import { challenge212 } from "./212-matrix-transpose-3x3";
import { challenge213 } from "./213-parallel-cube";
import { challenge214 } from "./214-array-slide";
import { challenge215 } from "./215-matrix-is-zero";
import { challenge216 } from "./216-parallel-min-max";
import { challenge217 } from "./217-array-remove-at";
import { challenge218 } from "./218-matrix-column-sort";
import { challenge219 } from "./219-parallel-factorial";
import { challenge220 } from "./220-grand-matrix-qr";
import { challenge221 } from "./221-array-insert-at";
import { challenge222 } from "./222-matrix-reshape";
import { challenge223 } from "./223-parallel-sum-of-digits";
import { challenge224 } from "./224-array-mean";
import { challenge225 } from "./225-grand-kmeans-step";
import { challenge226 } from "./226-array-median";
import { challenge227 } from "./227-matrix-scale-row";
import { challenge228 } from "./228-parallel-floor-division";
import { challenge229 } from "./229-array-range-check";
import { challenge230 } from "./230-matrix-add";
import { challenge231 } from "./231-parallel-truncate";
import { challenge232 } from "./232-array-standard-deviation";
import { challenge233 } from "./233-matrix-subtract";
import { challenge234 } from "./234-parallel-wrap";
import { challenge235 } from "./235-array-variance";
import { challenge236 } from "./236-matrix-diagonal-set";
import { challenge237 } from "./237-parallel-bitwise-not";
import { challenge238 } from "./238-array-inner-product";
import { challenge239 } from "./239-matrix-set-row";
import { challenge240 } from "./240-grand-strassen";
import { challenge241 } from "./241-array-outer-sum";
import { challenge242 } from "./242-matrix-set-column";
import { challenge243 } from "./243-parallel-negate";
import { challenge244 } from "./244-array-double";
import { challenge245 } from "./245-matrix-eye";
import { challenge246 } from "./246-parallel-square-root-approx";
import { challenge247 } from "./247-array-triple";
import { challenge248 } from "./248-matrix-ones";
import { challenge249 } from "./249-array-increment";
import { challenge250 } from "./250-grand-pagerank-step";

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
  challenge151, challenge152, challenge153, challenge154,
  challenge155, challenge156, challenge157, challenge158,
  challenge159, challenge160,
  challenge161, challenge162, challenge163, challenge164,
  challenge165, challenge166, challenge167, challenge168,
  challenge169, challenge170, challenge171, challenge172,
  challenge173, challenge174, challenge175,
  challenge176, challenge177, challenge178, challenge179,
  challenge180, challenge181, challenge182, challenge183,
  challenge184, challenge185, challenge186, challenge187,
  challenge188, challenge189, challenge190, challenge191,
  challenge192, challenge193, challenge194, challenge195,
  challenge196, challenge197, challenge198, challenge199,
  challenge200, challenge201, challenge202, challenge203,
  challenge204, challenge205, challenge206, challenge207,
  challenge208, challenge209, challenge210,
  challenge211, challenge212, challenge213, challenge214,
  challenge215, challenge216, challenge217, challenge218,
  challenge219, challenge220, challenge221, challenge222,
  challenge223, challenge224, challenge225,
  challenge226, challenge227, challenge228, challenge229,
  challenge230, challenge231, challenge232, challenge233,
  challenge234, challenge235, challenge236, challenge237,
  challenge238, challenge239, challenge240,
  challenge241, challenge242, challenge243, challenge244,
  challenge245, challenge246, challenge247, challenge248,
  challenge249, challenge250,
];
