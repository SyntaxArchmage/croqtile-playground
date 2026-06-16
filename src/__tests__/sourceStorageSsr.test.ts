/**
 * @jest-environment node
 */

import { loadSavedSource, saveSource } from "@/lib/sourceStorage";

describe("sourceStorage SSR", () => {
  it("saveSource and loadSavedSource handle missing window", () => {
    expect(() => saveSource("code")).not.toThrow();
    expect(loadSavedSource()).toBeNull();
  });
});
