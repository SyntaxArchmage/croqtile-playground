import type { Tutorial } from "./index";

export const ch34: Tutorial = {
  id: "ch34",
  title: "Data Structures",
  description: "Build classic data structures in Croqtile: stack with a top pointer, queue with head/tail indices, and hash table with linear probing.",
  steps: [
    {
      title: "Stack using shared array with a pointer",
      content: `A **stack** is a LIFO structure: push adds to the top, pop removes from the top. In Croqtile, use a **shared array** for storage and a **top pointer** (integer index) that tracks the next free slot.

**Operations:**
- \`push(x)\`: write \`stack[top] = x\`, then \`top = top + 1\`
- \`pop()\`: \`top = top - 1\`, return \`stack[top]\`

Stack mutations are inherently sequential — wrap push/pop in \`exec { }\` so only one thread updates \`top\` at a time.

\`\`\`croqtile
exec {
  stack[top] = value;
  top = top + 1;
}
\`\`\`

Use \`shared\` memory when the stack lives inside a pipeline stage; use \`global\` when it persists across stages.

Try the example — push four values, pop two, and print the remaining stack contents.`,
      code: `__co__ void stack_with_pointer() {
  shared float stack[8];
  int top = 0;

  exec {
    stack[top] = 10.0f;
    top = top + 1;
    stack[top] = 20.0f;
    top = top + 1;
    stack[top] = 30.0f;
    top = top + 1;
    stack[top] = 40.0f;
    top = top + 1;
  }
  println("after push: top =", top);

  float popped = 0.0f;
  exec {
    top = top - 1;
    popped = stack[top];
    top = top - 1;
    popped = stack[top];
  }
  println("popped twice, top =", top, "last pop =", popped);

  exec {
    foreach i in [0:top] {
      println("stack[", i, "] =", stack[i]);
    }
  }
}
`,
      hint: "After pushing 10,20,30,40 and popping twice, top=2 and stack[0]=10, stack[1]=20 remain.",
    },
    {
      title: "Queue with head/tail indices",
      content: `A **queue** is FIFO: enqueue at the tail, dequeue from the head. Track two indices in a circular buffer:

- \`enqueue(x)\`: write \`buf[tail] = x\`, advance \`tail = (tail + 1) % capacity\`
- \`dequeue()\`: read \`buf[head]\`, advance \`head = (head + 1) % capacity\`

Keep a \`count\` variable to distinguish full from empty when head == tail.

\`\`\`croqtile
buf[tail] = item;
tail = (tail + 1) % cap;
count = count + 1;
\`\`\`

All enqueue/dequeue logic runs sequentially inside \`exec\`. Parallel \`parallel\` blocks can read the buffer once it is filled.

Try the example — enqueue five integers, dequeue three, print the remaining queue.`,
      code: `__co__ void queue_head_tail() {
  global int buf[8];
  global int head[1];
  global int tail[1];
  global int count[1];
  int cap = 8;

  head[0] = 0;
  tail[0] = 0;
  count[0] = 0;

  exec {
    foreach k in [0:5] {
      buf[tail[0]] = k + 1;
      tail[0] = (tail[0] + 1) % cap;
      count[0] = count[0] + 1;
    }
  }
  println("enqueued 5 items, count =", count[0]);

  exec {
    foreach k in [0:3] {
      int item = buf[head[0]];
      head[0] = (head[0] + 1) % cap;
      count[0] = count[0] - 1;
      println("dequeued", item);
    }
  }

  println("remaining count =", count[0]);
  exec {
    foreach k in [0:count[0]] {
      int idx = (head[0] + k) % cap;
      println("buf[", idx, "] =", buf[idx]);
    }
  }
}
`,
      hint: "Enqueue 1..5, dequeue 1..3. Remaining queue holds 4 and 5 in order.",
    },
    {
      title: "Hash table with linear probing",
      content: `A **hash table** maps keys to values using a hash function and an array of slots. **Linear probing** resolves collisions by scanning forward until an empty slot is found.

**Insert algorithm:**
1. \`h = key % capacity\`
2. While \`keys[h] != EMPTY\` and \`keys[h] != key\`: \`h = (h + 1) % capacity\`
3. Store \`keys[h] = key\`, \`vals[h] = value\`

**Lookup** follows the same probe sequence until the key matches or an empty slot is reached.

Use \`-1\` as the empty sentinel. Keep capacity larger than the number of keys to limit probe chains.

Try the example — insert four key-value pairs with collisions and look up two keys.`,
      code: `__co__ void hash_linear_probing() {
  global int keys[8];
  global int vals[8];
  int cap = 8;
  int empty = -1;

  exec {
    foreach i in [0:8] {
      keys[i] = empty;
      vals[i] = 0;
    }
  }

  exec {
    int key = 10;
    int val = 100;
    int h = key % cap;
    while (keys[h] != empty && keys[h] != key) {
      h = (h + 1) % cap;
    }
    keys[h] = key;
    vals[h] = val;
    println("insert", key, "->", val, "at slot", h);
  }

  exec {
    foreach k in [0:4] {
      int key = 18 + k;
      int val = (k + 1) * 10;
      int h = key % cap;
      while (keys[h] != empty && keys[h] != key) {
        h = (h + 1) % cap;
      }
      keys[h] = key;
      vals[h] = val;
      println("insert", key, "->", val, "at slot", h);
    }
  }

  exec {
    foreach lookup in [10, 19] {
      int h = lookup % cap;
      while (keys[h] != empty && keys[h] != lookup) {
        h = (h + 1) % cap;
      }
      if (keys[h] == lookup) {
        println("lookup", lookup, "=", vals[h]);
      } else {
        println("lookup", lookup, "not found");
      }
    }
  }
}
`,
      hint: "Keys 10, 18, 19, 20, 21 may collide at the same hash bucket. Linear probing finds the next free slot for each insert.",
    },
  ],
};
