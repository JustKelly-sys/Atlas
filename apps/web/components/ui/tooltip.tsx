"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function TooltipProvider({ children }: { children: React.ReactNode; delay?: number }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: React.ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  return <span className="relative inline-flex">{children}</span>
}

function TooltipTrigger({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, props)
  }
  return <button type="button" {...props}>{children}</button>
}

function TooltipContent({ className, children, side, sideOffset, align, alignOffset, ...props }: React.ComponentProps<"div"> & { side?: string; sideOffset?: number; align?: string; alignOffset?: number }) {
  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 z-50 hidden rounded bg-foreground px-2.5 py-1 text-xs text-background peer-hover:block group-hover:block",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
