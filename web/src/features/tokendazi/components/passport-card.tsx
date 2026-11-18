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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { PASSPORT_MODELS, type ModelSpec } from '../lib/data'
import { Barcode, Mascot, MonoTag, Stamp, type MascotTone } from './primitives'

type NodeTone = 'ink' | 'emerald' | 'blue'

const DOT_COLORS: Record<NodeTone, string> = {
  ink: 'var(--tdz-ink)',
  emerald: 'var(--tdz-emerald)',
  blue: 'var(--tdz-blue)',
}

function RouteNode({
  tone,
  title,
  subtitle,
  tag,
  tagTone,
  pulse = false,
  animateKey,
}: {
  tone: NodeTone
  title: string
  subtitle: string
  tag: string
  tagTone: 'neutral' | 'emerald' | 'blue'
  pulse?: boolean
  animateKey?: string
}) {
  return (
    <div className='flex items-start gap-3 rounded-xl border border-[color:var(--tdz-ink)]/12 bg-white px-3 py-2.5 shadow-[0_1px_0_0_rgba(17,19,22,0.04)]'>
      <span
        className={cn(
          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
          pulse && 'tdz-pulse'
        )}
        style={{ backgroundColor: DOT_COLORS[tone] }}
      />
      <div className='min-w-0 flex-1'>
        <p
          key={animateKey}
          className={cn(
            'truncate text-[13px] leading-tight font-bold text-[var(--tdz-ink)]',
            animateKey && 'tdz-swap'
          )}
        >
          {title}
        </p>
        <p className='mt-0.5 truncate text-[10.5px] leading-snug text-[var(--tdz-body)]'>
          {subtitle}
        </p>
      </div>
      <MonoTag tone={tagTone} className='mt-0.5 shrink-0'>
        {tag}
      </MonoTag>
    </div>
  )
}

