import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { closeExpiredOrders, getOrderStatusText } from "@/lib/epay/order-status";
import { moneyToString } from "@/lib/epay/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  await searchParams;
  await closeExpiredOrders();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      tradeNo: true,
      outTradeNo: true,
      name: true,
      money: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <AdminShell title="订单管理" description="最近 100 笔订单">
      <Card className="overflow-hidden rounded-xl">
        <CardHeader className="border-b border-border/60 bg-muted/30 p-4">
          <CardTitle>订单列表</CardTitle>
          <CardDescription>显示最近订单，点击查看详情</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/25">
                  <TableHead>平台订单号</TableHead>
                  <TableHead>商户订单号</TableHead>
                  <TableHead>商品</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.tradeNo}>
                    <TableCell className="font-mono text-xs">{order.tradeNo}</TableCell>
                    <TableCell className="font-mono text-xs">{order.outTradeNo}</TableCell>
                    <TableCell className="min-w-44 font-medium">{order.name}</TableCell>
                    <TableCell>¥ {moneyToString(order.money)}</TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                    <TableCell className="min-w-40 text-muted-foreground">{order.createdAt.toLocaleString("zh-CN")}</TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">暂无订单</TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === "PAID" ? "default" : status === "PENDING" ? "secondary" : "outline";
  return <Badge variant={variant}>{getOrderStatusText(status)}</Badge>;
}