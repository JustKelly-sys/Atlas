"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TabsContextType = { value: string; onValueChange: (v: string) => void }
const TabsContext = React.createContext<TabsContextType>({ value: "", onValueChange: () => {} })

function Tabs({
  className,
  orientation = "horizontal",
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue
  const setValue = (v: string) => { if (!isControlled) setInternalValue(v); onValueChange?.(v) }
  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div
        data-slot="tabs"
        data-orientation={orientation}
        className={cn("flex gap-2", orientation === "horizontal" ? "flex-col" : "flex-row", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn("inline-flex h-8 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function TabsTrigger({ className, value, children, ...props }: React.ComponentProps<"button"> & { value: string }) {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext)
  const isActive = activeValue === value
  return (
    <button
      type="button"
      role="tab"
      data-slot="tabs-trigger"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "inline-flex h-[calc(100%-2px)] items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:text-foreground",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ className, value, children, ...props }: React.ComponentProps<"div"> & { value: string }) {
  const { value: activeValue } = React.useContext(TabsContext)
  if (activeValue !== value) return null
  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      data-state="active"
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
