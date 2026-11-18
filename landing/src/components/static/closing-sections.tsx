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

import { STEPS } from '@/lib/data'
import { ArrowPillButton, MascotRow } from './primitives'

export function DarkSteps(props: { brandName: string }) {
  const { t } = useTranslation()

  return (
    <section className='bg-gradient-to-b from-[var(--tdz-deep)] to-[var(--tdz-ink)] px-6 py-20 text-white lg:px-12'>
      <div className='mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end'>
        <div>
          <p className='tdz-mono mb-3 text-[11px] font-bold tracking-[0.2em] text-[var(--tdz-yellow)] uppercase'>
            Model Passport for Vibe Coding
          </p>
          <h2 className='text-[32px] leading-tight font-extrabold tracking-tight lg:text-4xl'>
            {t('mk.landing.steps.heading')}
          </h2>
          <p className='mt-3 text-[15px] text-white/60'>
            {t('mk.landing.steps.lead')}
          </p>
        </div>
        <p className='max-w-max text-[15px] leading-relaxed text-slate-400'>
          {t('mk.landing.steps.side', { brand: props.brandName })}
        </p>
      </div>

      <div className='mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3'>
        {STEPS.map((step) => (
          <article
            key={step.index}
            className='group relative rounded-2xl border border-white/10 bg-[var(--tdz-surface-dark)] p-7 transition-colors duration-200 hover:border-[color:var(--tdz-yellow)]/50'
          >
            <span className='tdz-mono mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--tdz-yellow)] text-sm font-bold text-[var(--tdz-ink)]'>
              {step.index}
            </span>
            <h3 className='text-[18px] font-bold tracking-tight text-white'>
              {t(step.title)}
            </h3>
            <p className='mt-2 text-[13.5px] leading-relaxed text-slate-400'>
              {t(step.description)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function CtaBanner(props: { signUpUrl: string }) {
  const { t } = useTranslation()

  return (
    <section className='mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-12'>
      <div className='flex flex-col items-start justify-between gap-8 rounded-3xl border-2 border-[color:var(--tdz-ink)] bg-white p-8 shadow-[8px_8px_0px_0px_var(--tdz-shadow)] lg:flex-row lg:items-center lg:p-12'>
        <div>
          <h2 className='text-2xl font-extrabold tracking-tight text-[var(--tdz-ink)] lg:text-3xl'>
            {t('mk.landing.cta.heading')}
          </h2>
          <p className='mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--tdz-body)]'>
            {t('mk.landing.cta.desc')}
          </p>
        </div>
        {/* 静态站：用真实链接而非 onClick，保证无 JS 也能跳转 */}
        <ArrowPillButton size='lg' href={props.signUpUrl} className='shrink-0'>
          {t('mk.landing.cta.button')}
        </ArrowPillButton>
      </div>
    </section>
  )
}

export function SiteFooter(props: { brandName: string; host: string }) {
  const { t } = useTranslation()

  return (
    <footer className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[color:var(--tdz-line)] px-6 py-8 text-sm text-[var(--tdz-body)] sm:flex-row lg:px-12'>
      <div className='flex flex-wrap items-center gap-2'>
        <MascotRow size={18} />
        <span>
          {props.brandName} · {t('mk.landing.footer.tagline')}
        </span>
      </div>
      <div className='tdz-mono flex items-center gap-3 text-[11px] tracking-[0.06em]'>
        <span className='text-[var(--tdz-muted)]'>{props.host}</span>
        <span
          className='flex items-center gap-1.5'
          title='All Systems Operational'
        >
          <span className='h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
          <span className='text-[var(--tdz-emerald-strong)]'>All Systems Operational</span>
        </span>
      </div>
    </footer>
  )
}
