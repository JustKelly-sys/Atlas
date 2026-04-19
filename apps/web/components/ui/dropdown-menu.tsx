"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

type DropdownContextType = { open: boolean; onOpenChange: (v: boolean) => void }
const DropdownContext = React.createContext<DropdownContextType>({ open: false, onOpenChange: () => {} })

function DropdownMenu({ children, open: controlledOpen, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen! : internalOpen
  const setOpen = (v: boolean) => { if (!isControlled) setInternalOpen(v); onOpenChange?.(v) }
  return <DropdownContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</DropdownContext.Provider>
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuTrigger({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange, open } = React.useContext(DropdownContext)
  const handleClick = () => onOpenChange(!open)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, { onClick: handleClick })
  }
  return <button type="button" data-slot="dropdown-menu-trigger" onClick={handleClick} {...props}>{children}</button>
}

function DropdownMenuContent({ className, align = "start", side = "bottom", sideOffset = 4, children, ...props }: React.ComponentProps<"div"> & { align?: string; side?: string; sideOffset?: number; alignOffset?: number }) {
  const { open, onOpenChange } = React.useContext(DropdownContext)
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
      <div
        data-slot="dropdown-menu-content"
        className={cn("absolute z-50 min-w-32 overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10", className)}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

function DropdownMenuGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dropdown-menu-group" className={className} {...props} />
}

function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return <div data-slot="dropdown-menu-label" className={cn("px-1.5 py-1 text-xs font-medium text-muted-foreground", inset && "pl-7", className)} {...props} />
}

function DropdownMenuItem({ className, inset, variant = "default", ...props }: React.ComponentProps<"div"> & { inset?: boolean; variant?: "default" | "destructive" }) {
  return (
    <div
      data-slot="dropdown-menu-item"
      role="menuitem"
      tabIndex={0}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground",
        inset && "pl-7",
        variant === "destructive" && "text-destructive hover:bg-destructive/10",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-sub-trigger"
      className={cn("flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground", inset && "pl-7", className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </div>
  )
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<"div"> & { align?: string; alignOffset?: number; side?: string; sideOffset?: number }) {
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      className={cn("z-50 min-w-24 overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10", className)}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({ className, children, checked, inset, ...props }: React.ComponentProps<"div"> & { checked?: boolean; inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-checkbox-item"
      role="menuitemcheckbox"
      aria-checked={checked}
      className={cn("relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground", inset && "pl-7", className)}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
        {checked && <CheckIcon className="size-4" />}
      </span>
      {children}
    </div>
  )
}

function DropdownMenuRadioGroup({ children, ...props }: React.ComponentProps<"div"> & { value?: string; onValueChange?: (v: string) => void }) {
  return <div data-slot="dropdown-menu-radio-group" role="radiogroup" {...props}>{children}</div>
}

function DropdownMenuRadioItem({ className, children, inset, value, ...props }: React.ComponentProps<"div"> & { value: string; inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-radio-item"
      role="menuitemradio"
      className={cn("relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground", inset && "pl-7", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
