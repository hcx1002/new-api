/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, X } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { RichContent } from '@/components/rich-content'
import { getPrivacyPolicy, getUserAgreement } from '@/features/legal/api'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'

export type LegalDocKind = 'agreement' | 'privacy'

const DOC_SOURCE = {
  agreement: { queryKey: 'user-agreement', fetch: getUserAgreement },
  privacy: { queryKey: 'privacy-policy', fetch: getPrivacyPolicy },
} as const

/**
 * 登录/注册页的协议弹窗。
 * 内容来自后台「站点信息」里的 user_agreement / privacy_policy，
 * 可能是纯文本、HTML，也可能被配置成一个外部链接，三种都要能兜住。
 */
export function LegalDialog({
  kind,
  onClose,
}: {
  kind: LegalDocKind
  onClose: () => void
}) {
  const { t } = useTranslation()
  const source = DOC_SOURCE[kind]

  const { data, isLoading } = useQuery({
    queryKey: ['mk-legal', source.queryKey],
    queryFn: source.fetch,
    staleTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const raw = data?.data?.trim() ?? ''
  const isUrl = raw.length > 0 && isHttpUrl(raw)
  const isHtml = raw.length > 0 && isLikelyHtml(raw)
  const hasContent = raw.length > 0 && !isUrl

  const renderBody = () => {
    if (isLoading) {
      return (
        <p className='tdz-mono text-[11px] tracking-[0.08em] text-[var(--tdz-muted)] uppercase'>
          {t('mk.common.loading')}
        </p>
      )
    }

    if (isUrl) {
      return (
        <div className='space-y-3'>
          <p>{t('mk.legal.external')}</p>
          <a
            href={raw}
            target='_blank'
            rel='noreferrer noopener'
            className='inline-flex items-center gap-1.5 rounded-xl bg-[var(--tdz-ink)] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--tdz-ink-soft)]'
          >
            {t('mk.legal.open')}
            <ExternalLink className='h-3.5 w-3.5' />
          </a>
        </div>
      )
    }

    if (hasContent) {
      // 后台正文常自带一级标题，与弹窗标题重复，这里统一隐藏首个 h1
      return (
        <div className='[&_h1:first-child]:hidden'>
          <RichContent content={raw} mode={isHtml ? 'html' : 'markdown'} breaks />
        </div>
      )
    }

    return <p className='text-[var(--tdz-muted)]'>{t('mk.legal.empty')}</p>
  }

  return (
    <div
      className='fixed inset-0 z-[70] flex items-center justify-center bg-[var(--tdz-ink)]/45 px-4 py-8 backdrop-blur-sm'
      role='presentation'
      onClick={onClose}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='mk-legal-title'
        className='flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-[color:var(--tdz-ink)] bg-white shadow-[10px_10px_0px_0px_var(--tdz-shadow)]'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='flex shrink-0 items-center justify-between gap-3 border-b-2 border-dashed border-[color:var(--tdz-ink)]/20 bg-[var(--tdz-canvas)]/60 px-6 py-4'>
          <h3
            id='mk-legal-title'
            className='text-[16px] font-extrabold text-[var(--tdz-ink)]'
          >
            {kind === 'agreement'
              ? t('mk.legal.title.agreement')
              : t('mk.legal.title.privacy')}
          </h3>
          <button
            type='button'
            onClick={onClose}
            aria-label={t('mk.common.close')}
            className='rounded-lg border border-[color:var(--tdz-ink)]/15 p-1.5 text-[var(--tdz-body)] transition-colors hover:border-[color:var(--tdz-ink)] hover:text-[var(--tdz-ink)]'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='tdz-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5 text-[13.5px] leading-relaxed text-[var(--tdz-body)]'>
          {renderBody()}
        </div>
      </div>
    </div>
  )
}
