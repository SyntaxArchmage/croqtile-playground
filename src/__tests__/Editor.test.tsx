import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";

let capturedOnMount: ((editor: any, monaco: any) => void) | undefined;
let capturedOnChange: ((value: string | undefined) => void) | undefined;
let capturedOptions: Record<string, unknown> | undefined;
let capturedDynamicLoading: (() => React.ReactElement) | undefined;
let capturedDynamicLoader: (() => Promise<unknown>) | undefined;

jest.mock("next/dynamic", () => {
  return (loader: () => Promise<unknown>, opts?: { loading?: () => React.ReactElement }) => {
    capturedDynamicLoader = loader;
    capturedDynamicLoading = opts?.loading;
    return function DynamicMock(props: any) {
      capturedOnMount = props.onMount;
      capturedOnChange = props.onChange;
      capturedOptions = props.options;
      return <div data-testid="monaco-mock">{props.value}</div>;
    };
  };
});

import { Editor, CursorPosition } from "@/components/Editor";

describe("Editor", () => {
  beforeEach(() => {
    capturedOnMount = undefined;
    capturedOnChange = undefined;
    capturedOptions = undefined;
  });

  it("renders with value", () => {
    render(<Editor value="hello" onChange={jest.fn()} />);
    expect(screen.getByTestId("monaco-mock").textContent).toBe("hello");
  });

  it("passes fontSize and wordWrap to options", () => {
    render(<Editor value="" onChange={jest.fn()} fontSize={18} wordWrap={false} />);
    expect(capturedOptions?.fontSize).toBe(18);
    expect(capturedOptions?.wordWrap).toBe("off");
  });

  it("defaults wordWrap to on", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    expect(capturedOptions?.wordWrap).toBe("on");
  });

  it("passes tabSize to options", () => {
    render(<Editor value="" onChange={jest.fn()} tabSize={4} />);
    expect(capturedOptions?.tabSize).toBe(4);
  });

  it("passes editor indentation and auto-close options", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    expect(capturedOptions?.autoIndent).toBe("full");
    expect(capturedOptions?.autoClosingBrackets).toBe("languageDefined");
    expect(capturedOptions?.autoClosingQuotes).toBe("languageDefined");
    expect(capturedOptions?.autoSurround).toBe("languageDefined");
    expect(capturedOptions?.tabSize).toBe(2);
  });

  it("calls onChange with empty string when Monaco sends undefined", () => {
    const onChange = jest.fn();
    render(<Editor value="" onChange={onChange} />);
    act(() => capturedOnChange?.(undefined));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("calls onChange with value from Monaco", () => {
    const onChange = jest.fn();
    render(<Editor value="" onChange={onChange} />);
    act(() => capturedOnChange?.("new code"));
    expect(onChange).toHaveBeenCalledWith("new code");
  });

  it("exposes getValue via ref", () => {
    const ref = React.createRef<{ getValue: () => string }>();
    render(<Editor ref={ref} value="fallback" onChange={jest.fn()} />);
    expect(ref.current?.getValue()).toBe("fallback");
  });

  it("getValue returns editor value when Monaco editor is mounted", () => {
    const ref = React.createRef<{ getValue: () => string }>();
    render(<Editor ref={ref} value="fallback" onChange={jest.fn()} />);

    const mockEditor = {
      getValue: () => "editor-content",
      getPosition: () => null,
      onDidChangeCursorPosition: jest.fn(),
    };
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(ref.current?.getValue()).toBe("editor-content");
  });

  it("registers Choreo language on mount", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(mockMonaco.languages.register).toHaveBeenCalledWith({ id: "choreo" });
    expect(mockMonaco.languages.setMonarchTokensProvider).toHaveBeenCalledWith(
      "choreo",
      expect.any(Object),
    );
    expect(mockMonaco.languages.setLanguageConfiguration).toHaveBeenCalledWith(
      "choreo",
      expect.any(Object),
    );
  });

  it("setLanguageConfiguration uses proper comments, auto-closing pairs, and indentation rules", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));

    const config = mockMonaco.languages.setLanguageConfiguration.mock.calls[0][1];
    expect(config.comments).toEqual({
      lineComment: "//",
      blockComment: ["/*", "*/"],
    });
    expect(config.autoClosingPairs).toEqual(
      expect.arrayContaining([
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"', notIn: ["string", "comment"] },
        { open: "'", close: "'", notIn: ["string", "comment"] },
      ]),
    );
    expect(config.autoClosingPairs).toHaveLength(5);
    expect(config.indentationRules.increaseIndentPattern).toEqual(
      /^((?!\/\/).)*(\{[^}"']*|\([^)"']*|\[[^\]"']*)$/,
    );
    expect(config.indentationRules.decreaseIndentPattern).toEqual(
      /^((?!.*?\/\*).*\*)?\s*(\}|])[^}\]"']*[\)"']*;?\s*$/,
    );
    expect(config.onEnterRules).toHaveLength(3);
  });

  it("skips re-registering Choreo if already registered", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco(true);
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(mockMonaco.languages.register).not.toHaveBeenCalled();
  });

  it("sets choreo-dark theme on mount", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(mockMonaco.editor.setTheme).toHaveBeenCalledWith("choreo-dark");
    expect(mockMonaco.editor.defineTheme).toHaveBeenCalledWith(
      "choreo-dark",
      expect.objectContaining({ base: "vs-dark" }),
    );
    expect(mockMonaco.editor.defineTheme).toHaveBeenCalledWith(
      "choreo-light",
      expect.objectContaining({ base: "vs" }),
    );
  });

  it("sets choreo-light theme when theme prop is light", () => {
    render(<Editor value="" onChange={jest.fn()} theme="light" />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(mockMonaco.editor.setTheme).toHaveBeenCalledWith("choreo-light");
  });

  it("reports initial cursor position on mount", () => {
    const onCursorChange = jest.fn();
    render(<Editor value="" onChange={jest.fn()} onCursorChange={onCursorChange} />);
    const mockEditor = createMockEditor({ lineNumber: 5, column: 12 });
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(onCursorChange).toHaveBeenCalledWith({ line: 5, column: 12 });
  });

  it("subscribes to cursor changes on mount", () => {
    const onCursorChange = jest.fn();
    render(<Editor value="" onChange={jest.fn()} onCursorChange={onCursorChange} />);
    const cursorListener = jest.fn();
    const mockEditor = {
      getPosition: () => ({ lineNumber: 1, column: 1 }),
      onDidChangeCursorPosition: (cb: (e: any) => void) => { cursorListener.mockImplementation(cb); },
      getValue: () => "",
      getSelection: () => ({ isEmpty: () => true }),
      onDidChangeCursorSelection: jest.fn(),
      getModel: () => null,
    };
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    onCursorChange.mockClear();
    cursorListener({ position: { lineNumber: 3, column: 7 } });
    expect(onCursorChange).toHaveBeenCalledWith({ line: 3, column: 7 });
  });

  it("does not subscribe to cursor changes when onCursorChange is not provided", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(mockEditor.onDidChangeCursorPosition).not.toHaveBeenCalled();
  });

  it("reports initial selection on mount", () => {
    const onSelectionChange = jest.fn();
    render(<Editor value="" onChange={jest.fn()} onSelectionChange={onSelectionChange} />);
    const mockEditor = createMockEditor();
    mockEditor.getSelection = jest.fn(() => ({
      isEmpty: () => false,
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 5,
    }));
    mockEditor.getModel = jest.fn(() => ({
      getValueInRange: () => "hello",
    }));
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(onSelectionChange).toHaveBeenCalledWith({ characters: 5, lines: 1 });
  });

  it("reports null when selection is empty", () => {
    const onSelectionChange = jest.fn();
    render(<Editor value="" onChange={jest.fn()} onSelectionChange={onSelectionChange} />);
    const mockEditor = createMockEditor();
    mockEditor.getSelection = jest.fn(() => ({ isEmpty: () => true }));
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(onSelectionChange).toHaveBeenCalledWith(null);
  });

  it("subscribes to selection changes on mount", () => {
    const onSelectionChange = jest.fn();
    render(<Editor value="" onChange={jest.fn()} onSelectionChange={onSelectionChange} />);
    let selectionListener: (() => void) | undefined;
    const mockEditor = createMockEditor();
    mockEditor.onDidChangeCursorSelection = jest.fn((cb: () => void) => {
      selectionListener = cb;
    });
    mockEditor.getSelection = jest.fn(() => ({
      isEmpty: () => false,
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 2,
      endColumn: 1,
    }));
    mockEditor.getModel = jest.fn(() => ({
      getValueInRange: () => "a\nb",
    }));
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    onSelectionChange.mockClear();
    act(() => selectionListener?.());
    expect(onSelectionChange).toHaveBeenCalledWith({ characters: 3, lines: 2 });
  });

  it("does not subscribe to selection changes when onSelectionChange is not provided", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(mockEditor.onDidChangeCursorSelection).not.toHaveBeenCalled();
  });

  it("handles null cursor position on mount", () => {
    const onCursorChange = jest.fn();
    render(<Editor value="" onChange={jest.fn()} onCursorChange={onCursorChange} />);
    const mockEditor = createMockEditor(null);
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(onCursorChange).not.toHaveBeenCalled();
  });

  it("registers completion provider for Choreo", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(mockMonaco.languages.registerCompletionItemProvider).toHaveBeenCalledWith(
      "choreo",
      expect.objectContaining({ provideCompletionItems: expect.any(Function) }),
    );
  });

  it("completion provider returns Choreo keywords and snippets", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    const provider = mockMonaco.languages.registerCompletionItemProvider.mock.calls[0][1];
    const result = provider.provideCompletionItems({}, {});
    expect(result.suggestions.length).toBeGreaterThan(0);
    const labels = result.suggestions.map((s: any) => s.label);
    expect(labels).toContain("__co__");
    expect(labels).toContain("parallel");
    expect(labels).toContain("co-function");
    expect(labels).toContain("f32");
  });

  it("hover provider returns docs for known keywords", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    const provider = mockMonaco.languages.registerHoverProvider.mock.calls[0][1];

    const model = { getWordAtPosition: () => ({ word: "parallel" }) };
    const result = provider.provideHover(model, {});
    expect(result?.contents[0].value).toContain("Execute a block");
  });

  it("hover provider returns null for unknown words", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    const provider = mockMonaco.languages.registerHoverProvider.mock.calls[0][1];

    const model = { getWordAtPosition: () => ({ word: "unknown_thing" }) };
    expect(provider.provideHover(model, {})).toBeNull();
  });

  it("hover provider handles null word", () => {
    render(<Editor value="" onChange={jest.fn()} />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    const provider = mockMonaco.languages.registerHoverProvider.mock.calls[0][1];

    const model = { getWordAtPosition: () => null };
    expect(provider.provideHover(model, {})).toBeNull();
  });

  it("renders next/dynamic loading fallback", () => {
    expect(capturedDynamicLoading).toBeDefined();
    render(capturedDynamicLoading!());
    expect(screen.getByText("Loading editor...")).toBeInTheDocument();
  });

  it("dynamic loader resolves Monaco editor module", async () => {
    expect(capturedDynamicLoader).toBeDefined();
    await expect(capturedDynamicLoader!()).resolves.toBeDefined();
  });

  it("updates Monaco theme when theme prop changes after mount", () => {
    const { rerender } = render(<Editor value="" onChange={jest.fn()} theme="dark" />);
    const mockMonaco = createMockMonaco();
    const mockEditor = createMockEditor();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    mockMonaco.editor.setTheme.mockClear();

    rerender(<Editor value="" onChange={jest.fn()} theme="light" />);
    expect(mockMonaco.editor.setTheme).toHaveBeenCalledWith("choreo-light");
  });

  it("reports null selection when model is unavailable", () => {
    const onSelectionChange = jest.fn();
    render(<Editor value="" onChange={jest.fn()} onSelectionChange={onSelectionChange} />);
    const mockEditor = createMockEditor();
    mockEditor.getSelection = jest.fn(() => ({
      isEmpty: () => false,
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 5,
    }));
    mockEditor.getModel = jest.fn(() => null);
    const mockMonaco = createMockMonaco();

    act(() => capturedOnMount?.(mockEditor, mockMonaco));
    expect(onSelectionChange).toHaveBeenCalledWith(null);
  });
});

