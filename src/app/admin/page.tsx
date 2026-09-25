import { KeyRound } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { appUrl } from "@/lib/epay/config";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; reset?: string }> }) {
  await requireAdmin();
  const { reset } = await searchParams;

  const [orders, paidOrders, pendingOrders, merchant] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ where: { status: "PAID" }, select: { money: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.merchant.findUnique({ where: { id: 1000 } }),
  ]);

  const paidMoney = paidOrders.reduce((sum, order) => sum + Number(order.money), 0);
  const ordersTotal = orders;
  const successRate = orders > 0 ? Math.round((paidOrders.length / orders) * 100) : 0;
  const merchantName = merchant?.name || "默认商户";
  const apiUrl = appUrl();
  const pid = String(merchant?.id || 1000);
  const apiKey = merchant?.apiKey || "";

  return (
    <AdminShell title="控制台" description="单商户收款系统的实时运行概览。">
      {reset ? (
        <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-green-700 dark:text-green-200 text-sm">
          商户 KEY 已重新生成，请同步更新商户系统。
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="订单总数" value={String(ordersTotal)} hint="平台累计订单" />
        <Metric label="已支付金额" value={`¥ ${paidMoney.toFixed(2)}`} hint={`${paidOrders.length} 笔成功订单`} />
        <Metric label="待支付订单" value={String(pendingOrders)} hint="等待用户完成支付" />
        <Metric label="成功率" value={`${successRate}%`} hint="按当前订单总量计算" />
      </section>

      <Card className="overflow-hidden rounded-xl">
        <CardHeader className="border-b border-border/60 bg-muted/30 p-4">
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-5" />
            默认商户
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form method="post" action="/api/admin/settings" className="grid gap-4 rounded-xl border border-border/60 bg-muted/25 p-4 max-sm:max-w-full">
            <input type="hidden" name="merchant_key" value={apiKey} />
            <input type="hidden" name="redirect_to" value="/admin" />
            <div className="grid gap-2">
              <Label htmlFor="merchant_name">默认商户名称</Label>
              <Input id="merchant_name" name="merchant_name" defaultValue={merchantName} />
            </div>
            <div className="flex gap-2">
              <button type="submit" name="action" value="update_merchant" className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
                保存名称
              </button>
              <button type="submit" name="action" value="reset_key" className="rounded-xl bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:opacity-90">
                重置 KEY
              </button>
            </div>
          </form>

          <div className="grid gap-4 pt-4">
            <Info label="接口地址" value={apiUrl} />
            <Info label="商户 PID" value={pid} />
            <Info label="商户 KEY" value={apiKey} mono />
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="overflow-hidden rounded-xl transition-transform hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="grid gap-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Activity({ className }: { className?: string }) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12h-4l-1-2-9-7-9 7v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" />
  </svg>;
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input value={value || "-"} readOnly className={mono ? "font-mono text-xs" : undefined} />
    </div>
  );
}
