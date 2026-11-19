/**
 * 站点级常量：品牌、主站地址、SEO 默认值。
 *
 * 这里的所有值都在构建期固化进 HTML。落地站不请求任何接口，
 * 因此品牌名、Logo、跳转地址都必须写在这里，而不是从 /api/status 读。
 */

/** 生产落地站的规范化地址（含协议，不带结尾斜杠）。同时用于 canonical 与 sitemap。 */
export const SITE_URL = 'https://huancaixi.vip'

/** 主站地址：登录、注册、控制台、法律条款都跳这里。 */
export const MAIN_SITE_URL = 'https://hcxai.dpdns.org'

/** 对外展示的品牌名。与主站 system_name 保持一致即可，但不从接口读。 */
export const BRAND_NAME = 'Token API'

/**
 * Google Tag Manager 容器 ID。置为空字符串即完全关闭注入。
 *
 * 只注入落地站——主站自行 noindex，不计入统计口径，否则同一次访问会被算两次。
 * 走标准 GTM 片段（先推 gtm.start 事件再异步加载容器），不要改成裸 <script src>，
 * 否则容器内依赖 gtm.start 的触发器可能不触发。
 */
export const GTM_ID = 'GTM-PJ9MFW8S'

/**
 * 主站关键路径。集中在这里，主站改路由时只需改这一处。
 * 落地站所有「去主站」的动作都必须走这些常量，不允许散落硬编码。
 */
export const MAIN_SITE_PATHS = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
  pricing: '/pricing',
  models: '/pricing',
  userAgreement: '/user-agreement',
  privacyPolicy: '/privacy-policy',
} as const

/**
 * 跳主站时统一附带的渠道参数。
 * 集中在这里而不是散落到各组件，避免新增链接时漏掉。
 */
export const AFF_CODE = 'SIoD'

/**
 * 拼出主站的绝对地址，并自动附带 aff 渠道参数。
 * 落地站所有「去主站」的动作都必须走这里，不允许手拼 MAIN_SITE_URL。
 */
export function mainSiteUrl(path: keyof typeof MAIN_SITE_PATHS): string {
  const url = new URL(MAIN_SITE_PATHS[path], MAIN_SITE_URL)
  url.searchParams.set('aff', AFF_CODE)
  return url.href
}

/**
 * 示例代码里展示的 API Base URL。
 * 独立于 MAIN_SITE_URL 的用途：这里是对外承诺给开发者的接入地址，
 * 通常就是主站域名，但也可以单独改成 CDN 或专用网关域名。
 */
export const API_BASE_URL = `${MAIN_SITE_URL}/v1`

/** 支持的语言。顺序即落地站语言切换菜单的顺序。 */
export const LOCALES = ['zh', 'en', 'ja', 'ru', 'fr', 'vi', 'zh-TW'] as const

export type Locale = (typeof LOCALES)[number]

/** 默认语言（无前缀路径使用的语言）。 */
export const DEFAULT_LOCALE: Locale = 'zh'

/** 各语言的 hreflang 与 <html lang> 取值。 */
export const LOCALE_META: Record<
  Locale,
  { htmlLang: string; label: string; path: string }
> = {
  zh: { htmlLang: 'zh-CN', label: '简体中文', path: '/' },
  en: { htmlLang: 'en', label: 'English', path: '/en/' },
  ja: { htmlLang: 'ja', label: '日本語', path: '/ja/' },
  ru: { htmlLang: 'ru', label: 'Русский', path: '/ru/' },
  fr: { htmlLang: 'fr', label: 'Français', path: '/fr/' },
  vi: { htmlLang: 'vi', label: 'Tiếng Việt', path: '/vi/' },
  'zh-TW': { htmlLang: 'zh-TW', label: '繁體中文', path: '/zh-TW/' },
}