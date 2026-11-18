import en from '@/i18n/locales/en.json'
import fr from '@/i18n/locales/fr.json'
import ja from '@/i18n/locales/ja.json'
import ru from '@/i18n/locales/ru.json'
import vi from '@/i18n/locales/vi.json'
import zhTW from '@/i18n/locales/zh-TW.json'
import zh from '@/i18n/locales/zh.json'
import type { Locale } from '@/config/site'

/**
 * 读取某语言的完整翻译对象。
 *
 * 只在 `.astro` 的 frontmatter 里调用 —— 那是构建期（服务端）代码，
 * 这些 JSON 不会进入浏览器 bundle。island 通过 props 收到自己那一份，
 * 因此客户端不会为多语言文案付出任何体积。
 *
 * 用静态 import 而非 fs.readFile：这样 Astro/Vite 能正确解析 JSON，
 * 也不必在打包后的产物里保留文件路径。
 */
const ALL: Record<Locale, Record<string, unknown>> = {
  zh,
  en,
  ja,
  ru,
  fr,
  vi,
  'zh-TW': zhTW,
}

export function loadMessages(locale: Locale): Record<string, unknown> {
  return ALL[locale] ?? ALL.zh
}