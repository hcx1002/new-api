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
import { useTranslation } from 'react-i18next'

import { BENTO_CARDS, TICKER_MODELS } from '@/lib/data'
import { MonoTag } from './primitives'

function ModelTicker() {
  const { t } = useTranslation()

  return (
    <div className='mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[color:var(--tdz-line)] bg-white px-5 py-3'>
      <p className='tdz-mono flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] text-[var(--tdz-body)] uppercase'>
        <span className='tdz-pulse h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
        {t('mk.landing.bento.ticker')}
      </p>
      <div className='flex flex-wrap items-center gap-2'>
        {TICKER_MODELS.map((model) => (
          <div key={model.id} className='group relative'>
            <span className='tdz-mono flex cursor-default items-center gap-1.5 rounded-full border border-[color:var(--tdz-line)] bg-[var(--tdz-canvas)] px-2.5 py-1 text-[10.5px] font-semibold text-[var(--tdz-ink)] transition-colors group-hover:border-[color:var(--tdz-emerald)]/50 group-hover:bg-[var(--tdz-mint)]'>
              <span className='h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
              {model.displayName}
              <span className='text-[var(--tdz-muted)]'>{model.latency}ms</span>
            </span>
            <div className='pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-44 -translate-x-1/2 translate-y-1 rounded-xl border-2 border-[color:var(--tdz-ink)] bg-white p-2.5 opacity-0 shadow-[4px_4px_0_0_var(--tdz-shadow)] transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100'>
              <p className='tdz-mono text-[10px] font-bold text-[var(--tdz-ink)]'>
                {model.displayName}
              </p>
              <p className='tdz-mono mt-1 text-[9.5px] text-[var(--tdz-body)]'>
                {model.vendor} · {t(model.note)}
              </p>
              <p className='tdz-mono mt-0.5 text-[9.5px] text-[var(--tdz-emerald-strong)]'>
                {t('mk.landing.bento.uptime', { value: model.uptime })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BentoSection() {
  const { t } = useTranslation()

  return (
    <section
      id='models'
      className='mx-auto max-w-7xl scroll-mt-24 px-6 py-12 lg:px-12'
    >
      <div className='mb-8 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='tdz-mono text-[11px] font-bold tracking-[0.18em] text-[var(--tdz-muted)] uppercase'>
            Why This Gateway
          </p>
          <h2 className='mt-2 text-[28px] leading-tight font-extrabold tracking-tight text-[var(--tdz-ink)] lg:text-4xl'>
            {t('mk.landing.bento.heading')}
          </h2>
        </div>
        <p className='w-max text-sm leading-relaxed text-[var(--tdz-body)]'>
          {t('mk.landing.bento.lead')}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {BENTO_CARDS.map((card) => (
          <article
            key={card.tag}
            className='group relative flex flex-col rounded-2xl border-2 border-[color:var(--tdz-ink)] bg-white p-6 shadow-[6px_6px_0px_0px_var(--tdz-shadow)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--tdz-shadow-deep)]'
          >
            <div className='flex items-start justify-between gap-2'>
              <span className='flex items-center gap-2 text-[13px] font-bold text-[var(--tdz-body)]'>
                <span
                  className='h-2 w-2 shrink-0 rounded-[3px]'
                  style={{ backgroundColor: card.accent }}
                  aria-hidden='true'
                />
                {t(card.kicker)}
              </span>
              <MonoTag>{card.tag}</MonoTag>
            </div>
            <h3 className='mt-5 text-[20px] leading-[1.35] font-bold tracking-tight text-[var(--tdz-ink)]'>
              {t(card.title)}
            </h3>
            <p className='mt-2 text-[13px] leading-relaxed text-[var(--tdz-body)]'>
              {t(card.description)}
            </p>
          </article>
        ))}
      </div>

      <ModelTicker />
    </section>
  )
}
