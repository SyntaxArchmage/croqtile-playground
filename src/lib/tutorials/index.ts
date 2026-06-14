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

export { ch01 } from "./ch01-hello";
export { ch02 } from "./ch02-parallel";
export { ch03 } from "./ch03-memory";
export { ch04 } from "./ch04-foreach";
export { ch05 } from "./ch05-2d";
export { ch06 } from "./ch06-advanced";

import { ch01 } from "./ch01-hello";
import { ch02 } from "./ch02-parallel";
import { ch03 } from "./ch03-memory";
import { ch04 } from "./ch04-foreach";
import { ch05 } from "./ch05-2d";
import { ch06 } from "./ch06-advanced";

export const TUTORIALS: Tutorial[] = [ch01, ch02, ch03, ch04, ch05, ch06];
