import type { Tutorial } from "./index";

export const ch47: Tutorial = {
  id: "ch47",
  title: "Work Distribution",
  description: "Distributing work across threads: static partitioning, dynamic counters, and work stealing concepts.",
  steps: [
    {
      title: "Static work distribution",
      content: `**Static distribution** assigns fixed chunks to each thread before execution. Thread \`t\` handles indices \`[t * chunk, (t+1) * chunk)\`.

\`\`\`croqtile
int chunk = N / num_threads;
parallel {t} by [num_threads] {
  int start = t * chunk;
  int end = start + chunk;
  foreach i in [start:end] {
    output[i] = transform(input[i]);
  }
}
\`\`\`

**Pros:** no synchronization overhead, predictable memory access.
**Cons:** poor load balance when work per element varies.

Try the example — four threads each process two elements of an 8-element array.`,
      code: `__co__ void static_distribution() {
  global float input[8];
  global float output[8];
  int N = 8;
  int num_threads = 4;
  int chunk = 2;

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
  }

  parallel {t} by [4] {
    int start = t * chunk;
    int end = start + chunk;
    foreach i in [start:end] {
      output[i] = input[i] * 2.0f;
    }
  }

  parallel {i} by [8] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "Thread 0 handles indices 0–1, thread 1 handles 2–3, etc. output[i] = 2*(i+1).",
    },
    {
      title: "Dynamic work distribution with shared counters",
      content: `**Dynamic distribution** uses a shared counter so threads grab the next available task at runtime. Idle threads stay busy when work is uneven.

Real GPU pattern:
\`\`\`croqtile
// atomic: task_id = next_task++;
// process work[task_id]
\`\`\`

In Croqtile, model this with a sequential \`foreach\` that assigns tasks round-robin, or use \`parallel\` with a precomputed task map:

\`\`\`croqtile
parallel {i} by [N] {
  int owner = i % num_threads;
  task_owner[i] = owner;
}
\`\`\`

Try the example — eight tasks assigned dynamically across four workers using modulo scheduling.`,
      code: `__co__ void dynamic_distribution() {
  global float work[8];
  global int task_owner[8];
  int N = 8;
  int num_workers = 4;

  parallel {i} by [8] {
    work[i] = (float)(i + 1);
  }

  parallel {i} by [8] {
    task_owner[i] = i % num_workers;
  }

  parallel {w} by [4] {
    println("worker", w, "tasks:");
    parallel {i} by [8] {
      if (task_owner[i] == w) {
        println("  task", i, "value =", work[i]);
      }
    }
  }
}
`,
      hint: "Worker 0 gets tasks 0,4; worker 1 gets 1,5; worker 2 gets 2,6; worker 3 gets 3,7.",
    },
    {
      title: "Work stealing concepts",
      content: `**Work stealing** lets idle threads take tasks from busy threads' queues. Each thread has a local deque; when empty, it steals from another thread's tail.

Conceptual flow:
1. Threads start with static chunks (local queues)
2. A thread that finishes early **steals** from a neighbor's queue
3. Load balance improves without a global lock on every task

In Croqtile, model stealing with shared events and pipeline stages — one stage distributes work, another rebalances overflow:

\`\`\`croqtile
pipeline {
  stage { /* assign initial chunks */ }
  stage { /* process local queue */ }
  stage { /* steal remaining tasks */ }
}
\`\`\`

Try the example — two workers with uneven workloads; the second stage processes overflow tasks.`,
      code: `__co__ void work_stealing_concept() {
  global float tasks[6];
  global float results[6];
  shared float local_a[4];
  shared float local_b[2];
  shared event assigned;
  int heavy_count = 4;

  parallel {i} by [6] {
    tasks[i] = (float)(i + 1);
  }

  arrive assigned;

  pipeline {
    stage {
      exec {
        parallel {i} by [4] {
          local_a[i] = tasks[i];
        }
        parallel {i} by [2] {
          local_b[i] = tasks[heavy_count + i];
        }
        arrive assigned;
      }
    }
    stage {
      exec {
        wait assigned;
        parallel {i} by [4] {
          results[i] = local_a[i] * 2.0f;
        }
        parallel {i} by [2] {
          results[heavy_count + i] = local_b[i] * 2.0f;
        }
        parallel {i} by [6] {
          println("results[", i, "] =", results[i]);
        }
      }
    }
  }
}
`,
      hint: "Worker A gets 4 heavy tasks (1–4), worker B gets 2 light tasks (5–6). All doubled.",
    },
  ],
};
