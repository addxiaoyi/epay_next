"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { CreditCard, Menu, X } from "lucide-react";
import { LoadingLink } from "@/components/loading-link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/test-pay", label: "支付测试" },
  { href: "/admin/login", label: "后台" },
];

export function PublicShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-svh overflow-hidden">
      <header className="relative z-50 h-16 border-b bg-background">
        <div className="mx-auto flex h-full max-w-none items-center gap-3 px-4 md:gap-6 md:px-8">
          <LoadingLink href="/" className="group flex min-w-0 items-center gap-3 text-sm font-semibold" onClick={() => setOpen(false)}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CreditCard className="size-5" />
            </span>
            <span className="truncate">Next 易支付</span>
          </LoadingLink>

          <nav className="ml-auto hidden items-center gap-2 text-sm md:flex">
            {navLinks.map((item) => (
              <LoadingLink key={item.href} href={item.href} className="rounded-full px-3 py-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
                {item.label}
              </LoadingLink>
            ))}
          </nav>

          <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">切换菜单</span>
          </Button>
        </div>
        {open ? (
          <div className="absolute inset-x-0 top-16 border-b border-border bg-background p-4">
            <nav className="grid gap-2">
              {navLinks.map((item) => (
                <LoadingLink key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
                  {item.label}
                </LoadingLink>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <main className="h-[calc(100svh-4rem)] overflow-hidden">{children}</main>
    </div>
  );
}