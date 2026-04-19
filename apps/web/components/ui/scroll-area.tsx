"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function ScrollArea({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div
        data-slot="scroll-area-viewport"
        className="size-full overflow-auto rounded-[inherit]"
      >
        {children}
      </div>
    </div>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      data-slot="scroll-area-scrollbar"
      className={cn(
        "flex touch-none select-none p-px transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 w-full flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    />
  )
}

export { ScrollArea, ScrollBar }
