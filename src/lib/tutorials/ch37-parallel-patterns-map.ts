import type { Tutorial } from "./index";

export const ch37: Tutorial = {
  id: "ch37",
  title: "Parallel Patterns: Map",
  description: "The map pattern in Croqtile: one-to-one element transformation, multi-field struct mapping, and chained transform pipelines.",
  steps: [
    {
      title: "One-to-one element transformation",
      content: `The **map** pattern applies an independent function to every element. Each thread reads one input slot and writes one output slot — no cross-thread dependencies.

\`\`\`croqtile
parallel {i} by [N] {
  output[i] = f(input[i]);
}
\`\`\`

Map is embarrassingly parallel: thread \`i\` never reads \`output[j]\` for \`j != i\`. Use separate input and output arrays when the transform is not in-place.

Try the example — square each element and add one.`,
      code: `__co__ void map_transform() {
  global float input[8];
  global float output[8];

  parallel {i} by [8] {
    input[i] = (float)(i + 1);
  }

  parallel {i} by [8] {
    output[i] = input[i] * input[i] + 1.0f;
  }

  parallel {i} by [8] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "For i=0, input=1, output=1*1+1=2. For i=3, input=4, output=17.",
    },
    {
      title: "Multi-field struct mapping",
      content: `When each record has multiple fields, represent a **struct** with parallel arrays — one array per field, same index across arrays.

\`\`\`croqtile
parallel {i} by [N] {
  out_x[i] = in_x[i] * scale;
  out_y[i] = in_y[i] * scale;
  out_z[i] = in_z[i] + offset;
}
\`\`\`

All fields for record \`i\` are updated by the same thread, preserving alignment. This mirrors SoA (struct-of-arrays) layout on GPUs.

Try the example — scale 2D points (x, y) and compute their distance from the origin.`,
      code: `__co__ void map_multifield() {
  global float in_x[4];
  global float in_y[4];
  global float out_x[4];
  global float out_y[4];
  global float dist[4];
  float scale = 2.0f;

  parallel {i} by [4] {
    in_x[i] = (float)(i + 1);
    in_y[i] = (float)(i * 2);
  }

  parallel {i} by [4] {
    out_x[i] = in_x[i] * scale;
    out_y[i] = in_y[i] * scale;
    dist[i] = out_x[i] * out_x[i] + out_y[i] * out_y[i];
  }

  parallel {i} by [4] {
    println("point[", i, "] scaled=(", out_x[i], ",", out_y[i], ") dist2=", dist[i]);
  }
}
`,
      hint: "Point 0: in=(1,0), scaled=(2,0), dist2=4. Point 1: in=(2,2), scaled=(4,4), dist2=32.",
    },
    {
      title: "Chained maps (transform pipelines)",
      content: `Complex transforms decompose into a **pipeline of maps** — each stage reads the previous output and writes a new buffer.

\`\`\`croqtile
// Stage 1: normalize
parallel {i} by [N] { tmp[i] = data[i] / max_val; }
// Stage 2: apply nonlinearity
parallel {i} by [N] { out[i] = tmp[i] * tmp[i]; }
\`\`\`

Chaining keeps each \`parallel\` block simple and testable. Use intermediate arrays (\`tmp\`, \`stage2\`) rather than overwriting in place when stages depend on prior values.

Try the example — subtract mean, then clamp negatives to zero (ReLU-style).`,
      code: `__co__ void map_pipeline() {
  global float data[6];
  global float centered[6];
  global float output[6];
  int N = 6;

  parallel {i} by [6] {
    data[i] = (float)(i + 1);
  }

  float sum = 0.0f;
  foreach i in [0:N] {
    sum = sum + data[i];
  }
  float mean = sum / (float)N;

  parallel {i} by [6] {
    centered[i] = data[i] - mean;
  }

  parallel {i} by [6] {
    if (centered[i] < 0.0f) {
      output[i] = 0.0f;
    } else {
      output[i] = centered[i];
    }
  }

  parallel {i} by [6] {
    println("output[", i, "] =", output[i]);
  }
}
`,
      hint: "Mean of 1..6 is 3.5. After centering: -2.5, -1.5, -0.5, 0.5, 1.5, 2.5. ReLU zeros the first three.",
    },
  ],
};