function createMockMonaco(alreadyRegistered = false) {
  return {
    languages: {
      getLanguages: jest.fn(() =>
        alreadyRegistered ? [{ id: "choreo" }] : [{ id: "javascript" }],
      ),
      register: jest.fn(),
      setMonarchTokensProvider: jest.fn(),
      setLanguageConfiguration: jest.fn(),
      registerCompletionItemProvider: jest.fn(),
      registerHoverProvider: jest.fn(),
      IndentAction: { None: 0, Indent: 1, IndentOutdent: 2, Outdent: 3 },
      CompletionItemKind: { Keyword: 14, TypeParameter: 15, Snippet: 27 },
      CompletionItemInsertTextRule: { InsertAsSnippet: 4 },
    },
    editor: {
      defineTheme: jest.fn(),
      setTheme: jest.fn(),
    },
  };
}

function createMockEditor(position?: { lineNumber: number; column: number } | null) {
  return {
    getPosition: jest.fn(() => position === undefined ? ({ lineNumber: 1, column: 1 }) : position),
    onDidChangeCursorPosition: jest.fn(),
    getValue: jest.fn(() => ""),
    getSelection: jest.fn(() => ({ isEmpty: () => true })),
    onDidChangeCursorSelection: jest.fn(),
    getModel: jest.fn(() => null),
  };
}
