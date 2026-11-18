import { LOCALES, LOCALE_META, mainSiteUrl, type Locale } from '@/config/site'
import type { ErrorText } from '@/components/ErrorScreen.astro'

/** 错误页在各语言下的路径映射，用于 hreflang 互指。 */
export function errorPathByLocale(
  code: '404' | '500'
): Record<string, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      locale === 'zh'
        ? `/${code}/`
        : `${LOCALE_META[locale].path}${code}/`,
    ])
  )
}

/** 当前语言下该错误页的路径。 */
export function errorPath(locale: Locale, code: '404' | '500'): string {
  return errorPathByLocale(code)[locale]
}

type ErrorCopy = {
  title: string
  description: string
  primaryLabel: string
  secondaryLabel: string
}

const NOT_FOUND: Record<Locale, ErrorCopy> = {
  zh: {
    title: '页面未找到',
    description:
      '你访问的页面不存在，或者已经被移动。可以回到首页重新开始，或直接前往主站登录使用。',
    primaryLabel: '返回首页',
    secondaryLabel: '前往主站登录',
  },
  en: {
    title: 'Page not found',
    description:
      'The page you are looking for does not exist or has been moved. Start over from the home page, or sign in on the main site.',
    primaryLabel: 'Back to home',
    secondaryLabel: 'Sign in on the main site',
  },
  ja: {
    title: 'ページが見つかりません',
    description:
      'お探しのページは存在しないか、移動されました。ホームページからやり直すか、メインサイトでログインしてください。',
    primaryLabel: 'ホームへ戻る',
    secondaryLabel: 'メインサイトでログイン',
  },
  ru: {
    title: 'Страница не найдена',
    description:
      'Запрашиваемая страница не существует или была перемещена. Начните с главной страницы или войдите на основном сайте.',
    primaryLabel: 'На главную',
    secondaryLabel: 'Войти на основном сайте',
  },
  fr: {
    title: 'Page introuvable',
    description:
      'La page demandée n’existe pas ou a été déplacée. Reprenez depuis l’accueil, ou connectez-vous sur le site principal.',
    primaryLabel: 'Retour à l’accueil',
    secondaryLabel: 'Se connecter sur le site principal',
  },
  vi: {
    title: 'Không tìm thấy trang',
    description:
      'Trang bạn tìm không tồn tại hoặc đã được di chuyển. Hãy bắt đầu lại từ trang chủ, hoặc đăng nhập trên trang chính.',
    primaryLabel: 'Về trang chủ',
    secondaryLabel: 'Đăng nhập trên trang chính',
  },
  'zh-TW': {
    title: '頁面未找到',
    description:
      '你造訪的頁面不存在，或已經被移動。可以回到首頁重新開始，或直接前往主站登入使用。',
    primaryLabel: '返回首頁',
    secondaryLabel: '前往主站登入',
  },
}

const SERVER_ERROR: Record<Locale, ErrorCopy> = {
  zh: {
    title: '服务暂时不可用',
    description:
      '页面加载时出现异常。可以稍后重试，如果问题持续出现请联系管理员。',
    primaryLabel: '返回首页',
    secondaryLabel: '前往主站登录',
  },
  en: {
    title: 'Service temporarily unavailable',
    description:
      'Something went wrong while loading this page. Try again shortly, and contact your administrator if it persists.',
    primaryLabel: 'Back to home',
    secondaryLabel: 'Sign in on the main site',
  },
  ja: {
    title: 'サービスが一時的に利用できません',
    description:
      'ページの読み込み中に問題が発生しました。しばらくしてから再試行し、解決しない場合は管理者にご連絡ください。',
    primaryLabel: 'ホームへ戻る',
    secondaryLabel: 'メインサイトでログイン',
  },
  ru: {
    title: 'Сервис временно недоступен',
    description:
      'При загрузке страницы произошла ошибка. Повторите попытку позже, а если это повторяется — обратитесь к администратору.',
    primaryLabel: 'На главную',
    secondaryLabel: 'Войти на основном сайте',
  },
  fr: {
    title: 'Service temporairement indisponible',
    description:
      'Une erreur est survenue lors du chargement. Réessayez plus tard, et contactez votre administrateur si le problème persiste.',
    primaryLabel: 'Retour à l’accueil',
    secondaryLabel: 'Se connecter sur le site principal',
  },
  vi: {
    title: 'Dịch vụ tạm thời không khả dụng',
    description:
      'Đã xảy ra lỗi khi tải trang. Hãy thử lại sau, và liên hệ quản trị viên nếu lỗi tiếp diễn.',
    primaryLabel: 'Về trang chủ',
    secondaryLabel: 'Đăng nhập trên trang chính',
  },
  'zh-TW': {
    title: '服務暫時無法使用',
    description:
      '頁面載入時發生異常。可以稍後重試，如果問題持續出現請聯絡管理員。',
    primaryLabel: '返回首頁',
    secondaryLabel: '前往主站登入',
  },
}

function toErrorText(
  code: '404' | '500',
  locale: Locale,
  copy: ErrorCopy
): ErrorText {
  const isNotFound = code === '404'
  return {
    code,
    kicker: isNotFound ? 'Not Found' : 'Server Error',
    title: copy.title,
    description: copy.description,
    primaryLabel: copy.primaryLabel,
    primaryHref: LOCALE_META[locale].path,
    secondaryLabel: copy.secondaryLabel,
    secondaryHref: mainSiteUrl('signIn'),
    stamp: isNotFound
      ? { title: 'VOID', lines: ['NO ROUTE'], color: 'var(--tdz-orange)' }
      : { title: 'FAULT', lines: ['RETRY'], color: 'var(--tdz-orange)' },
    barcodeSeed: isNotFound ? '404-not-found' : 'error-500',
  }
}

export function getErrorText(locale: Locale, code: '404' | '500'): ErrorText {
  const table = code === '404' ? NOT_FOUND : SERVER_ERROR
  return toErrorText(code, locale, table[locale] ?? table.zh)
}