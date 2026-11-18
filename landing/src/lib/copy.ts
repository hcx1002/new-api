import { API_BASE_URL, BRAND_NAME, MAIN_SITE_URL, type Locale } from '@/config/site'

export type LandingCopy = {
  /** <title> 内容。控制在 60 字符内，避免搜索结果被截断 */
  title: string
  /** meta description。控制在 155 字符内 */
  description: string
  /** 页脚展示的主机名 */
  host: string
  /** 示例代码里的 API Base URL */
  apiBaseUrl: string
}

/**
 * 各语言的 SEO 文案。
 *
 * 刻意没有从 i18n 的 mk.landing.* 里取：那套文案是给页面排版用的短句，
 * 而 title / description 需要独立控制关键词与长度，混在一起改起来会互相牵制。
 */
const COPY: Record<Locale, LandingCopy> = {
  zh: {
    title: `${BRAND_NAME} · 一个 API Key 接入全部主流 AI 模型`,
    description:
      'OpenAI 兼容的 AI 模型网关，一个 API Key 调用 GPT、Claude、Gemini、DeepSeek 等主流模型。支持流式输出、函数调用与按量计费，5 分钟完成接入。',
    host: new URL(MAIN_SITE_URL).host,
    apiBaseUrl: API_BASE_URL,
  },
  en: {
    title: `${BRAND_NAME} · One API key for every leading AI model`,
    description:
      'An OpenAI-compatible AI gateway. Call GPT, Claude, Gemini and DeepSeek through a single API key, with streaming, tool calls and pay-as-you-go pricing.',
    host: new URL(MAIN_SITE_URL).host,
    apiBaseUrl: API_BASE_URL,
  },
  ja: {
    title: `${BRAND_NAME} · 1つのAPIキーで主要AIモデルをすべて利用`,
    description:
      'OpenAI互換のAIゲートウェイ。1つのAPIキーでGPT、Claude、Gemini、DeepSeekなどの主要モデルを呼び出せます。ストリーミング、ツール呼び出し、従量課金に対応。',
    host: new URL(MAIN_SITE_URL).host,
    apiBaseUrl: API_BASE_URL,
  },
  ru: {
    title: `${BRAND_NAME} · Один API-ключ для всех ведущих ИИ-моделей`,
    description:
      'ИИ-шлюз с совместимостью с OpenAI. Вызывайте GPT, Claude, Gemini и DeepSeek через один API-ключ: потоковая передача, вызов инструментов и оплата по факту использования.',
    host: new URL(MAIN_SITE_URL).host,
    apiBaseUrl: API_BASE_URL,
  },
  fr: {
    title: `${BRAND_NAME} · Une clé API pour tous les grands modèles d'IA`,
    description:
      'Une passerelle IA compatible OpenAI. Appelez GPT, Claude, Gemini et DeepSeek avec une seule clé API : streaming, appels d’outils et facturation à l’usage.',
    host: new URL(MAIN_SITE_URL).host,
    apiBaseUrl: API_BASE_URL,
  },
  vi: {
    title: `${BRAND_NAME} · Một API key cho mọi mô hình AI hàng đầu`,
    description:
      'Cổng AI tương thích OpenAI. Gọi GPT, Claude, Gemini và DeepSeek chỉ với một API key, hỗ trợ streaming, gọi công cụ và tính phí theo mức sử dụng.',
    host: new URL(MAIN_SITE_URL).host,
    apiBaseUrl: API_BASE_URL,
  },
  'zh-TW': {
    title: `${BRAND_NAME} · 一個 API Key 接入全部主流 AI 模型`,
    description:
      'OpenAI 相容的 AI 模型閘道，一個 API Key 呼叫 GPT、Claude、Gemini、DeepSeek 等主流模型。支援串流輸出、函式呼叫與按量計費，5 分鐘完成接入。',
    host: new URL(MAIN_SITE_URL).host,
    apiBaseUrl: API_BASE_URL,
  },
}

export function getLandingCopy(locale: Locale): LandingCopy {
  return COPY[locale] ?? COPY.zh
}

/** 各语言的引导描述，供 404 等辅助页面使用 */
export const ERROR_COPY: Record<
  Locale,
  { notFoundTitle: string; notFoundDesc: string; notFoundTitle404: string }
> = {
  zh: {
    notFoundTitle: '页面未找到',
    notFoundDesc: '你访问的页面不存在，或已经被移动。可以从首页重新开始。',
    notFoundTitle404: '页面未找到',
  },
  en: {
    notFoundTitle: 'Page not found',
    notFoundDesc:
      'The page you are looking for does not exist or has been moved. Start again from the home page.',
    notFoundTitle404: 'Page not found',
  },
  ja: {
    notFoundTitle: 'ページが見つかりません',
    notFoundDesc:
      'お探しのページは存在しないか、移動されました。ホームページからやり直してください。',
    notFoundTitle404: 'ページが見つかりません',
  },
  ru: {
    notFoundTitle: 'Страница не найдена',
    notFoundDesc:
      'Запрашиваемая страница не существует или была перемещена. Начните с главной страницы.',
    notFoundTitle404: 'Страница не найдена',
  },
  fr: {
    notFoundTitle: 'Page introuvable',
    notFoundDesc:
      'La page demandée n’existe pas ou a été déplacée. Reprenez depuis la page d’accueil.',
    notFoundTitle404: 'Page introuvable',
  },
  vi: {
    notFoundTitle: 'Không tìm thấy trang',
    notFoundDesc:
      'Trang bạn tìm không tồn tại hoặc đã được di chuyển. Hãy bắt đầu lại từ trang chủ.',
    notFoundTitle404: 'Không tìm thấy trang',
  },
  'zh-TW': {
    notFoundTitle: '頁面未找到',
    notFoundDesc: '你造訪的頁面不存在，或已經被移動。可以從首頁重新開始。',
    notFoundTitle404: '頁面未找到',
  },
}