import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

/**
 * 纯静态落地站点的构建配置。
 *
 * 三条硬约束，改动前请先读：
 * 1. 产物必须完全静态（output: 'static'），部署到任意静态托管即可，不依赖 Node 运行时。
 * 2. 构建期不请求主站接口，所有数据来自 src/config/site.ts 与本地 i18n 文案。
 * 3. 站点只有一个 SEO 入口（本站），canonical 一律指向本站自身的绝对地址。
 */
export default defineConfig({
  site: 'https://token-api.example.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    sitemap({
      // 错误页已标 noindex，放进 sitemap 会向搜索引擎发出矛盾信号
      filter: (page) => !/\/(404|500)\/?$/.test(page),
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en',
          ja: 'ja',
          ru: 'ru',
          fr: 'fr',
          vi: 'vi',
          'zh-TW': 'zh-TW',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // 静态站不需要 JS 校验的 inline script 变换，保持产物可读
    inlineStylesheets: 'auto',
  },
})