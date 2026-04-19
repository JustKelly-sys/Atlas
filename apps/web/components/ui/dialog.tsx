"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

type DialogContextType = { open: boolean; onOpenChange: (v: boolean) => void }
const DialogContext = React.createContext<DialogContextType>({ open: false, onOpenChange: () => {} })

function Dialog({
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
  return <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</DialogContext.Provider>
}

function DialogTrigger({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(DialogContext)
  const handleClick = () => onOpenChange(true)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, { onClick: handleClick })
  }
  return <button type="button" data-slot="dialog-trigger" onClick={handleClick} {...props}>{children}</button>
}

function DialogClose({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean; render?: React.ReactElement }) {
  const { onOpenChange } = React.useContext(DialogContext)
  return <button type="button" data-slot="dialog-close" onClick={() => onOpenChange(false)} {...props}>{children}</button>
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { onOpenChange } = React.useContext(DialogContext)
  return (
    <div
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  const { open } = React.useContext(DialogContext)
  if (!open) return null
  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 sm:max-w-sm",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-md hover:bg-muted">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2", className)} {...props} />
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end", className)}
      {...props}
    >
      {children}
      {showCloseButton && <DialogClose><Button variant="outline">Close</Button></DialogClose>}
    </div>
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="dialog-title" className={cn("font-heading text-base leading-none font-medium", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
