/**
 * @jest-environment node
 */

jest.mock("@/lib/progress", () => ({
  getTutorialProgress: () => -1,
  markTutorialStep: () => {},
}));

jest.mock("@/lib/tutorials", () => ({
  TUTORIALS: [
    {
      id: "ch01",
      title: "Hello",
      description: "Test",
      steps: [{ title: "Step 1", content: "Content", code: "code" }],
    },
  ],
}));

import React from "react";
import { renderToString } from "react-dom/server";
import { TutorialPanel } from "@/components/TutorialPanel";

describe("TutorialPanel SSR init", () => {
  it("initializes step index without window during SSR", () => {
    const html = renderToString(
      <TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="ch01" />,
    );
    expect(html).toContain("Hello");
  });
});
