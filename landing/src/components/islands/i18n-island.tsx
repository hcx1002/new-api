import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import { createI18n, normalizeLanguage } from '@/i18n'

/**
 * 给 island 注入 i18n 上下文，并把当前语言的翻译随 props 一起传下来。
 *
 * 为什么要传翻译而不是让 island 自己 import JSON：
 * 客户端打包时如果 island 里 `import './locales/ja.json'`，Vite 会把
 * 7 种语言全部塞进同一个 chunk（实测 156 KB），而每个页面其实只需要一种。
 * 由 Astro 在构建期把当前语言的资源作为 props 内联到 HTML 里，
 * 客户端就完全不需要为文案付出打包体积。
 *
 * 同时这里创建**每语言独立的 i18n 实例**：Astro 在同一构建进程里
 * 连续预渲染 21 个页面，共享单例 + changeLanguage 的异步特性会让
 * 后面的页面沿用前一个语言，出现「所有语言都渲染成英文」的串味。
 */
export function I18nIsland({
  locale,
  resources,
  children,
}: {
  locale: string
  /** 当前语言的翻译对象，由 .astro 在构建期传入 */
  resources: Record<string, unknown>
  children: ReactNode
}) {
  const language = normalizeLanguage(locale)
  const i18n = createI18n(language, resources)

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}