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

export const TUTORIALS: Tutorial[] = [ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12, ch13, ch14];
