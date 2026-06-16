export interface TutorialStep {
  title: string;
  content: string;
  code: string;
  hint?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
}

import { ch01 } from "./ch01-hello";
import { ch02 } from "./ch02-parallel";
import { ch03 } from "./ch03-memory";
import { ch04 } from "./ch04-foreach";
import { ch05 } from "./ch05-2d";
import { ch06 } from "./ch06-advanced";
import { ch07 } from "./ch07-functions";
import { ch08 } from "./ch08-conditionals";
import { ch09 } from "./ch09-patterns";
import { ch10 } from "./ch10-debugging";
import { ch11 } from "./ch11-types";
import { ch12 } from "./ch12-slicing";
import { ch13 } from "./ch13-synchronization";
import { ch14 } from "./ch14-performance";
import { ch15 } from "./ch15-pitfalls";
import { ch16 } from "./ch16-real-world";
import { ch17 } from "./ch17-rotate";
import { ch18 } from "./ch18-error-handling";
import { ch19 } from "./ch19-multi-dim";
import { ch20 } from "./ch20-dma-patterns";
import { ch21 } from "./ch21-pipeline-stages-events";
import { ch22 } from "./ch22-debugging-strategies";
import { ch23 } from "./ch23-working-with-strings";
import { ch24 } from "./ch24-optimization-techniques";
import { ch25 } from "./ch25-pattern-matching-conditionals";
import { ch26 } from "./ch26-best-practices";
import { ch27 } from "./ch27-putting-it-all-together";
import { ch28 } from "./ch28-array-operations-library";
import { ch29 } from "./ch29-matrix-operations";
import { ch30 } from "./ch30-event-driven-programming";
import { ch31 } from "./ch31-performance-measurement";
import { ch32 } from "./ch32-common-algorithms";
import { ch33 } from "./ch33-debugging-techniques";
import { ch34 } from "./ch34-data-structures";
import { ch35 } from "./ch35-optimization-patterns";
import { ch36 } from "./ch36-error-handling-patterns";
import { ch37 } from "./ch37-parallel-patterns-map";
import { ch38 } from "./ch38-parallel-patterns-reduce";
import { ch39 } from "./ch39-parallel-patterns-scatter-gather";
import { ch40 } from "./ch40-advanced-dma";

export const TUTORIALS: Tutorial[] = [ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12, ch13, ch14, ch15, ch16, ch17, ch18, ch19, ch20, ch21, ch22, ch23, ch24, ch25, ch26, ch27, ch28, ch29, ch30, ch31, ch32, ch33, ch34, ch35, ch36, ch37, ch38, ch39, ch40];
