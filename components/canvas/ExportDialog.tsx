import { useEffect, useState } from "react";
import { Copy, X, Check } from "lucide-react";

export function ExportDialog({ open, code, onClose }: { open: boolean; code: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!open) setCopied(false); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="flex h-[80vh] w-[800px] max-w-[92vw] flex-col rounded-lg border border-border bg-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Export to React + Tailwind</div>
            <div className="text-xs text-muted-foreground">Paste into a .tsx file in any Tailwind project.</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy code"}
            </button>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded hover:bg-accent"><X size={16} /></button>
          </div>
        </div>
        <pre className="m-0 flex-1 overflow-auto bg-background p-4 text-[12px] leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
