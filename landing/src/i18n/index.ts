import { createInstance, type i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'

/**
 * 落地站的 i18n 配置。
 *
 * 与主站的关键差异：不用 browser language detector，不读写 localStorage。
 * 语言由 URL 决定（`/` = 中文，`/en/` = 英文 ……），静态站必须保证
 * 每个 URL 只对应一种语言，搜索引擎才能正确索引。
 *
 * 另一个差异：这里**不 import 任何 locale JSON**。
 * 翻译数据由 .astro 在构建期读取后作为 props 传给 island，
 * 这样客户端打包体积里不含任何文案，也避免 7 种语言全打进一个 chunk。
 */

export const SUPPORTED_LANGUAGES = [
  'zh',
  'en',
  'ja',
  'ru',
  'fr',
  'vi',
  'zh-TW',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

/** 把 URL 前缀归一成受支持的语言代码，未知值回落到中文。 */
export function normalizeLanguage(value?: string | null): SupportedLanguage {
  if (!value) return 'zh'
  const lower = value.trim().toLowerCase()
  if (lower === 'zh-tw' || lower === 'zh-hant') return 'zh-TW'
  if (lower.startsWith('zh')) return 'zh'
  const found = SUPPORTED_LANGUAGES.find((lang) => lang === lower)
  return found ?? 'zh'
}

/** 按语言缓存实例：同一语言在一次运行里只建一次。 */
const instances = new Map<string, I18nInstance>()

/**
 * 用给定的资源创建一个 i18n 实例。
 *
 * 同步初始化（initImmediate: false）：island 在构建期要同步渲染，
 * 异步 init 会让 t() 在资源就绪前返回 key 本身，
 * 预渲染出的 HTML 里就全是 `mk.landing.hero.titleLine1`。
 */
export function createI18n(
  language: SupportedLanguage,
  resources: Record<string, unknown>
): I18nInstance {
  const cacheKey = `${language}:${Object.keys(resources).length}`
  const cached = instances.get(cacheKey)
  if (cached) return cached

  const instance = createInstance()
  void instance.use(initReactI18next).init({
    resources: { [language]: { translation: resources } },
    lng: language,
    fallbackLng: language,
    supportedLngs: [language],
    keySeparator: '.',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initImmediate: false,
  })

  instances.set(cacheKey, instance)
  return instance
}