# 如何将支付系统集成到您的网站

## 配置说明

此支付系统可以通过以下方式集成到您的现有网站：

### 方式一：通过子域名（推荐）
在您的 DNS 中创建子域名（例如：`pay.yoursite.com`），指向此服务器

### 方式二：通过路径前缀
设置环境变量 `NEXT_PUBLIC_BASE_PATH=/payment`，所有路由将变为：
- `/payment/pay/:tradeNo` - 支付页面
- `/payment/cashier/:tradeNo` - 收银台
- `/payment/test-pay` - 测试支付
- `/payment/admin/login` - 管理登录
- `/payment/api/*` - API 接口

### 方式三：嵌入到现有页面
您可以在现有网站的 iframe 中嵌入支付页面：

```html
<iframe 
  src="https://yoursite.com/pay/ORDER12345"
  width="360" 
  height="640"
  style="border:none; border-radius:12px;"
  allowfullscreen
></iframe>
```

## 环境变量配置

在 `.env.local` 文件中设置：

```env
# 基础路径（用于路径前缀集成）
NEXT_PUBLIC_BASE_PATH=/payment

# 替换为实际的交易号（可选，用于测试）
PAY_TRADE_NO=:tradeNo
CASHIER_TRADE_NO=:tradeNo

# 支付配置（请根据实际情况修改）
WECHAT_MERCHANT_ID=your_wechat_merchant_id
WECHAT_MERCHANT_KEY=your_wechat_merchant_key
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key
ALIPAY_PUBLIC_KEY=alipay_public_key

# 会话和安全
ADMIN_SESSION_SECRET=your_strong_secret_here
NEXTAUTH_SECRET=your_nextauth_secret
```

## 启动命令

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## API 接口说明

### 创建支付订单
POST `/api/pay/start/:tradeNo`
Body: `{ money: number, type: 'wechat'|'alipay', returnUrl?: string, notifyUrl?: string }`

### 查询支付状态
GET `/api/pay/status/:tradeNo`
Response: 包含订单状态、金额、支付时间等信息

### 支付回调
- 微信：POST `/api/pay/wechat/notify`
- 支付宝：POST/GET `/api/pay/alipay/notify`

## 注意事项

1. **安全**：请确保在生产环境中使用 HTTPS
2. **CORS**：API 已配置为允许跨域请求，可直接从前端调用
3. **会话**：管理后台需要登录验证，登录成功后会设置 HttpOnly Cookie
4. **自定义**：所有样式基于 Tailwind CSS，可通过修改 `tailwind.config.ts` 自定义