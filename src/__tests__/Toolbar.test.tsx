import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Toolbar } from "@/components/Toolbar";

const defaultProps = {
  target: "cc",
  onTargetChange: jest.fn(),
  onRun: jest.fn(),
  onCompile: jest.fn(),
  onDumpAST: jest.fn(),
  onLoadCode: jest.fn(),
  getCode: jest.fn(() => "test code"),
  onShare: jest.fn(),
  onTogglePanel: jest.fn(),
  panelMode: "closed" as const,
  status: "ready" as const,
  settings: { fontSize: 14, wordWrap: true },
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

  it("formats code when Format code clicked in File menu", () => {
    const getCode = jest.fn(() => "__co__ void hello() {\nprintln(\"hi\");\n}");
    render(<Toolbar {...defaultProps} getCode={getCode} />);
    fireEvent.click(screen.getByLabelText("File menu"));
    fireEvent.click(screen.getByText("Format code"));
    expect(getCode).toHaveBeenCalledTimes(1);
    expect(defaultProps.onLoadCode).toHaveBeenCalledWith(`__co__ void hello() {
  println("hi");
}`);
  });

  it("downloads code as .co file via File menu", () => {
    render(<Toolbar {...defaultProps} />);

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
      expect(defaultProps.getCode).toHaveBeenCalledTimes(1);
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(anchor.download).toBe("croqtile-code.co");
      expect(click).toHaveBeenCalledTimes(1);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:test");
    } finally {
      createElementSpy.mockRestore();
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
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 15, wordWrap: true });
  });

  it("decreases font size via settings menu", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 16, wordWrap: true }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Decrease font size"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 15, wordWrap: true });
  });

  it("toggles word wrap via settings menu", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    fireEvent.click(screen.getByLabelText("Toggle word wrap"));
    expect(defaultProps.onSettingsChange).toHaveBeenCalledWith({ fontSize: 14, wordWrap: false });
  });

  it("disables font decrease at minimum size", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 10, wordWrap: true }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByLabelText("Decrease font size")).toBeDisabled();
  });

  it("disables font increase at maximum size", () => {
    render(<Toolbar {...defaultProps} settings={{ fontSize: 24, wordWrap: true }} />);
    fireEvent.click(screen.getByLabelText("Settings menu"));
    expect(screen.getByLabelText("Increase font size")).toBeDisabled();
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
});
