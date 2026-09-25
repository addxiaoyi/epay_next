import { ArrowRight, CheckCircle2, QrCode, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { LoadingLink } from "@/components/loading-link";
import { PaymentBrandIcon } from "@/components/payment-brand";
import { PublicShell } from "@/components/public-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const features = ["旧 SDK 兼容", "官方通道", "单商户 KEY", "通知重试"];

export default function Home() {
  return (
    <PublicShell>
      <section className="h-full w-full px-4 py-5 md:px-8 lg:px-12">
        <div className="grid h-full w-full items-center gap-5 lg:grid-cols-[1.03fr_.97fr]">
          <div className="flex min-h-0 flex-col justify-center text-center lg:text-left">
            <Badge variant="secondary" className="mx-auto w-fit rounded-full px-4 py-1.5 lg:mx-0">
              <Sparkles className="mr-1 size-3.5 text-primary" />
              Next.js · MySQL · 单商户易支付
            </Badge>
            <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-semibold md:text-4xl lg:mx-0 xl:text-5xl">
              轻盈、克制、可自托管的收款系统
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground md:text-base lg:mx-0 xl:text-lg">
              保留易支付旧接口接入方式，提供现代化单屏前台、官方支付通道和简洁后台管理。
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
              <LoadingLink href="/test-pay" className={buttonVariants({ size: "lg", className: "rounded-full" })}>
                发起测试支付 <ArrowRight className="size-4" />
              </LoadingLink>
              <LoadingLink href="/admin/login" className={buttonVariants({ size: "lg", variant: "outline", className: "rounded-full" })}>
                进入后台
              </LoadingLink>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground lg:justify-start">
              {features.map((item) => (
                <span key={item} className="rounded-full border px-3 py-1">{item}</span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl lg:mx-0">
            <div className="rounded-2xl border p-4 md:p-5">
              <div className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-primary">Payment Terminal</p>
                    <h2 className="mt-2 text-2xl font-semibold">桌面收款终端</h2>
                    <p className="mt-2 text-sm text-muted-foreground">扫码、跳转、回调通知集中处理。</p>
                  </div>
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <WalletCards className="size-6" />
                  </span>
                </div>

                <div className="mt-6 rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">测试订单</div>
                      <div className="mt-1 text-4xl font-semibold">¥ 0.01</div>
                    </div>
                    <div className="grid size-16 place-items-center rounded-2xl border bg-background">
                      <QrCode className="size-8 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-muted">
                    <div className="h-full w-2/3 rounded-full bg-primary" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <HomePayCard code="alipay" title="支付宝" text="蓝色扫码体验" />
                  <HomePayCard code="wxpay" title="微信支付" text="绿色收款体验" />
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <FlowLine icon={<CheckCircle2 />} title="订单签名已校验" text="兼容 submit.php / mapi.php" />
                  <FlowLine icon={<ShieldCheck />} title="支付回调幂等处理" text="成功后自动通知商户系统" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

function HomePayCard({ code, title, text }: { code: "alipay" | "wxpay"; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-4 text-left">
      <PaymentBrandIcon code={code} />
      <div className="mt-4 font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{text}</div>
    </div>
  );
}

function FlowLine({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/45 px-4 py-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">{icon}</div>
      <div className="min-w-0">
        <div className="truncate font-medium">{title}</div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}