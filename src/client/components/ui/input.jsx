import { cn } from "../../lib/utils.js";

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-white/10 bg-slate-950/58 px-4 text-sm text-slate-100 shadow-inner outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
