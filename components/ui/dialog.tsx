"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Context ───────────────────────────────────────────────────────────────────

interface DialogCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = React.createContext<DialogCtx>({ open: false, setOpen: () => {} });

// ── Dialog root ───────────────────────────────────────────────────────────────

interface DialogProps {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [internal, setInternal] = React.useState(false);
  const isOpen = open !== undefined ? open : internal;
  const setOpen = (v: boolean) => {
    setInternal(v);
    onOpenChange?.(v);
  };
  return <Ctx.Provider value={{ open: isOpen, setOpen }}>{children}</Ctx.Provider>;
}

// ── Trigger ───────────────────────────────────────────────────────────────────

interface TriggerProps {
  children: React.ReactNode;
  render?: React.ReactElement;
  asChild?: boolean;
  className?: string;
}

function DialogTrigger({ children, render: renderEl, className }: TriggerProps) {
  const { setOpen } = React.useContext(Ctx);
  if (renderEl) {
    return React.cloneElement(renderEl, {
      onClick: () => setOpen(true),
      children,
    } as React.HTMLAttributes<HTMLElement>);
  }
  return (
    <button className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

// ── Portal ────────────────────────────────────────────────────────────────────

function DialogPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ── Overlay ───────────────────────────────────────────────────────────────────

function DialogOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(Ctx);
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in-0",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean;
}

function DialogContent({ className, children, showCloseButton = true, ...props }: ContentProps) {
  const { open, setOpen } = React.useContext(Ctx);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
          "max-h-[90vh] overflow-y-auto",
          "rounded-xl bg-background border border-border shadow-xl",
          "p-6 animate-in fade-in-0 zoom-in-95",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {showCloseButton && (
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </DialogPortal>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 mb-4", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold text-foreground leading-none", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-2 mt-4", className)} {...props} />;
}

function DialogClose({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = React.useContext(Ctx);
  return (
    <button onClick={() => setOpen(false)} className={className} {...props}>
      {children}
    </button>
  );
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
};
