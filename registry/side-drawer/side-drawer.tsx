'use client';

/**
 * SideDrawer — Phase 4 Plan 4-07 (R5.7, R10.1, R10.3)
 *
 * Left-edge slide-in panel built on @radix-ui/react-dialog. Slide motion uses
 * Tailwind v4 `data-[state=*]:animate-*` utilities driven by the 4 keyframes
 * shipped in Wave 0 (drawer-slide-in / drawer-slide-out / overlay-fade-in /
 * overlay-fade-out). Per Pitfall 2, animate-* classes are STATIC at mount —
 * Radix toggles `data-state` to drive the animation.
 *
 * Design decisions honored:
 *   D-03 — single file, dot-namespace exports (.Header, .Body, .Footer, .Trigger, .Close)
 *   D-06 — no dark: utilities (--drawer-overlay + bg-card token-flip)
 *   D-09 — cascade installs dgc-theme, app-header, scroll-area via registryDependencies
 */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export interface SideDrawerProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function SideDrawerRoot({
  open,
  onOpenChange,
  title = 'Menu',
  children,
  className,
}: SideDrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-[var(--drawer-overlay)]',
            'data-[state=open]:animate-[overlay-fade-in_var(--dur-slow)_var(--ease-standard)]',
            'data-[state=closed]:animate-[overlay-fade-out_var(--dur-base)_var(--ease-standard)]',
          )}
        />
        <DialogPrimitive.Content
          aria-label={title}
          className={cn(
            'fixed inset-y-0 left-0 z-50',
            'w-[var(--drawer-width)] bg-card text-card-foreground shadow-[var(--shadow-3)]',
            'data-[state=open]:animate-[drawer-slide-in_var(--dur-slow)_var(--ease-standard)]',
            'data-[state=closed]:animate-[drawer-slide-out_var(--dur-base)_var(--ease-standard)]',
            'flex flex-col focus:outline-none',
            className,
          )}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Navigation menu / ម៉ឺនុយណែនាំ
          </DialogPrimitive.Description>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function SideDrawerHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-border">{children}</div>;
}

function SideDrawerBody({ children }: { children: React.ReactNode }) {
  return <div className="min-h-0 flex-1 overflow-hidden">{children}</div>;
}

function SideDrawerFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-border p-[var(--space-4)] text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export const SideDrawer = Object.assign(SideDrawerRoot, {
  Trigger: DialogPrimitive.Trigger,
  Close: DialogPrimitive.Close,
  Header: SideDrawerHeader,
  Body: SideDrawerBody,
  Footer: SideDrawerFooter,
});
