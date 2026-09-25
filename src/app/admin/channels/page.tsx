import { ChannelProvider } from "@prisma/client";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

type ChannelRow = {
  id: number;
  name: string;
  provider: ChannelProvider;
  enabled: boolean;
  rate: unknown;
  payMin: unknown;
  payMax: unknown;
  config: unknown;
  code: string;
  product: string;
  typeId: number;
  updatedAt: Date;
  createdAt: Date;
};

export const dynamic = "force-dynamic";

export default async function ChannelsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  await searchParams;
  const channels = await prisma.channel.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true, provider: true, enabled: true, rate: true, payMin: true, payMax: true, config: true, code: true, product: true, typeId: true, updatedAt: true, createdAt: true },
  });

  return (
    <AdminShell title="支付通道" description="维护通道配置">
      {searchParams.then(p => p.saved) ? (
        <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-green-700 dark:text-green-200 text-sm">
          通道配置已保存。
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {channels.map((channel) => (
          <ChannelForm key={channel.id} channel={channel} />
        ))}
      </div>
    </AdminShell>
  );
}

function ChannelForm({ channel }: { channel: ChannelRow }) {
  const config = (channel.config || {}) as Record<string, unknown>;
  const provider = channel.provider;
  const products = productOptions[provider];

  return (
    <Card className="overflow-hidden rounded-xl">
      <CardHeader className="border-b border-border/60 bg-muted/30 p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{channel.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{provider} / #{channel.id}</p>
          </div>
          <Badge variant={channel.enabled ? "default" : "secondary"}>{channel.enabled ? "启用" : "停用"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <form className="grid gap-4" method="post" action="/pay/api/admin/channels">
          <input type="hidden" name="id" value={channel.id} />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="enabled" defaultChecked={channel.enabled} className="h-4 w-4 rounded" />
            <Label className="mb-0">启用当前通道</Label>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">通道名称</Label>
              <Input id="name" name="name" defaultValue={channel.name} />
            </div>
            <div className="grid gap-2">
              <Label>支付产品</Label>
              <select name="product" defaultValue={channel.product}>
                {products.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            <ChannelFields provider={provider} config={config} />
          </div>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
            保存通道配置
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

const productOptions = {
  ALIPAY: [
    { value: "qr", label: "当面付扫码" },
    { value: "pc", label: "电脑网站支付" },
    { value: "wap", label: "手机网站支付" },
  ],
  WECHAT: [
    { value: "native", label: "Native 扫码" },
    { value: "h5", label: "H5 支付" },
    { value: "jsapi", label: "JSAPI/公众号" },
    { value: "miniprogram", label: "小程序" },
    { value: "app", label: "APP" },
  ],
} as const;

function ChannelFields({ provider, config }: { provider: ChannelProvider; config: Record<string, unknown> }) {
  if (provider === ChannelProvider.ALIPAY) {
    return (
      <div className="grid gap-2">
        <Field name="appId" label="支付宝 App ID" value={String(config.appId || "")} />
        <Field name="privateKey" label="应用私钥 privateKey" value={String(config.privateKey || "")} isTextarea />
        <Field name="alipayPublicKey" label="支付宝公钥" value={String(config.alipayPublicKey || "")} isTextarea />
      </div>
    );
  }
  return (
    <div className="grid gap-2">
      <Field name="appId" label="微信 App ID" value={String(config.appId || "")} />
      <Field name="mchId" label="商户号 mchId" value={String(config.mchId || "")} />
      <Field name="apiV3Key" label="APIv3 密钥" value={String(config.apiV3Key || "")} isTextarea />
      <Field name="merchantSerialNo" label="商户证书序列号" value={String(config.merchantSerialNo || "")} />
      <Field name="merchantPrivateKey" label="商户私钥" value={String(config.merchantPrivateKey || "")} isTextarea />
      <Field name="platformCertificate" label="平台证书" value={String(config.platformCertificate || "")} isTextarea />
    </div>
  );
}

function Field({ name, label, value, isTextarea = false }: { name: string; label: string; value: string; isTextarea?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      {isTextarea ? (
        <textarea id={name} name={name} defaultValue={value || ""} className="min-h-20 font-mono text-xs rounded border px-2 py-1" />
      ) : (
        <Input id={name} name={name} defaultValue={value || ""} />
      )}
    </div>
  );
}