import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ListSearchInput, matchesTitleSearch } from "@/components/ListSearchInput";

describe("ListSearchInput", () => {
  it("renders with Search placeholder and aria-label", () => {
    render(<ListSearchInput value="" onChange={() => {}} ariaLabel="Search items" />);
    expect(screen.getByPlaceholderText("Search...")).toHaveAttribute("aria-label", "Search items");
  });

  it("calls onChange when typing", () => {
    const onChange = jest.fn();
    render(<ListSearchInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "foo" } });
    expect(onChange).toHaveBeenCalledWith("foo");
  });

  it("shows clear button when value is non-empty", () => {
    render(<ListSearchInput value="foo" onChange={() => {}} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("hides clear button when value is empty", () => {
    render(<ListSearchInput value="" onChange={() => {}} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("clears value when clear button is clicked", () => {
    const onChange = jest.fn();
    render(<ListSearchInput value="foo" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(onChange).toHaveBeenCalledWith("");
  });
});

describe("matchesTitleSearch", () => {
  it("matches case-insensitive substring", () => {
    expect(matchesTitleSearch("Hello Threads", "hello")).toBe(true);
    expect(matchesTitleSearch("DMA Reverse", "dma")).toBe(true);
  });

  it("returns true for empty query", () => {
    expect(matchesTitleSearch("Any Title", "   ")).toBe(true);
  });

  it("does not match unrelated titles", () => {
    expect(matchesTitleSearch("Hello Threads", "dma")).toBe(false);
  });
});
