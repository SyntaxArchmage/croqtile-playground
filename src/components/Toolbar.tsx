"use client";

import type { WorkerStatus } from "@/lib/useChoreoWorker";
import { EXAMPLES } from "@/lib/examples";

interface Props {
  target: string;
  onTargetChange: (target: string) => void;
  onRun: () => void;
  onCompile: () => void;
  onDumpAST: () => void;
  onLoadCode: (code: string) => void;
  status: WorkerStatus;
}

export function Toolbar({
  target,
  onTargetChange,
  onRun,
  onCompile,
  onDumpAST,
  onLoadCode,
  status,
}: Props) {
  const busy = status === "running";

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <span className="text-sm font-semibold text-[var(--accent)]">Croqtile</span>
      <span className="text-xs text-[var(--text-muted)]">Playground</span>

      <div className="w-px h-5 bg-[var(--border)] mx-2" />

      <select
        value={target}
        onChange={(e) => onTargetChange(e.target.value)}
        className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
      >
        <option value="cc">cc (C++ CPU)</option>
        <option value="cute">cute (CUDA)</option>
      </select>

      <button
        onClick={onRun}
        disabled={busy}
        className="px-3 py-1 text-xs font-medium rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
        title="Execute with mock interpreter (instant)"
      >
        ▶ Run
      </button>

      <button
        onClick={onCompile}
        disabled={busy}
        className="px-3 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        title="View generated C++/CUDA source code"
      >
        Compile
      </button>

      <button
        onClick={onDumpAST}
        disabled={busy}
        className="px-3 py-1 text-xs font-medium rounded border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border)] text-[var(--text-primary)] disabled:opacity-50"
      >
        AST
      </button>

      <div className="flex-1" />

      <select
        onChange={(e) => {
          const ex = EXAMPLES.find((x) => x.id === e.target.value);
          if (ex) onLoadCode(ex.code);
        }}
        defaultValue=""
        className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
      >
        <option value="" disabled>
          Examples...
        </option>
        {EXAMPLES.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>
    </div>
  );
}
