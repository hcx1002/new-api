# Token API 落地站（Astro）

面向搜索引擎的纯静态营销站，与主站视觉一致，但**不请求主站任何接口**。

## 定位与边界

| 项 | 说明 |
| --- | --- |
| 唯一 SEO 入口 | 本站被搜索引擎索引；主站应设 `noindex` |
| 纯静态 | 产物只有 HTML/CSS/JS，可部署到任意静态托管或 CDN |
| 零接口依赖 | 品牌名、示例地址、跳转链接都是构建期常量 |
| 登录注册 | 全部跳到主站，本站没有表单提交 |

## 目录

```
src/
├── config/site.ts        品牌、主站地址、语言、路径常量 —— 改配置只动这里
├── lib/
│   ├── copy.ts           各语言 SEO 文案（title / description）
│   ├── errors.ts         错误页文案
│   ├── messages.ts       构建期读取 locale JSON 传给 island
│   ├── data.ts           落地页展示数据（模型列表等，硬编码）
│   └── seo.ts            站点配置校验
├── layouts/Base.astro    <head>：canonical / hreflang / OG / JSON-LD
├── components/
│   ├── static/           纯静态组件，产物里零 JS
│   ├── islands/          有交互的组件，按需水合
│   ├── LandingView.astro 首页正文
│   └── ErrorScreen.astro 错误页外壳
├── i18n/locales/         7 种语言，仅保留落地站用到的 key
└── pages/
    ├── index.astro       中文首页 /
    ├── 404.astro         中文 404 /404/
    ├── 500.astro         中文 500 /500/
    └── [locale]/         其余 6 种语言，构建期静态生成
```

## 首屏 JS 策略

改动 `LandingView.astro` 里的 `client:*` 指令前请先读这一节。

| 组件 | 指令 | 原因 |
| --- | --- | --- |
| Navbar | `client:load` | 首屏要能展开移动端菜单、切换语言 |
| Hero | `client:load` | 线路弹窗、复制 Base URL |
| CodeShowcase | `client:visible` | 滚到视口才需要，首屏不受累 |
| Bento / Marquee / DarkSteps / CtaBanner / SiteFooter | 无指令 | 纯展示，渲染成 HTML，零 JS |

## 开发与构建

```bash
bun install
bun run dev      # http://localhost:4321
bun run build    # 产物在 dist/
bun run preview  # 本地预览产物
```

Node 要求 **>= 22.23.4**（Astro 7 的硬性要求）。

## 上线前必改

### 1. 域名

`src/config/site.ts`：

```ts
export const SITE_URL = 'https://token-api.example.com'  // 改成真实落地站域名
export const MAIN_SITE_URL = 'https://hcxai.dpdns.org'   // 主站地址
```

`public/robots.txt` 里的 Sitemap 地址也要同步改。

构建时会自动检查：域名还是 `example.com`、或者两个域名相同，都会打印告警。

### 2. 主站必须 noindex

本站是被索引的唯一入口。如果主站也开放索引，两套同源内容会互相稀释权重。
在 `web/index.html` 的 `<head>` 里加：

```html
<meta name="robots" content="noindex, nofollow" />
```

### 3. 翻译完成度

当前只有**中文和英文**有真实翻译。日、俄、法、越、繁中为英文占位（约 2% 完成度）。

这会让 5 个语言页面的正文都是英文，被搜索引擎判定为重复内容，反而拉低排名。
两个选择：

- **补齐翻译**：编辑 `src/i18n/locales/{ja,ru,fr,vi,zh-TW}.json`
- **暂时只上线中英**：删掉 `src/config/site.ts` 里 `LOCALES` 的其余项

## SEO 已实现项

- 每个语言独立 URL + self-canonical
- 7 种语言 hreflang 互指 + `x-default`
- Open Graph / Twitter Card
- JSON-LD：`WebSite` + `Organization` + `WebPage` + `SoftwareApplication`
- `sitemap-index.xml`（自动排除错误页）
- 错误页 `noindex, nofollow`
- 正文全部在 HTML 源码里，不依赖 JS 执行

## 部署

产物是纯静态文件，直接上传 `dist/` 即可。常见做法：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/landing/dist;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    error_page 404 /404.html;
    error_page 500 502 503 504 /500.html;

    # 带 hash 的静态资源可长期缓存
    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

注意 `try_files` 末位用 `=404` 而不是回退到 `index.html`：SPA 式回退会让
所有不存在的路径都返回 200 和首页内容，搜索引擎会视为大量重复页面。