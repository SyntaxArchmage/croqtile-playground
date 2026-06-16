interface Props {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export function ListSearchInput({ value, onChange, ariaLabel = "Search" }: Props) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 pr-8 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm leading-none"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export function matchesTitleSearch(title: string, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return title.toLowerCase().includes(normalized);
}
