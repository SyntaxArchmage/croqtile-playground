import type { Tutorial } from "./index";

export const ch44: Tutorial = {
  id: "ch44",
  title: "Image Processing Basics",
  description: "Simple image operations: representing images as 2D arrays, brightness and contrast adjustment, and simple convolution for blur and edge detection.",
  steps: [
    {
      title: "Representing images as 2D arrays",
      content: `An image is a **2D grid of pixels**. In Croqtile, store it as a row-major \`global float image[height, width]\` where \`image[row, col]\` is the pixel intensity.

\`\`\`croqtile
parallel {r, c} by [H, W] {
  image[r, c] = (float)(r * W + c);
}
\`\`\`

Each pixel can be accessed independently — one thread per pixel is the natural GPU mapping. Grayscale uses one channel; RGB would use three arrays or interleaved storage.

Try the example — fill a 3×4 image with row-major indices and print each pixel.`,
      code: `__co__ void image_2d_array() {
  global float image[3, 4];
  int H = 3;
  int W = 4;

  parallel {r, c} by [3, 4] {
    image[r, c] = (float)(r * W + c);
  }

  parallel {r, c} by [3, 4] {
    println("pixel[", r, ",", c, "] =", image[r, c]);
  }
}
`,
      hint: "Row 0: 0,1,2,3. Row 1: 4,5,6,7. Row 2: 8,9,10,11.",
    },
    {
      title: "Brightness and contrast adjustment",
      content: `**Brightness** adds a constant offset to every pixel. **Contrast** scales pixel values around a midpoint:

\`\`\`croqtile
output = (input - midpoint) * contrast + midpoint + brightness;
\`\`\`

- \`brightness > 0\` lightens the image
- \`contrast > 1\` stretches values away from the midpoint

Apply with one thread per pixel — fully parallel, no dependencies between pixels.

Try the example — brighten by 10 and double contrast around midpoint 128.`,
      code: `__co__ void brightness_contrast() {
  global float input[4];
  global float output[4];
  float brightness = 10.0f;
  float contrast = 2.0f;
  float midpoint = 128.0f;

  parallel {i} by [4] {
    input[i] = (float)(100 + i * 20);
  }

  parallel {i} by [4] {
    output[i] = (input[i] - midpoint) * contrast + midpoint + brightness;
  }

  parallel {i} by [4] {
    println("in=", input[i], "out=", output[i]);
  }
}
`,
      hint: "Input 100,120,140,160. After adjust: 82,122,162,202.",
    },
    {
      title: "Simple convolution (blur, edge detection)",
      content: `**Convolution** applies a small **kernel** (filter) to each pixel and its neighbors. A 3×3 kernel slides over the image:

\`\`\`croqtile
sum = 0.0f;
foreach kr in [0:3] {
  foreach kc in [0:3] {
    sum = sum + input[r+kr-1, c+kc-1] * kernel[kr, kc];
  }
}
\`\`\`

Common kernels:
- **Box blur** — average of 3×3 neighbors (each weight 1/9)
- **Edge detection (Sobel)** — difference between left and right neighbors

Handle boundaries by clamping or skipping edge pixels.

Try the example — 3-point horizontal blur (average of left, center, right).`,
      code: `__co__ void convolution_blur() {
  global float input[8];
  global float output[8];
  int W = 8;

  parallel {i} by [8] {
    input[i] = (float)((i + 1) * 10);
  }

  parallel {i} by [8] {
    if (i == 0 || i == W - 1) {
      output[i] = input[i];
    } else {
      output[i] = (input[i - 1] + input[i] + input[i + 1]) / 3.0f;
    }
  }

  parallel {i} by [8] {
    println("input[", i, "] =", input[i], "output[", i, "] =", output[i]);
  }
}
`,
      hint: "Input 10,20,...,80. Interior smoothed: e.g. index 1 → (10+20+30)/3 = 20. Edges pass through.",
    },
  ],
};
