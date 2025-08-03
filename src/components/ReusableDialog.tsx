"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export interface FormDialogProps {
  isOpen: boolean
  onClose: () => void
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
}

export function ReusableDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  maxWidth = "2xl",
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          `max-w-${maxWidth} max-h-[90vh] flex flex-col`,
          className
        )}
      >
        <div className="sticky top-0 z-10 bg-background">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {children}
        </div>

        {footer && (
          <div className="sticky bottom-0 z-10 bg-background border-t pt-4 -mx-6 px-6">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export interface FormDialogFooterProps {
  children: React.ReactNode
  className?: string
}

export function FormDialogFooter({
  children,
  className
}: FormDialogFooterProps) {
  return (
    <DialogFooter className={cn("pt-4", className)}>
      {children}
    </DialogFooter>
  )
}
