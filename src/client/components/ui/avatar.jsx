import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "../../lib/utils.js";

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-11 shrink-0 overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-300/10",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }) {
  return <AvatarPrimitive.Image className={cn("aspect-square size-full", className)} {...props} />;
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn("flex size-full items-center justify-center font-display text-sm font-black text-cyan-100", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
