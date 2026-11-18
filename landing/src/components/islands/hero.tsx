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
import { Check, Copy, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SupportedLanguage } from '@/i18n'

import { PassportCard } from './passport-card'
import { ArrowPillButton, MonoTag } from '../static/primitives'
import { TICKER_MODELS } from '@/lib/data'
import { useCopyState } from '@/lib/use-clipboard'
import { I18nIsland } from './i18n-island'

function AvailableLinesDialog({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-[var(--tdz-ink)]/45 px-4 backdrop-blur-sm'
      role='presentation'
      onClick={onClose}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='tdz-lines-title'
        className='w-full max-w-lg overflow-hidden rounded-3xl border-2 border-[color:var(--tdz-ink)] bg-white shadow-[10px_10px_0px_0px_var(--tdz-shadow)]'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='flex items-start justify-between gap-3 border-b-2 border-dashed border-[color:var(--tdz-ink)]/20 bg-[var(--tdz-canvas)]/60 px-6 py-4'>
          <div>
            <h3
              id='tdz-lines-title'
              className='text-[16px] font-extrabold text-[var(--tdz-ink)]'
            >
              {t('mk.landing.hero.lines.title')}
            </h3>
            <p className='tdz-mono mt-1 text-[10px] tracking-[0.14em] text-[var(--tdz-muted)] uppercase'>
              Live routing table · {TICKER_MODELS.length} models
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label={t('mk.common.close')}
            className='rounded-lg border border-[color:var(--tdz-ink)]/15 p-1.5 text-[var(--tdz-body)] transition-colors hover:border-[color:var(--tdz-ink)] hover:text-[var(--tdz-ink)]'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='divide-y divide-[color:var(--tdz-line)]'>
          {TICKER_MODELS.map((model) => (
            <div
              key={model.id}
              className='flex items-center justify-between gap-3 px-6 py-3'
            >
              <div className='min-w-0'>
                <p className='tdz-mono truncate text-[12.5px] font-semibold text-[var(--tdz-ink)]'>
                  {model.displayName}
                </p>
                <p className='tdz-mono mt-0.5 truncate text-[10px] text-[var(--tdz-muted)]'>
                  {model.vendor} · {t(model.note)}
                </p>
              </div>
              <div className='flex shrink-0 items-center gap-2'>
                <MonoTag className='normal-case'>{model.latency}ms</MonoTag>
                <span className='flex items-center gap-1 text-[10.5px] font-semibold text-[var(--tdz-emerald-strong)]'>
                  <span className='h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
                  {model.uptime}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className='border-t border-[color:var(--tdz-line)] px-6 py-3'>
          <p className='tdz-mono text-[10px] leading-relaxed text-[var(--tdz-muted)]'>
            {t('mk.landing.hero.lines.note')}
          </p>
        </div>
      </div>
    </div>
  )
}

function HeroInner({
  brandName,
  baseUrl,
  signUpUrl,
  locale,
}: {
  brandName: string
  baseUrl: string
  /** 主站注册地址。静态站用真实链接，保证无 JS 也能跳转。 */
  signUpUrl: string
  locale: SupportedLanguage
}) {
  const { t } = useTranslation()
  const { copied, copy } = useCopyState()
  const [linesOpen, setLinesOpen] = useState(false)

  return (
    <section id='top' className='relative'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-12 pb-16 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:pt-16'>
        <div className='tdz-rise lg:col-span-7'>
          <span className='inline-flex items-center gap-2 rounded-full border border-[color:var(--tdz-ink)]/15 bg-white px-3 py-1 shadow-sm'>
            <span className='tdz-pulse h-2 w-2 rounded-full bg-[var(--tdz-emerald)]' />
            <span className='tdz-mono text-[10px] font-semibold tracking-[0.12em] text-[var(--tdz-ink)] uppercase'>
              OpenAI Compatible · /v1 Ready
            </span>
          </span>

          <h1 className='mt-6 text-[36px] leading-[1.2] font-extrabold tracking-tight text-[var(--tdz-ink)] lg:text-[52px] lg:leading-[1.15]'>
            {t('mk.landing.hero.titleLine1', { brand: brandName })}
            <br />
            <span className='text-[var(--tdz-emerald)]'>
              {t('mk.landing.hero.titleLine2')}
            </span>
          </h1>

          <p className='mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--tdz-body)] lg:text-[17px]'>
            {t('mk.landing.hero.lead')}
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <ArrowPillButton size='lg' href={signUpUrl}>
              {t('mk.landing.hero.primary')}
            </ArrowPillButton>
            <button
              type='button'
              onClick={() => setLinesOpen(true)}
              className='h-12 rounded-full border-2 border-[color:var(--tdz-ink)] bg-white px-6 text-[14px] font-bold text-[var(--tdz-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--tdz-shadow)]'
            >
              {t('mk.landing.hero.secondary')}
            </button>
          </div>

          <div className='mt-8 flex max-w-xl items-center justify-between gap-3 rounded-2xl border-2 border-[color:var(--tdz-ink)] bg-white p-2 pl-4 shadow-[6px_6px_0px_0px_var(--tdz-shadow)]'>
            <span className='tdz-mono shrink-0 text-[10px] font-bold tracking-[0.08em] text-[var(--tdz-body)] uppercase'>
              Base URL
            </span>
            <code className='tdz-mono min-w-0 flex-1 truncate rounded-xl bg-[var(--tdz-canvas)] px-3 py-2 text-[13px] text-[var(--tdz-ink)] select-all'>
              {baseUrl || t('mk.common.loading')}
            </code>
            <button
              type='button'
              onClick={() => copy(baseUrl)}
              disabled={!baseUrl}
              className='flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-[var(--tdz-emerald)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--tdz-emerald-strong)] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {copied ? (
                <>
                  <Check className='h-3.5 w-3.5' /> {t('mk.common.copied')}
                </>
              ) : (
                <>
                  <Copy className='h-3.5 w-3.5' /> {t('mk.common.copy')}
                </>
              )}
            </button>
          </div>
        </div>

        <div
          className='tdz-rise lg:col-span-5'
          style={{ animationDelay: '120ms' }}
        >
          <PassportCard brandName={brandName} />
        </div>
      </div>

      {linesOpen && (
        <AvailableLinesDialog onClose={() => setLinesOpen(false)} />
      )}
    </section>
  )
}

/** 对外导出的 island：先注入 i18n 上下文，再渲染真正的组件 */
export function Hero(
  props: Parameters<typeof HeroInner>[0] & {
    /** 当前语言的翻译对象，由 .astro 在构建期传入，不进入客户端 bundle */
    resources: Record<string, unknown>
  }
) {
  const { resources, ...rest } = props
  return (
    <I18nIsland locale={props.locale} resources={resources}>
      <HeroInner {...rest} />
    </I18nIsland>
  )
}