import { cn } from "../../lib/utils.js";

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-[52px] max-h-28 w-full resize-none overflow-y-auto rounded-xl border border-white/10 bg-slate-950/58 px-4 py-3 text-sm leading-6 text-slate-100 shadow-inner outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
