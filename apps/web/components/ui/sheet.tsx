"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"

type SheetContextType = { open: boolean; onOpenChange: (v: boolean) => void }
const SheetContext = React.createContext<SheetContextType>({ open: false, onOpenChange: () => {} })

function Sheet({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = (v: boolean) => { if (!isControlled) setInternalOpen(v); onOpenChange?.(v) }
  return <SheetContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</SheetContext.Provider>
}

function SheetTrigger({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(SheetContext)
  const handleClick = () => onOpenChange(true)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, { onClick: handleClick })
  }
  return <button type="button" data-slot="sheet-trigger" onClick={handleClick} {...props}>{children}</button>
}

function SheetClose({ children, ...props }: React.ComponentProps<"button">) {
  const { onOpenChange } = React.useContext(SheetContext)
  return <button type="button" data-slot="sheet-close" onClick={() => onOpenChange(false)} {...props}>{children}</button>
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SheetOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { onOpenChange } = React.useContext(SheetContext)
  return (
    <div
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
}

const SIDE_CLASSES = {
  right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  top: "inset-x-0 top-0 h-auto border-b",
  bottom: "inset-x-0 bottom-0 h-auto border-t",
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  const { open } = React.useContext(SheetContext)
  if (!open) return null
  return (
    <SheetPortal>
      <SheetOverlay />
      <div
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover text-sm text-popover-foreground shadow-lg",
          SIDE_CLASSES[side],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md hover:bg-muted">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </div>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-0.5 p-4", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="sheet-title" className={cn("font-heading text-base font-medium text-foreground", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
