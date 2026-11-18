import { LOCALES, LOCALE_META, type Locale } from '@/config/site'

/**
 * 生成某个页面在全部语言下的路径映射，供 hreflang 分发使用。
 *
 * `paths` 只需给出「非中文语言」的路径；中文一律用 zhPath。
 * 这样首页、404 页等每个页面都能正确互指，而不用各写一遍全量映射。
 */
export function buildPathByLocale(
  zhPath: string,
  paths: Partial<Record<Locale, string>>
): Record<Locale, string> {
  const result = {} as Record<Locale, string>
  for (const code of LOCALES) {
    if (code === 'zh') {
      result.zh = zhPath
      continue
    }
    result[code] = paths[code] ?? `${LOCALE_META[code].path}404/`
  }
  return result
}

/** 校验站点配置，构建期就能发现漏配，而不是上线后才发现。 */
export function assertSiteConfig(siteUrl: string, mainSiteUrl: string) {
  const problems: string[] = []

  if (!siteUrl.startsWith('https://')) {
    problems.push(`SITE_URL 必须是 https 绝对地址，当前为 ${siteUrl}`)
  }
  if (!mainSiteUrl.startsWith('https://')) {
    problems.push(`MAIN_SITE_URL 必须是 https 绝对地址，当前为 ${mainSiteUrl}`)
  }
  if (siteUrl.replace(/\/$/, '') === mainSiteUrl.replace(/\/$/, '')) {
    problems.push('落地站与主站不能是同一个域名，否则会互相抢索引')
  }
  if (siteUrl.includes('example.com')) {
    problems.push('SITE_URL 还是占位值 example.com，部署前必须改成真实域名')
  }

  if (problems.length > 0) {
    // 只告警不中断：本地开发时占位值也能正常构建
    console.warn('\n[site config]\n  ' + problems.join('\n  ') + '\n')
  }
}