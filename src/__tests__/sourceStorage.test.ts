import { loadSavedSource, saveSource, SOURCE_STORAGE_KEY } from "@/lib/sourceStorage";

describe("sourceStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and loads source code", () => {
    expect(loadSavedSource()).toBeNull();
    saveSource("__co__ void hello() {}");
    expect(loadSavedSource()).toBe("__co__ void hello() {}");
  });

  it("uses the expected storage key", () => {
    saveSource("test code");
    expect(localStorage.getItem(SOURCE_STORAGE_KEY)).toBe("test code");
  });

  it("returns null from loadSavedSource when localStorage throws", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage error");
    });
    expect(loadSavedSource()).toBeNull();
    (Storage.prototype.getItem as jest.Mock).mockRestore();
  });

  it("saveSource catches when localStorage.setItem throws", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage full");
    });
    expect(() => saveSource("code")).not.toThrow();
    (Storage.prototype.setItem as jest.Mock).mockRestore();
  });
});