/** 首屏右侧「大模型通行证」：点击模型 Pill 实时切换第三跳节点与延迟 */
export function PassportCard({ brandName }: { brandName?: string }) {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState(PASSPORT_MODELS[0].id)
  const brand = brandName?.trim() || t('mk.common.brandFallback')
  const active =
    PASSPORT_MODELS.find((model) => model.id === activeId) ?? PASSPORT_MODELS[0]

  return (
    <div className='relative w-full'>
      <div className='overflow-hidden rounded-3xl border-2 border-[color:var(--tdz-ink)] bg-white shadow-[10px_10px_0px_0px_var(--tdz-shadow)]'>
        {/* 通行证抬头 */}
        <div className='flex items-center justify-between gap-3 border-b-2 border-dashed border-[color:var(--tdz-ink)]/20 bg-[var(--tdz-canvas)]/60 px-5 py-4'>
          <div className='min-w-0'>
            <p className='text-[15px] font-extrabold tracking-tight text-[var(--tdz-ink)]'>
              {t('mk.card.heading')}
            </p>
            <p className='tdz-mono mt-0.5 truncate text-[10px] tracking-[0.16em] text-[var(--tdz-muted)] uppercase'>
              Model Passport · /v1 Access
            </p>
          </div>
          <span className='flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--tdz-mint)] px-3 py-1 text-[11px] font-semibold text-[var(--tdz-emerald-strong)]'>
            <span className='tdz-pulse h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
            {t('mk.card.lineStatus', { value: active.uptime })}
          </span>
        </div>

        <div className='flex flex-col sm:flex-row'>
          {/* 主券 */}
          <div className='tdz-notebook relative min-w-0 flex-1 border-b-2 border-dashed border-[color:var(--tdz-ink)]/20 p-5 pb-6 sm:border-r-2 sm:border-b-0'>
            <div className='flex items-center justify-between gap-2'>
              <p className='text-[11px] font-bold tracking-wide text-[var(--tdz-body)]'>
                {t('mk.card.routeTitle')}
              </p>
              <span className='tdz-mono text-[9px] tracking-[0.08em] text-[var(--tdz-muted)] uppercase'>
                {t('mk.card.modelsReady', { count: PASSPORT_MODELS.length })}
              </span>
            </div>

            <div className='mt-2 grid grid-cols-4 gap-1 rounded-xl bg-[var(--tdz-canvas)] p-1'>
              {PASSPORT_MODELS.map((model) => (
                <ModelPill
                  key={model.id}
                  model={model}
                  active={model.id === activeId}
                  onSelect={() => setActiveId(model.id)}
                />
              ))}
            </div>

            <div className='mt-3 flex flex-col'>
              <RouteNode
                tone='ink'
                title={t('mk.card.client.title')}
                subtitle={t('mk.card.client.subtitle')}
                tag='client'
                tagTone='neutral'
              />
              <span className='ml-4 h-3 w-0 border-l-2 border-dashed border-[color:var(--tdz-ink)]/25' />
              <RouteNode
                tone='emerald'
                title={t('mk.card.gateway.title', { brand })}
                subtitle={t('mk.card.gateway.subtitle')}
                tag='/v1'
                tagTone='emerald'
                pulse
              />
              <span className='ml-4 h-3 w-0 border-l-2 border-dashed border-[color:var(--tdz-ink)]/25' />
              <RouteNode
                tone='blue'
                title={active.displayName}
                subtitle={t('mk.card.model.subtitle', {
                  latency: active.latency,
                  note: t(active.note),
                })}
                tag='ready'
                tagTone='blue'
                animateKey={`${active.id}-node`}
              />
            </div>

            <div className='mt-2 flex items-end justify-between gap-2'>
              <p
                key={`${active.id}-meta`}
                className='tdz-swap tdz-mono pb-1 text-[10px] tracking-[0.08em] text-[var(--tdz-muted)] uppercase'
              >
                {t('mk.card.uptime', { value: active.uptime })}
              </p>{' '}
              <Stamp
                title='OPENAI'
                lines={['COMPATIBLE', '★ VERIFIED ★']}
                color='var(--tdz-orange)'
                size={86}
                className='-mr-1 -mb-1 shrink-0'
              />
            </div>
          </div>

          {/* 副券 */}
          <div className='flex w-full shrink-0 flex-col items-center justify-between gap-3 bg-[var(--tdz-canvas)]/50 p-4 sm:w-[28%]'>
            <div className='flex w-full items-center justify-center gap-1 rounded-xl border border-[color:var(--tdz-ink)]/12 bg-white py-2.5'>
              {(
                [
                  ['purple', 0],
                  ['ink', 140],
                  ['orange', 280],
                  ['yellow', 420],
                ] as [MascotTone, number][]
              ).map(([tone, delay]) => (
                <Mascot
                  key={tone}
                  tone={tone}
                  size={20}
                  bobbing
                  delay={delay}
                />
              ))}
            </div>

            <div className='flex flex-1 flex-col items-center justify-center gap-2'>
              <Barcode
                seed='MODEL-PASS-2026'
                orientation='vertical'
                thickness={38}
                length={78}
              />
              <p className='tdz-mono text-[9px] tracking-[0.1em] text-[var(--tdz-body)]'>
                PASS-2026-V1
              </p>
            </div>

            <p className='tdz-mono text-center text-[9px] leading-relaxed tracking-[0.12em] text-[var(--tdz-muted)] uppercase'>
              Admit one
              <br />
              No. 0001
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModelPill({
  model,
  active,
  onSelect,
}: {
  model: ModelSpec
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type='button'
      onClick={onSelect}
      aria-pressed={active}
      title={`${model.displayName} · ${model.latency}ms`}
      className={cn(
        'tdz-mono truncate rounded-lg px-1 py-1.5 text-[9.5px] font-bold transition-all duration-150',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--tdz-emerald)] focus-visible:ring-offset-1 focus-visible:outline-none',
        active
          ? 'bg-[var(--tdz-ink)] text-white'
          : 'text-[var(--tdz-body)] hover:bg-white hover:text-[var(--tdz-ink)]'
      )}
    >
      {model.pill}
    </button>
  )
}
