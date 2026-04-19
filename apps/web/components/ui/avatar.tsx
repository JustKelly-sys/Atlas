"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & { size?: "default" | "sm" | "lg" }) {
  return (
    <span
      data-slot="avatar"
      data-size={size}
      className={cn(
        "relative flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
        size === "sm" && "size-6",
        size === "lg" && "size-10",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

function AvatarImage({ className, src, alt = "", ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="avatar-image"
      src={src}
      alt={alt}
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center rounded-full bg-muted text-xs font-medium", className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
