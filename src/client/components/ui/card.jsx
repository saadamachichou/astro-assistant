import { cn } from "../../lib/utils.js";

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[1.45rem] border border-white/10 bg-slate-950/72 text-slate-50 shadow-astro backdrop-blur-2xl",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn("font-display text-lg font-bold tracking-normal", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm leading-6 text-slate-400", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
