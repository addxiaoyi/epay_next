"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Settings,
} from "lucide-react";
import { LoadingLink } from "@/components/loading-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "工作台",
    items: [
      { href: "/admin", label: "控制台", icon: LayoutDashboard },
      { href: "/admin/orders", label: "订单管理", icon: ReceiptText },
    ],
  },
  {
    label: "业务配置",
    items: [
      { href: "/admin/channels", label: "支付通道", icon: CreditCard },
      { href: "/admin/settings", label: "系统设置", icon: Settings },
    ],
  },
];

export function AdminShell({
  children,
  title,
  description,
  actions,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-svh overflow-hidden text-foreground paper-grain">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-background" />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border/60 bg-background/80 backdrop-blur-sm shadow-[18px_0_55px_-38px_color-mix(in_oklch,var(--foreground)_45%,transparent)] transition-[width] duration-300 lg:flex lg:flex-col",
          collapsed ? "w-[76px]" : "w-[244px]"
        )}
      >
        <SidebarContent collapsed={collapsed} onCollapse={() => setCollapsed((value) => !value)} />
      </aside>

      <div className={cn("min-w-0 transition-[padding] duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-[244px]")}>
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-sm">
          <div className="flex h-16 min-w-0 items-center gap-3 px-4 md:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="size-5" />
              <span className="sr-only">打开菜单</span>
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="hidden sm:inline">Next 易支付</span>
                <span className="hidden sm:inline">/</span>
                <span className="truncate text-foreground">{title}</span>
              </div>
              {description ? <p className="mt-1 truncate text-sm text-muted-foreground">{description}</p> : null}
            </div>
            {actions ? <div className="hidden items-center gap-2 md:flex">{actions}</div> : null}
            <LoadingLink
              href="/"
              className={buttonVariants({
                size: "sm",
                variant: "outline",
                className: "rounded-full bg-background/70 backdrop-blur-sm",
              })}
            >
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">前台</span>
            </LoadingLink>
          </div>
        </header>

        <main className="min-h-[calc(100svh-4rem)] min-w-0 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="space-y-6">{children}</div>
          </div>
        </main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 z-50 w-[244px] border-r border-border/60 bg-background/80 backdrop-blur-sm shadow-xl">
            <SidebarContent collapsed={false} mobile onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function SidebarContent({
  collapsed,
  mobile = false,
  onCollapse,
  onNavigate,
}: {
  collapsed: boolean;
  mobile?: boolean;
  onCollapse?: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className={cn("flex h-16 items-center border-b border-border/60", collapsed ? "justify-center px-3" : "px-4")}>
        {collapsed && !mobile ? (
          <Button variant="ghost" size="icon" onClick={onCollapse} className="rounded-xl">
            <LayoutDashboard className="size-4" />
            <span className="sr-only">展开侧栏</span>
          </Button>
        ) : (
          <>
            <LoadingLink href="/admin" onClick={onNavigate} className="group flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <CreditCard className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">Next 易支付</span>
                <span className="block truncate text-[11px] text-muted-foreground">单商户收款控制台</span>
              </span>
            </LoadingLink>
            {!mobile ? (
              <Button variant="ghost" size="icon" className="ml-auto rounded-xl" onClick={onCollapse}>
                <LogOut className="size-4" />
                <span className="sr-only">收起侧栏</span>
              </Button>
            ) : null}
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed ? <div className="mx-2 mb-1 mt-2 text-[10px] font-semibold tracking-wider text-muted-foreground/75">{group.label}</div> : null}
            <div className="grid gap-1">
              {group.items.map((item) => (
                <AdminNavLink key={item.href} item={item} collapsed={collapsed} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/60 p-3">
        {!collapsed ? (
          <div className="mb-2 rounded-2xl bg-primary/10 p-3 text-xs text-primary">
            <div className="flex items-center gap-2 font-medium">系统在线</div>
            <div className="mt-1 text-primary/70">订单与通道状态实时读取</div>
          </div>
        ) : null}
        <form method="post" action="/api/admin/logout">
          <Button type="submit" variant="ghost" className={cn("w-full gap-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive", collapsed ? "justify-center px-0" : "justify-start")}>
            <LogOut className="size-4" />
            {!collapsed ? "退出登录" : <span className="sr-only">退出登录</span>}
          </Button>
        </form>
      </div>
    </>
  );
}

function AdminNavLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

  return (
    <LoadingLink
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      showSpinner={!collapsed}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors tappable",
        active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      {active ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" /> : null}
      <item.icon className="size-4 shrink-0" />
      {!collapsed ? <span className="truncate">{item.label}</span> : <span className="sr-only">{item.label}</span>}
    </LoadingLink>
  );
}