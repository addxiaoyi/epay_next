# 支付系统路径前缀集成指南

## 配置信息

您的支付系统已配置为路径前缀方式接入：

- **域名**：`star-web.top`
- **路径前缀**：`/pay`
- **完整访问地址**：`http://star-web.top/pay`

### 环境变量配置

在 `.env` 文件中确保以下配置：

```env
PORT="3000"
APP_URL="http://star-web.top/pay"
ADMIN_SESSION_SECRET="your_strong_secret_here_change_this"
DATABASE_URL="mysql://epay:epay@127.0.0.1:3306/epay"
NEXT_PUBLIC_BASE_PATH="/pay"
```

## 如何访问

### 1. 支付系统页面

访问您的网站并添加 `/pay` 前缀：

| 功能 | 完整 URL |
|------|----------|
| 主页（产品介绍） | `http://star-web.top/pay/` |
| 测试支付页面 | `http://star-web.top/pay/test-pay` |
| 管理后台登录 | `http://star-web.top/pay/admin/login` |
| 管理后台控制台 | `http://star-web.top/pay/admin/` |
| 支付页面 | `http://star-web.top/pay/pay/:tradeNo` |
| 收银台页面 | `http://star-web.top/pay/cashier/:tradeNo` |
| API 接口 | `http://star-web.top/pay/api/*` |

### 2. 支付页面 URL 示例

假设您有一个订单号为 `ORDER12345` 的订单：

```
http://star-web.top/pay/pay/ORDER12345
```

或者使用测试支付功能：

```
http://star-web.top/pay/test-pay
```

### 3. API 接口

您可以使用 API 创建支付订单：

```bash
# 创建支付订单（提交到支付系统）
POST http://star-web.top/pay/api/test-pay
Body: { money: 10.00, type: 'wechat', name: '商品名称' }

# 查询支付状态
GET http://star-web.top/pay/api/pay/status/ORDER12345
```

## 如何集成到您的网站

### 方式 1：直接跳转链接

在您的网站页面中添加链接：

```html
<!-- 测试支付链接 -->
<a href="http://star-web.top/pay/test-pay" target="_blank">
  立即支付
</a>

<!-- 具体订单支付链接 -->
<a href="http://star-web.top/pay/pay/ORDER12345" target="_blank">
  支付订单
</a>
```

### 方式 2：iframe 嵌入（推荐用于商品详情页）

在您的网站页面中嵌入支付页面：

```html
<!-- 嵌入支付页面 -->
<iframe
  src="http://star-web.top/pay/pay/ORDER12345"
  width="360"
  height="640"
  style="border:none; border-radius:12px;"
  allowfullscreen
  loading="lazy"
></iframe>
```

### 方式 3：按钮跳转

使用按钮跳转到支付页面：

```javascript
// 点击按钮跳转到支付页面
function createOrderAndPay(orderId, amount, productName) {
  // 首先通过 API 创建订单
  fetch('http://star-web.top/pay/api/test-pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      money: amount,
      type: 'wechat',  // 'wechat' 或 'alipay'
      name: productName,
      out_trade_no: orderId,
      notify_url: 'http://your-site.com/pay-notify',
      return_url: `http://your-site.com/order-success?order=${orderId}`
    })
  })
  .then(response => response.json())
  .then(data => {
    // 跳转到支付页面
    window.location.href = `http://star-web.top/pay/pay/${data.tradeNo}`;
  })
  .catch(error => {
    console.error('创建订单失败:', error);
  });
}
```

### 方式 4：JavaScript 跳转

使用 JavaScript 重定向：

```javascript
// 直接跳转到支付页面
function goToPayment(tradeNo) {
  window.location.href = `http://star-web.top/pay/pay/${tradeNo}`;
}

// 或者在新标签页中打开
function openPayment(tradeNo) {
  window.open(`http://star-web.top/pay/pay/${tradeNo}`, '_blank');
}
```

## 支付回调配置

### 1. 异步通知 URL（Webhook）

配置您的订单系统接收支付成功通知：

- **微信支付通知**：`http://star-web.top/pay/api/pay/wechat/notify`
- **支付宝通知**：`http://star-web.top/pay/api/pay/alipay/notify`

### 2. 同步跳转 URL

支付完成后，用户将跳转到您指定的 URL：

```javascript
// 在创建订单时指定 return_url
const return_url = 'http://your-site.com/order-success';
```

### 3. 通知处理示例

您的网站需要接收并验证支付通知：

```javascript
// 示例：Node.js 处理支付通知
app.post('/pay-notify', async (req, res) => {
  const params = req.query;
  
  // 验证签名
  const isValid = verifySign(params, merchantApiKey);
  
  if (!isValid) {
    return res.status(400).json({ code: -1, msg: '签名验证失败' });
  }
  
  // 检查订单状态
  const { trade_no, trade_status, money, name } = params;
  
  if (trade_status === 'TRADE_SUCCESS') {
    // 支付成功，更新您的订单状态
    await updateOrderStatus(trade_no, 'PAID');
    res.send('success');
  } else {
    res.send('fail');
  }
});
```

## 管理后台访问

### 1. 访问管理后台

```
http://star-web.top/pay/admin/login
```

### 2. 默认登录凭证

- **用户名**：`admin`
- **密码**：`123456`

**注意**：首次登录后请立即修改密码。

### 3. 管理功能

在管理后台您可以：
- 查看支付统计和订单记录
- 管理商户信息和 API Key
- 配置支付通道和费率
- 管理订单和退款

## 常见问题

### 1. 页面无法访问

检查以下几点：
- 确保服务器正在运行：`http://star-web.top:3000`
- 检查环境变量是否正确配置
- 确认 DNS 解析正确（或 hosts 文件）
- 查看浏览器控制台是否有错误信息

### 2. API 返回错误

检查：
- API 请求头是否包含 `Content-Type: application/json`
- 请求体格式是否正确
- 商户 ID 和 API Key 是否正确

### 3. 支付回调未收到

检查：
- 通知 URL 是否正确配置
- 您的服务器是否可以访问（公网可访问）
- 查看服务器日志确认请求到达

## 部署注意事项

### 1. 生产环境配置

```env
# 生产环境需要 HTTPS
APP_URL="https://star-web.top/pay"
NEXT_PUBLIC_BASE_PATH="/pay"

# 使用强密码
ADMIN_SESSION_SECRET="your_very_strong_secret_here_32_chars_minimum"

# 数据库连接（生产环境）
DATABASE_URL="mysql://user:password@host:port/database"
```

### 2. 反向代理配置

如果您使用 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name star-web.top;
    
    location /pay/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 技术支持

如需帮助，请检查：
1. 服务器日志
2. 浏览器控制台错误
3. API 请求和响应
4. 数据库连接状态

确保所有环境配置正确后，您的支付系统应该可以正常运行。