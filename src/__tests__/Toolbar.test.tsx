import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Toolbar } from "@/components/Toolbar";
import * as progress from "@/lib/progress";

const defaultProps = {
  target: "cc",
  onTargetChange: jest.fn(),
  onRun: jest.fn(),
  onCompile: jest.fn(),
  onDumpAST: jest.fn(),
  onLoadCode: jest.fn(),
  getCode: jest.fn(() => "test code"),
  onShare: jest.fn(),
  onFormat: jest.fn(),
  onTogglePanel: jest.fn(),
  panelMode: "closed" as const,
  status: "ready" as const,
  settings: { fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const },
  onSettingsChange: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Toolbar", () => {
  it("renders Run button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText(/Run/)).toBeInTheDocument();
  });

  it("renders Compile button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("Compile")).toBeInTheDocument();
  });

  it("renders AST button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("AST")).toBeInTheDocument();
  });

  it("renders Share button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("renders File dropdown", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByLabelText("File menu")).toBeInTheDocument();
  });

  it("shows file menu items when File dropdown opened", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    expect(screen.getByText("Open file...")).toBeInTheDocument();
    expect(screen.getByText("Download .co")).toBeInTheDocument();
    expect(screen.getByText("Format code")).toBeInTheDocument();
  });

  it("loads file content via Open in File menu", () => {
    render(<Toolbar {...defaultProps} />);

    const fileContent = "__co__ void loaded() {\n  println(\"ok\");\n}\n";
    const file = new File([fileContent], "test.co", { type: "text/plain" });

    let loadHandler: ((ev: ProgressEvent<FileReader>) => void) | null = null;
    const readAsText = jest.fn(function (this: FileReader) {
      loadHandler = this.onload as (ev: ProgressEvent<FileReader>) => void;
    });
    jest.spyOn(window, "FileReader").mockImplementation(function (this: FileReader) {
      this.readAsText = readAsText;
      Object.defineProperty(this, "result", {
        get: () => fileContent,
      });
      return this;
    } as unknown as typeof FileReader);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.accept).toBe(".co,.txt");

    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);

    expect(readAsText).toHaveBeenCalledWith(file);
    expect(loadHandler).not.toBeNull();
    loadHandler!({} as ProgressEvent<FileReader>);
    expect(defaultProps.onLoadCode).toHaveBeenCalledWith(fileContent);
  });

  it("opens file picker when Open file... clicked in File menu", () => {
    render(<Toolbar {...defaultProps} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(input, "click");
    fireEvent.click(screen.getByLabelText("File menu"));
    fireEvent.click(screen.getByText("Open file..."));
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("calls onFormat when Format code clicked in File menu", () => {
    const onFormat = jest.fn();
    render(<Toolbar {...defaultProps} onFormat={onFormat} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    fireEvent.click(screen.getByText("Format code"));
    expect(onFormat).toHaveBeenCalledTimes(1);
  });

  it("downloads code as .co file via File menu", () => {
    jest.useFakeTimers();
    const getCode = jest.fn(() => "__co__ void hello() {}");
    render(<Toolbar {...defaultProps} getCode={getCode} />);

    const click = jest.fn();
    const anchor = document.createElement("a");
    anchor.click = click;
    const origCreateElement = document.createElement.bind(document);
    const createElementSpy = jest.spyOn(document, "createElement").mockImplementation((tag: string, options?: ElementCreationOptions) => {
      if (tag === "a") return anchor;
      return origCreateElement(tag, options);
    });
    const mockCreateObjectURL = jest.fn(() => "blob:test");
    const mockRevokeObjectURL = jest.fn();
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;

    try {
      fireEvent.click(screen.getByLabelText("File menu"));
      fireEvent.click(screen.getByText("Download .co"));
      expect(getCode).toHaveBeenCalledTimes(1);
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(anchor.download).toMatch(/^hello-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.co$/);
      expect(click).toHaveBeenCalledTimes(1);
      act(() => {
        jest.runAllTimers();
      });
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:test");
    } finally {
      createElementSpy.mockRestore();
      jest.useRealTimers();
    }
  });

  it("calls onRun when Run clicked", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByText(/Run/));
    expect(defaultProps.onRun).toHaveBeenCalledTimes(1);
  });

  it("calls onCompile when Compile clicked", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByText("Compile"));
    expect(defaultProps.onCompile).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when running", () => {
    render(<Toolbar {...defaultProps} status="running" />);
    const runBtn = screen.getByText(/Run/).closest("button");
    expect(runBtn).toBeDisabled();
  });

  it("renders target selector with cc", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByDisplayValue("cc (C++ CPU)")).toBeInTheDocument();
  });

  it("renders branding text", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("Croqtile")).toBeInTheDocument();
    expect(screen.getByText("Playground")).toBeInTheDocument();
  });

  it("calls onDumpAST when AST clicked", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByText("AST"));
    expect(defaultProps.onDumpAST).toHaveBeenCalledTimes(1);
  });

  it("calls onShare and shows Copied feedback on Share click", () => {
    jest.useFakeTimers();
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByText("Share"));
    expect(defaultProps.onShare).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Share")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("calls onTogglePanel with tutorial mode", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
    expect(defaultProps.onTogglePanel).toHaveBeenCalledWith("tutorial");
  });

  it("calls onTogglePanel with challenge mode", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Toggle challenge panel"));
    expect(defaultProps.onTogglePanel).toHaveBeenCalledWith("challenge");
  });

  it("highlights tutorial button when active", () => {
    render(<Toolbar {...defaultProps} panelMode="tutorial" />);
    const btn = screen.getByLabelText("Toggle tutorial panel");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights challenge button when active", () => {
    render(<Toolbar {...defaultProps} panelMode="challenge" />);
    const btn = screen.getByLabelText("Toggle challenge panel");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onTargetChange when selector changes", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.change(screen.getByLabelText("Compilation target"), { target: { value: "cute" } });
    expect(defaultProps.onTargetChange).toHaveBeenCalledWith("cute");
  });

  it("loads example when selected", () => {
    render(<Toolbar {...defaultProps} />);
    const select = screen.getByLabelText("Load example code");
    fireEvent.change(select, { target: { value: "hello" } });
    expect(defaultProps.onLoadCode).toHaveBeenCalled();
  });

  it("ignores example select with invalid value", () => {
    render(<Toolbar {...defaultProps} />);
    const select = screen.getByLabelText("Load example code");
    fireEvent.change(select, { target: { value: "nonexistent-id" } });
    expect(defaultProps.onLoadCode).not.toHaveBeenCalled();
  });

  it("renders settings menu button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByLabelText("Settings menu")).toBeInTheDocument();
  });

  it("opens and closes settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByText("Reset progress")).toBeInTheDocument();
  });

  it("increases font size via settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Increase font size"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 15, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const });
  });

  it("decreases font size via settings menu", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 16, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Decrease font size"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 15, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const });
  });

  it("increases tab size via settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Increase tab size"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 3, lastTarget: "cc", theme: "dark" as const });
  });

  it("decreases tab size via settings menu", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 4, lastTarget: "cc", theme: "dark" as const }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Decrease tab size"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 3, lastTarget: "cc", theme: "dark" as const });
  });

  it("toggles word wrap via settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Toggle word wrap"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: false, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const });
  });

  it("toggles minimap via settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Toggle minimap"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: true, tabSize: 2, lastTarget: "cc", theme: "dark" as const });
  });

  it("changes font family via settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.change(screen.getByLabelText("Editor font family"), { target: { value: "Fira Code, monospace" } });
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({
      fontSize: 14,
      fontFamily: "Fira Code, monospace",
      wordWrap: true,
      minimap: false,
      tabSize: 2,
      lastTarget: "cc",
      theme: "dark",
    });
  });

  it("toggles light theme via settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Toggle light theme"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "light" });
  });

  it("disables font decrease at minimum size", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByLabelText("Decrease font size")).toBeDisabled();
  });

  it("does not decrease font size below minimum", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Decrease font size"));
    expect(defaultProps.onSettingsChange).not.toHaveBeenCalled();
  });

  it("disables font increase at maximum size", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 24, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByLabelText("Increase font size")).toBeDisabled();
  });

  it("does not increase font size above maximum", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 24, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Increase font size"));
    expect(defaultProps.onSettingsChange).not.toHaveBeenCalled();
  });

  it("disables Compile and AST when running", () => {
    render(<Toolbar {...defaultProps} status="running" />);
    expect(screen.getByText("Compile").closest("button")).toBeDisabled();
    expect(screen.getByText("AST").closest("button")).toBeDisabled();
  });

  it("shows progress bars in settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByText("Tutorials")).toBeInTheDocument();
    expect(screen.getByText("Challenges")).toBeInTheDocument();
  });

  it("confirms before resetting progress", () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByText("Reset progress"));
    expect(confirmSpy).toHaveBeenCalledWith("Reset all tutorial and challenge progress?");
    confirmSpy.mockRestore();
  });

  it("closes File menu on Escape", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    expect(screen.getByText("Open file...")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("menu", { name: "File" }), { key: "Escape" });
    expect(screen.queryByText("Open file...")).not.toBeInTheDocument();
  });

  it("closes Settings menu on Escape", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByText("Reset progress")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("menu", { name: "Settings" }), { key: "Escape" });
    expect(screen.queryByText("Reset progress")).not.toBeInTheDocument();
  });

  it("moves focus within File menu with ArrowDown", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    const fileMenu = screen.getByRole("menu", { name: "File" });
    const openItem = screen.getByText("Open file...");
    const downloadItem = screen.getByText("Download .co");
    expect(openItem).toHaveFocus();
    fireEvent.keyDown(fileMenu, { key: "ArrowDown" });
    expect(downloadItem).toHaveFocus();
  });

  it("moves focus within File menu with ArrowUp", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    const fileMenu = screen.getByRole("menu", { name: "File" });
    const openItem = screen.getByText("Open file...");
    const downloadItem = screen.getByText("Download .co");
    expect(openItem).toHaveFocus();
    fireEvent.keyDown(fileMenu, { key: "ArrowDown" });
    expect(downloadItem).toHaveFocus();
    fireEvent.keyDown(fileMenu, { key: "ArrowUp" });
    expect(openItem).toHaveFocus();
  });

  it("moves focus to first item in File menu with Home", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    const fileMenu = screen.getByRole("menu", { name: "File" });
    const openItem = screen.getByText("Open file...");
    const formatItem = screen.getByText("Format code");
    fireEvent.keyDown(fileMenu, { key: "End" });
    expect(formatItem).toHaveFocus();
    fireEvent.keyDown(fileMenu, { key: "Home" });
    expect(openItem).toHaveFocus();
  });

  it("moves focus to last item in File menu with End", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    const fileMenu = screen.getByRole("menu", { name: "File" });
    const openItem = screen.getByText("Open file...");
    const formatItem = screen.getByText("Format code");
    expect(openItem).toHaveFocus();
    fireEvent.keyDown(fileMenu, { key: "End" });
    expect(formatItem).toHaveFocus();
  });

  it("resets share copied timeout on rapid Share clicks", () => {
    jest.useFakeTimers();
    render(<Toolbar {...defaultProps} />);
    const shareBtn = screen.getByLabelText("Share code");
    fireEvent.click(shareBtn);
    expect(defaultProps.onShare).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    fireEvent.click(shareBtn);
    expect(defaultProps.onShare).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Share")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("closes settings menu when clicking outside", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByText("Reset progress")).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.queryByText("Reset progress")).not.toBeInTheDocument();
  });

  it("loads code from an uploaded file", () => {
    render(<Toolbar {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const file = new File(["uploaded code content"], "test.co", { type: "text/plain" });
    const readAsText = jest.fn();
    const mockFileReader = {
      onload: null as (() => void) | null,
      result: "uploaded code content",
      readAsText,
    };
    readAsText.mockImplementation(function (this: typeof mockFileReader) {
      this.onload?.();
    }.bind(mockFileReader));
    jest.spyOn(window, "FileReader").mockImplementation(() => mockFileReader as unknown as FileReader);

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(defaultProps.onLoadCode).toHaveBeenCalledWith("uploaded code content");
    (window.FileReader as unknown as jest.SpyInstance).mockRestore();
  });

  it("does not load when no file selected", () => {
    render(<Toolbar {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(defaultProps.onLoadCode).not.toHaveBeenCalled();
  });

  it("does not load when FileReader result is not a string", () => {
    render(<Toolbar {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(["data"], "test.co", { type: "text/plain" });
    const readAsText = jest.fn();
    const mockFileReader = {
      onload: null as (() => void) | null,
      result: new ArrayBuffer(8),
      readAsText,
    };
    readAsText.mockImplementation(function (this: typeof mockFileReader) {
      this.onload?.();
    }.bind(mockFileReader));
    jest.spyOn(window, "FileReader").mockImplementation(() => mockFileReader as unknown as FileReader);

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(defaultProps.onLoadCode).not.toHaveBeenCalled();
    (window.FileReader as unknown as jest.SpyInstance).mockRestore();
  });

  it("rejects files with disallowed extensions", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<Toolbar {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(["code"], "kernel.cpp", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(alertSpy).toHaveBeenCalledWith("Please select a .co or .txt file.");
    expect(defaultProps.onLoadCode).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("rejects files larger than the size limit", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<Toolbar {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(["x"], "big.co", { type: "text/plain" });
    Object.defineProperty(file, "size", { value: 2 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(alertSpy).toHaveBeenCalledWith("File is too large (max 1 MB).");
    expect(defaultProps.onLoadCode).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("alerts when FileReader fails", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<Toolbar {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(["data"], "test.co", { type: "text/plain" });
    const readAsText = jest.fn();
    const mockFileReader = {
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      result: null,
      readAsText,
    };
    readAsText.mockImplementation(function (this: typeof mockFileReader) {
      this.onerror?.();
    }.bind(mockFileReader));
    jest.spyOn(window, "FileReader").mockImplementation(() => mockFileReader as unknown as FileReader);

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(alertSpy).toHaveBeenCalledWith("Could not read the selected file.");
    expect(defaultProps.onLoadCode).not.toHaveBeenCalled();
    alertSpy.mockRestore();
    (window.FileReader as unknown as jest.SpyInstance).mockRestore();
  });

  it("navigates settings menu with ArrowDown/ArrowUp keys", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    const menu = screen.getByRole("menu");
    const items = screen.getAllByRole("menuitem");
    expect(items.length).toBeGreaterThan(0);

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    fireEvent.keyDown(menu, { key: "Home" });
    fireEvent.keyDown(menu, { key: "End" });
  });

  it("closes settings menu on Escape key", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes file menu on outside click", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    act(() => { fireEvent.click(document.body); });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes settings menu on outside click", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    act(() => { fireEvent.click(document.body); });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("resets progress when reset confirmed", () => {
    const resetProgressSpy = jest.spyOn(progress, "resetProgress");
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByText("Reset progress"));

    expect(confirmSpy).toHaveBeenCalledWith("Reset all tutorial and challenge progress?");
    expect(resetProgressSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Reset progress")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
    confirmSpy.mockRestore();
    resetProgressSpy.mockRestore();
  });

  it("ArrowDown focuses first item when no item has focus", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    const fileMenu = screen.getByRole("menu", { name: "File" });
    const openItem = screen.getByText("Open file...");
    // Blur the currently focused item so focusedIndex becomes -1
    (document.activeElement as HTMLElement)?.blur();
    fireEvent.keyDown(fileMenu, { key: "ArrowDown" });
    expect(openItem).toHaveFocus();
  });

  it("ArrowUp focuses last item when no item has focus", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    const fileMenu = screen.getByRole("menu", { name: "File" });
    const formatItem = screen.getByText("Format code");
    (document.activeElement as HTMLElement)?.blur();
    fireEvent.keyDown(fileMenu, { key: "ArrowUp" });
    expect(formatItem).toHaveFocus();
  });

  it("does not reset progress when confirm is cancelled", () => {
    const resetProgressSpy = jest.spyOn(progress, "resetProgress");
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);

    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByText("Reset progress"));

    expect(confirmSpy).toHaveBeenCalled();
    expect(resetProgressSpy).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
    resetProgressSpy.mockRestore();
  });

  it("ignores file input change when files is undefined", () => {
    render(<Toolbar {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: undefined } });
    expect(defaultProps.onLoadCode).not.toHaveBeenCalled();
  });

  it("keeps settings menu open when clicking inside the menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByText("Reset progress")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Font size"));
    expect(screen.getByText("Reset progress")).toBeInTheDocument();
  });

  it("keeps file menu open when clicking inside the menu container", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    expect(screen.getByText("Open file...")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("menu", { name: "File" }));
    expect(screen.getByText("Open file...")).toBeInTheDocument();
  });

  it("no-ops keyboard navigation when menu has no focusable items", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    const fileMenu = screen.getByRole("menu", { name: "File" });
    fileMenu.innerHTML = "";
    expect(() => {
      fireEvent.keyDown(fileMenu, { key: "ArrowDown" });
      fireEvent.keyDown(fileMenu, { key: "ArrowUp" });
      fireEvent.keyDown(fileMenu, { key: "Home" });
      fireEvent.keyDown(fileMenu, { key: "End" });
    }).not.toThrow();
  });

  it("does not call onSettingsChange when decrease clicked at minimum font size", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    const decBtn = screen.getByLabelText("Decrease font size") as HTMLElement & Record<string, unknown>;
    const propsKey = Object.keys(decBtn).find((k) => k.startsWith("__reactProps"));
    expect(propsKey).toBeDefined();
    (decBtn[propsKey!] as { onClick: (e: React.MouseEvent) => void }).onClick({
      preventDefault: () => {},
    } as React.MouseEvent);
    expect(defaultProps.onSettingsChange).not.toHaveBeenCalled();
  });

  it("does not call onSettingsChange when increase clicked at maximum font size", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 24, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    const incBtn = screen.getByLabelText("Increase font size") as HTMLElement & Record<string, unknown>;
    const propsKey = Object.keys(incBtn).find((k) => k.startsWith("__reactProps"));
    expect(propsKey).toBeDefined();
    (incBtn[propsKey!] as { onClick: (e: React.MouseEvent) => void }).onClick({
      preventDefault: () => {},
    } as React.MouseEvent);
    expect(defaultProps.onSettingsChange).not.toHaveBeenCalled();
  });

  it("ignores file input change when files is null", () => {
    render(<Toolbar {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, "files", { value: null, configurable: true });
    fireEvent.change(fileInput);
    expect(defaultProps.onLoadCode).not.toHaveBeenCalled();
  });

  it("handles document click when event target is null", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByText("Reset progress")).toBeInTheDocument();
    act(() => {
      const event = new MouseEvent("click", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "target", { value: null });
      document.dispatchEvent(event);
    });
    expect(screen.queryByText("Reset progress")).not.toBeInTheDocument();
  });

  it("handles document click with null target while file menu is open", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    expect(screen.getByText("Open file...")).toBeInTheDocument();
    act(() => {
      const event = new MouseEvent("click", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "target", { value: null });
      document.dispatchEvent(event);
    });
    expect(screen.queryByText("Open file...")).not.toBeInTheDocument();
  });

  it("handles focus when file menu has no focusable items on open", () => {
    const original = HTMLElement.prototype.querySelectorAll;
    const querySpy = jest
      .spyOn(HTMLElement.prototype, "querySelectorAll")
      .mockImplementation(function (this: HTMLElement, selector: string) {
        if (selector.includes("menuitem")) {
          return [] as unknown as NodeListOf<HTMLElement>;
        }
        return original.call(this, selector);
      });
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    expect(screen.getByRole("menu", { name: "File" })).toBeInTheDocument();
    querySpy.mockRestore();
  });

  it("handles focus when settings menu has no focusable items on open", () => {
    const original = HTMLElement.prototype.querySelectorAll;
    const querySpy = jest
      .spyOn(HTMLElement.prototype, "querySelectorAll")
      .mockImplementation(function (this: HTMLElement, selector: string) {
        if (selector.includes("menuitem")) {
          return [] as unknown as NodeListOf<HTMLElement>;
        }
        return original.call(this, selector);
      });
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByRole("menu", { name: "Settings" })).toBeInTheDocument();
    querySpy.mockRestore();
  });

  it("closes settings menu when clicking the file menu toggle", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByText("Reset progress")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("File menu"));
    expect(screen.queryByText("Reset progress")).not.toBeInTheDocument();
    expect(screen.getByText("Open file...")).toBeInTheDocument();
  });

  it("closes file menu when clicking the settings menu toggle", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    expect(screen.getByText("Open file...")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.queryByText("Open file...")).not.toBeInTheDocument();
    expect(screen.getByText("Reset progress")).toBeInTheDocument();
  });

  it("shows mobile Share label when copied on narrow viewport", () => {
    jest.useFakeTimers();
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Share code"));
    expect(screen.getByText("✓")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText("🔗")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("shows mobile Compile icon when not running", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("⚙")).toBeInTheDocument();
  });

  it("loads example from mobile Examples group in File menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    const examplesGroup = screen.getByRole("group", { name: "Examples" });
    fireEvent.click(examplesGroup.querySelector("button")!);
    expect(defaultProps.onLoadCode).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Open file...")).not.toBeInTheDocument();
  });

  it("renders command palette button when handler provided", () => {
    const onOpenCommandPalette = jest.fn();
    render(<Toolbar {...defaultProps} onOpenCommandPalette={onOpenCommandPalette} />);
    const btn = screen.getByLabelText("Open command palette");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onOpenCommandPalette).toHaveBeenCalledTimes(1);
  });

  it("does not call onSettingsChange when decrease clicked at minimum tab size", () => {
    render(
      <Toolbar
        {...defaultProps}
        settings={{ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark" as const }}
      />,
    );
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByLabelText("Decrease tab size")).toBeDisabled();
    const decBtn = screen.getByLabelText("Decrease tab size") as HTMLElement & Record<string, unknown>;
    const propsKey = Object.keys(decBtn).find((k) => k.startsWith("__reactProps"));
    expect(propsKey).toBeDefined();
    (decBtn[propsKey!] as { onClick: (e: React.MouseEvent) => void }).onClick({
      preventDefault: () => {},
    } as React.MouseEvent);
    expect(defaultProps.onSettingsChange).not.toHaveBeenCalled();
  });

  it("does not call onSettingsChange when increase clicked at maximum tab size", () => {
    render(
      <Toolbar
        {...defaultProps}
        settings={{ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 8, lastTarget: "cc", theme: "dark" as const }}
      />,
    );
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByLabelText("Increase tab size")).toBeDisabled();
    const incBtn = screen.getByLabelText("Increase tab size") as HTMLElement & Record<string, unknown>;
    const propsKey = Object.keys(incBtn).find((k) => k.startsWith("__reactProps"));
    expect(propsKey).toBeDefined();
    (incBtn[propsKey!] as { onClick: (e: React.MouseEvent) => void }).onClick({
      preventDefault: () => {},
    } as React.MouseEvent);
    expect(defaultProps.onSettingsChange).not.toHaveBeenCalled();
  });

  it("switches to dark theme when light theme is unchecked", () => {
    render(
      <Toolbar
        {...defaultProps}
        settings={{ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "light" }}
      />,
    );
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Toggle light theme"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({
      fontSize: 14,
      fontFamily: "JetBrains Mono, monospace",
      wordWrap: true,
      minimap: false,
      tabSize: 2,
      lastTarget: "cc",
      theme: "dark",
    });
  });

  it("handles Open file when file input ref is cleared", () => {
    const shareTimeoutRef = { current: null as ReturnType<typeof setTimeout> | null };
    const fileInputRef = { current: null as HTMLInputElement | null };
    const fileMenuRef = { current: null as HTMLDivElement | null };
    const settingsMenuRef = { current: null as HTMLDivElement | null };
    const refs = [shareTimeoutRef, fileInputRef, fileMenuRef, settingsMenuRef];
    let useRefCall = 0;
    const useRefSpy = jest.spyOn(React, "useRef").mockImplementation((initial) => {
      const ref = refs[useRefCall % 4];
      useRefCall += 1;
      if (ref === shareTimeoutRef && initial !== undefined) {
        ref.current = initial as ReturnType<typeof setTimeout> | null;
      }
      return ref;
    });

    try {
      render(<Toolbar {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("File menu"));
      fileInputRef.current = null;
      expect(() => fireEvent.click(screen.getByText("Open file..."))).not.toThrow();
    } finally {
      useRefSpy.mockRestore();
    }
  });

  it("no-ops menu keyboard navigation when menu ref is cleared", () => {
    const shareTimeoutRef = { current: null as ReturnType<typeof setTimeout> | null };
    const fileInputRef = { current: null as HTMLInputElement | null };
    const fileMenuRef = { current: null as HTMLDivElement | null };
    const settingsMenuRef = { current: null as HTMLDivElement | null };
    const refs = [shareTimeoutRef, fileInputRef, fileMenuRef, settingsMenuRef];
    let useRefCall = 0;
    const useRefSpy = jest.spyOn(React, "useRef").mockImplementation((initial) => {
      const ref = refs[useRefCall % 4];
      useRefCall += 1;
      if (ref === shareTimeoutRef && initial !== undefined) {
        ref.current = initial as ReturnType<typeof setTimeout> | null;
      }
      return ref;
    });

    try {
      render(<Toolbar {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("File menu"));
      const fileMenu = screen.getByRole("menu", { name: "File" });
      fileMenuRef.current = null;
      expect(() => {
        fireEvent.keyDown(fileMenu, { key: "ArrowDown" });
        fireEvent.keyDown(fileMenu, { key: "Escape" });
      }).not.toThrow();
      expect(screen.getByText("Open file...")).toBeInTheDocument();
    } finally {
      useRefSpy.mockRestore();
    }
  });
});
