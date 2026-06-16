import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderTutorialContent } from "@/lib/renderTutorialContent";

function renderContent(content: string, onTryIt: jest.Mock = jest.fn()) {
  render(<div>{renderTutorialContent(content, onTryIt)}</div>);
  return onTryIt;
}

describe("renderTutorialContent", () => {
  it("renders plain text without a Try it button", () => {
    renderContent("Hello **world** with `inline` code.");
    expect(screen.getByText(/Hello \*\*world\*\* with `inline` code\./)).toBeInTheDocument();
    expect(screen.queryByLabelText("Try this code example")).not.toBeInTheDocument();
  });

  it("renders empty content without Try it buttons", () => {
    renderContent("");
    expect(screen.queryByLabelText("Try this code example")).not.toBeInTheDocument();
  });

  it("renders a Try it button for a single code block", () => {
    renderContent('Try this:\n\n```croqtile\nprintln("hi");\n```');
    expect(screen.getByLabelText("Try this code example")).toBeInTheDocument();
    expect(screen.getByText('println("hi");')).toBeInTheDocument();
  });

  it("renders multiple Try it buttons for multiple code blocks", () => {
    renderContent("```js\nalpha();\n```\n\nMiddle text\n\n```py\nbeta()\n```");
    expect(screen.getAllByLabelText("Try this code example")).toHaveLength(2);
    expect(screen.getByText("alpha();")).toBeInTheDocument();
    expect(screen.getByText("beta()")).toBeInTheDocument();
    expect(screen.getByText("Middle text")).toBeInTheDocument();
  });

  it("renders Try it for code-only content", () => {
    renderContent("```croqtile\nfoo();\n```");
    expect(screen.getAllByLabelText("Try this code example")).toHaveLength(1);
    expect(screen.queryByText("Try this:")).not.toBeInTheDocument();
  });

  it("loads exact snippet content when Try it is clicked", () => {
    const onTryIt = renderContent('```croqtile\nprintln("café", 42);\n```');
    fireEvent.click(screen.getByLabelText("Try this code example"));
    expect(onTryIt).toHaveBeenCalledTimes(1);
    expect(onTryIt).toHaveBeenCalledWith('println("café", 42);\n');
  });

  it("loads snippets with special characters unchanged", () => {
    const snippet = 'const x = "<>&\\"`;\n';
    const onTryIt = renderContent(`\`\`\`js\n${snippet}\`\`\``);
    fireEvent.click(screen.getByLabelText("Try this code example"));
    expect(onTryIt).toHaveBeenCalledWith(snippet);
  });

  it("loads empty code block content when Try it is clicked", () => {
    const onTryIt = renderContent("```croqtile\n```");
    fireEvent.click(screen.getByLabelText("Try this code example"));
    expect(onTryIt).toHaveBeenCalledWith("");
  });

  it("does not render Try it for malformed unclosed fences", () => {
    renderContent("Broken fence:\n```js\ncode without close");
    expect(screen.queryByLabelText("Try this code example")).not.toBeInTheDocument();
    expect(screen.getByText(/Broken fence:/)).toBeInTheDocument();
    expect(screen.getByText(/```js/)).toBeInTheDocument();
  });

  it("preserves nested markdown markers in rendered text spans", () => {
    renderContent(
      "When `parallel` runs, use **thread index**.\n\n```croqtile\nparallel {i} {}\n```",
    );
    expect(screen.getByText(/When `parallel` runs, use \*\*thread index\*\*\./)).toBeInTheDocument();
    expect(screen.getByText("parallel {i} {}")).toBeInTheDocument();
  });
});
