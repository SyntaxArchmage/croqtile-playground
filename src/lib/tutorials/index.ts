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

export const TUTORIALS: Tutorial[] = [ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12, ch13, ch14, ch15, ch16, ch17, ch18, ch19, ch20, ch21];
