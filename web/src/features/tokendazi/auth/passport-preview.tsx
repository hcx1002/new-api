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
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { Barcode, MascotRow, Stamp } from '../components/primitives'
import { StrengthMeter } from '../components/strength-meter'
import { getPasswordStrength } from '../lib/password-strength'

const BENEFIT_KEYS = [
  'mk.preview.benefit.models',
  'mk.preview.benefit.privacy',
  'mk.preview.benefit.billing',
  'mk.preview.benefit.clients',
]

type PassportPreviewProps = {
  mode: 'login' | 'register'
  email: string
  password: string
  inviteCode: string
  success: boolean
}

function resolveStamp(
  success: boolean,
  isRegister: boolean,
  t: (key: string) => string
) {
  if (success) {
    return {
      title: 'APPROVED',
      lines: [t('mk.preview.stamp.issued')],
      color: 'var(--tdz-orange)',
    }
  }
  if (isRegister) {
    return {
      title: 'NEW PASS',
      lines: [t('mk.preview.stamp.pending')],
      color: 'var(--tdz-orange)',
    }
  }
  return { title: 'READY TO', lines: ['CONNECT'], color: 'var(--tdz-blue)' }
}

export function PassportPreview({
  mode,
  email,
  password,
  inviteCode,
  success,
}: PassportPreviewProps) {
  const { t } = useTranslation()
  const isRegister = mode === 'register'
  const strength = getPasswordStrength(password)
  const year = new Date().getFullYear()
  const stamp = resolveStamp(success, isRegister, t)

  return (
    <div className='relative flex flex-col justify-between gap-8 border-b-2 border-dashed border-[color:var(--tdz-ink)]/25 bg-[var(--tdz-canvas)] p-8 lg:col-span-5 lg:border-r-2 lg:border-b-0 lg:p-10'>
      <div>
        <span
          className={cn(
            'tdz-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-bold tracking-[0.1em] uppercase',
            isRegister
              ? 'border-[color:var(--tdz-shadow)] bg-[var(--tdz-mint)] text-[var(--tdz-emerald-strong)]'
              : 'border-[color:var(--tdz-ink)]/15 bg-white text-[var(--tdz-body)]'
          )}
        >
          {isRegister
            ? t('mk.preview.badge.register')
            : t('mk.preview.badge.login')}
        </span>

        <h2 className='mt-4 text-[24px] leading-[1.25] font-extrabold tracking-tight text-[var(--tdz-ink)] lg:text-[28px]'>
          {isRegister ? (
            <>
              {t('mk.preview.register.line1')}
              <br />
              {t('mk.preview.register.line2')}{' '}
              <span className='text-[var(--tdz-emerald)]'>
                {t('mk.preview.register.accent')}
              </span>{t('mk.preview.register.tail')}
            </>
          ) : (
            <>
              {t('mk.preview.login.line1')}
              <br />
              {t('mk.preview.login.line2')}
              <span className='text-[var(--tdz-emerald)]'>
                {t('mk.preview.login.accent')}
              </span>{t('mk.preview.login.tail')}
            </>
          )}
        </h2>

        {/* 实时联动通行证 */}
        <div className='tdz-notebook relative mt-6 rounded-2xl border-2 border-[color:var(--tdz-ink)] bg-white p-4 shadow-[4px_4px_0px_0px_var(--tdz-ink)]'>
          <div className='flex items-center justify-between gap-2'>
            <span className='flex items-center gap-1.5'>
              <MascotRow size={13} />
              <span className='tdz-mono text-[9px] font-bold tracking-[0.08em] text-[var(--tdz-ink)]'>
                MODEL PASSPORT
              </span>
            </span>
            <span className='tdz-mono text-[8px] font-bold tracking-[0.06em] text-[var(--tdz-muted)]'>
              TIER: PRO READY
            </span>
          </div>

          <div className='mt-4'>
            <p className='tdz-mono text-[8.5px] font-bold tracking-[0.12em] text-[var(--tdz-muted)] uppercase'>
              Holder
            </p>
            <p className='mt-0.5 truncate border-b border-dashed border-[color:var(--tdz-ink)]/25 pb-1 text-[13px] font-bold text-[var(--tdz-ink)]'>
              {email.trim() || 'waiting_for_you@vibe.dev'}
            </p>
          </div>

          <div className='mt-3 flex items-center justify-between gap-2'>
            <div className='min-w-0'>
              <p className='tdz-mono text-[8.5px] font-bold tracking-[0.12em] text-[var(--tdz-muted)] uppercase'>
                API Key
              </p>
              <p className='tdz-mono mt-0.5 truncate text-[10.5px] font-semibold text-[var(--tdz-ink)]'>
                sk-••••••••••••••••8f9a
              </p>
            </div>
            <span className='tdz-mono shrink-0 rounded-md bg-[var(--tdz-mint)] px-1.5 py-0.5 text-[8.5px] font-bold text-[var(--tdz-emerald-strong)]'>
              ACTIVE
            </span>
          </div>

          <div className='mt-3'>
            {isRegister || password ? (
              <StrengthMeter level={strength} />
            ) : (
              <p className='tdz-mono text-[9px] tracking-[0.04em] text-[var(--tdz-muted)]'>
                {t('mk.preview.tls')}
              </p>
            )}
          </div>

          {inviteCode.trim() && (
            <p className='tdz-mono mt-2 inline-flex items-center gap-1 rounded-md border border-[color:var(--tdz-shadow)] bg-[var(--tdz-mint)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--tdz-emerald-strong)]'>
              {t('mk.preview.inviteBonus')}
            </p>
          )}

          <div className='mt-4 flex items-end justify-between gap-3'>
            <div>
              <Barcode
                seed={`TDZ-${email || 'PASS'}`}
                length={96}
                thickness={30}
              />
              <p className='tdz-mono mt-1 text-[8px] tracking-[0.08em] text-[var(--tdz-body)]'>
                ISSUED: {year} / V1-GATEWAY
              </p>
            </div>
            <Stamp
              key={`${mode}-${success ? 'done' : 'idle'}`}
              title={stamp.title}
              lines={stamp.lines}
              color={stamp.color}
              size={76}
              animate={isRegister || success}
              className='shrink-0'
            />
          </div>
        </div>
      </div>

      <ul className='space-y-2.5'>
        {BENEFIT_KEYS.map((benefit) => (
          <li
            key={benefit}
            className='flex items-start gap-2 text-[12px] leading-relaxed text-[var(--tdz-body)]'
          >
            <span className='mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--tdz-mint)]'>
              <Check className='h-2.5 w-2.5 text-[var(--tdz-emerald)]' strokeWidth={3.5} />
            </span>
            {t(benefit)}
          </li>
        ))}
      </ul>
    </div>
  )
}
