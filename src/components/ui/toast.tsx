"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border shadow-xl will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-3.5 sm:p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-xs sm:text-sm font-bold tracking-tight", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-[11px] sm:text-xs leading-relaxed", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground cursor-pointer p-1 rounded-full",
        className
      )}
      {...props}
    >
      {children ?? (
        <XIcon className="size-3.5" aria-hidden="true" />
      )}
    </ToastPrimitive.Close>
  )
}

function ToastIcon({ type }: { type: string | undefined }) {
  if (type === "success") {
    return (
      <span
        data-slot="toast-icon"
        className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white shadow-xs"
      >
        <CircleCheckIcon className="size-4 stroke-[2.5]" aria-hidden="true" />
      </span>
    )
  }

  if (type === "error") {
    return (
      <span
        data-slot="toast-icon"
        className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white shadow-xs"
      >
        <OctagonXIcon className="size-4 stroke-[2.5]" aria-hidden="true" />
      </span>
    )
  }

  if (type === "warning") {
    return (
      <span
        data-slot="toast-icon"
        className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white shadow-xs"
      >
        <TriangleAlertIcon className="size-4 stroke-[2.5]" aria-hidden="true" />
      </span>
    )
  }

  if (type === "loading") {
    return (
      <span
        data-slot="toast-icon"
        className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800 text-white shadow-xs"
      >
        <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
      </span>
    )
  }

  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#6B7B4F] text-white shadow-xs"
    >
      <InfoIcon className="size-4 stroke-[2.5]" aria-hidden="true" />
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => {
    const isSuccess = toastItem.type === "success";
    const isError = toastItem.type === "error";
    const isWarning = toastItem.type === "warning";

    const typeStyles = isSuccess
      ? "bg-[#F0FDF4] border-[#86EFAC] text-[#14532D] shadow-emerald-900/10"
      : isError
        ? "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B] shadow-red-900/10"
        : isWarning
          ? "bg-[#FEFCE8] border-[#FDE047] text-[#713F12] shadow-amber-900/10"
          : "bg-white border-zinc-200/90 text-[#171717]";

    return (
      <Toast key={toastItem.id} toast={toastItem} className={typeStyles}>
        <ToastContent>
          <ToastIcon type={toastItem.type} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <ToastTitle className={cn(isSuccess && "text-emerald-950 font-bold", isError && "text-red-950 font-bold")} />
            <ToastDescription className={cn(isSuccess && "text-emerald-800", isError && "text-red-800")} />
          </div>
          <ToastAction />
          <ToastClose className={cn(isSuccess && "text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100", isError && "text-red-700 hover:text-red-950 hover:bg-red-100")} />
        </ToastContent>
      </Toast>
    );
  })
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
}
