import { parseContent } from "./parseContent";

export function renderTutorialContent(
  content: string,
  onTryIt: (code: string) => void,
): React.ReactNode[] {
  const parts = parseContent(content);
  return parts.map((part, i) => {
    if (part.type === "text") {
      return (
        <span key={i} className="whitespace-pre-wrap">
          {part.content}
        </span>
      );
    }
    return (
      <div key={i} className="my-2 rounded border border-[var(--border)] bg-[var(--bg-primary)] overflow-hidden">
        <pre className="p-3 text-xs font-mono overflow-x-auto text-[var(--text-secondary)]">
          {part.content}
        </pre>
        <button
          type="button"
          onClick={() => onTryIt(part.content)}
          className="w-full px-3 py-1.5 text-xs font-medium bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
          aria-label="Try this code example"
        >
          Try it →
        </button>
      </div>
    );
  });
}
