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
import { ArrowRight } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

export type MascotTone = 'purple' | 'ink' | 'orange' | 'yellow'

const MASCOT_TONES: Record<MascotTone, { body: string; eye: string }> = {
  purple: { body: 'var(--tdz-violet)', eye: 'var(--tdz-paper)' },
  ink: { body: 'var(--tdz-ink)', eye: 'var(--tdz-canvas)' },
  orange: { body: 'var(--tdz-orange)', eye: 'var(--tdz-ink)' },
  yellow: { body: 'var(--tdz-yellow)', eye: 'var(--tdz-ink)' },
}

type MascotProps = {
  tone: MascotTone
  size?: number
  className?: string
  bobbing?: boolean
  delay?: number
}

/**
 * 四色团子吉祥物：极简幽灵轮廓 + 像素眼。
 * 以内联 SVG 绘制，避免额外静态资源与首屏请求。
 */
export function Mascot({
  tone,
  size = 24,
  className,
  bobbing = false,
  delay = 0,
}: MascotProps) {
  const { body, eye } = MASCOT_TONES[tone]
  return (
    <span
      className={cn('inline-flex shrink-0', bobbing && 'tdz-bob', className)}
      style={bobbing ? { animationDelay: `${delay}ms` } : undefined}
      aria-hidden='true'
    >
      <svg
        width={size}
        height={size}
        viewBox='0 0 32 32'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M6 14.2a10 10 0 0 1 10-10 10 10 0 0 1 10 10v9.9c0 1.3-1.5 2-2.5 1.2l-2.2-1.5a1.6 1.6 0 0 0-1.9 0l-1.5 1.2a2.2 2.2 0 0 1-2.7 0l-1.5-1.2a1.6 1.6 0 0 0-1.9 0l-2.2 1.5c-1 .8-2.5.1-2.5-1.2v-9.9Z'
          fill={body}
        />
        <rect x='11' y='12' width='3' height='3.6' rx='1' fill={eye} />
        <rect x='18' y='12' width='3' height='3.6' rx='1' fill={eye} />
        <path
          d='M14.4 18.4c.9.9 2.3.9 3.2 0'
          stroke={eye}
          strokeWidth='1.4'
          strokeLinecap='round'
        />
      </svg>
    </span>
  )
}

export function MascotRow({
  size = 22,
  className,
  bobbing = false,
}: {
  size?: number
  className?: string
  bobbing?: boolean
}) {
  const tones: MascotTone[] = ['purple', 'ink', 'orange', 'yellow']
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {tones.map((tone, index) => (
        <Mascot
          key={tone}
          tone={tone}
          size={size}
          bobbing={bobbing}
          delay={index * 140}
        />
      ))}
    </span>
  )
}

export function BrandMark({
  name,
  compact = false,
}: {
  name?: string
  compact?: boolean
}) {
  const { t } = useTranslation()
  const label = name?.trim() || t('mk.common.brandFallback')

  return (
    <span className='flex items-center gap-2.5'>
      <MascotRow size={compact ? 20 : 24} bobbing />
      <span className='text-[17px] font-extrabold tracking-tight text-[var(--tdz-ink)]'>
        {label}
      </span>
    </span>
  )
}

/** 首屏左边缘四色锚点条：取 Logo 四只团子的配色，静止只露半截，悬停整条推开 */
export function EdgeRibbon({ className }: { className?: string }) {
  const tones: MascotTone[] = ['purple', 'ink', 'orange', 'yellow']
  return (
    <div
      className={cn(
        'group fixed top-32 left-0 z-40 hidden flex-col gap-2 pr-2.5 lg:flex',
        className
      )}
      aria-hidden='true'
    >
      {tones.map((tone, index) => (
        <span
          key={tone}
          className='h-9 w-3 -translate-x-1/2 rounded-r-[3px] transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:w-4'
          style={{
            backgroundColor: MASCOT_TONES[tone].body,
            transitionDelay: `${index * 40}ms`,
          }}
        />
      ))}
    </div>
  )
}

type ArrowPillButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'mint'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  badge?: boolean
  className?: string
} & ComponentPropsWithoutRef<'button'>

export function ArrowPillButton({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  badge = true,
  className,
  ...props
}: ArrowPillButtonProps) {
  const sizes = {
    sm: 'h-10 pl-4 pr-1.5 text-[13px]',
    md: 'h-11 pl-5 pr-1.5 text-sm',
    lg: 'h-12 pl-6 pr-2 text-[15px]',
  }
  const badgeSize = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
  }
  const variants = {
    primary: 'bg-[var(--tdz-ink)] text-white hover:bg-[var(--tdz-ink-soft)]',
    mint: 'bg-[var(--tdz-mint)] text-[var(--tdz-emerald-strong)] hover:bg-[var(--tdz-mint-line)] border-2 border-[color:var(--tdz-ink)]',
  }

  return (
    <button
      type='button'
      className={cn(
        'group inline-flex items-center justify-between gap-3 rounded-full font-bold transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--tdz-emerald)] focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-60',
        sizes[size],
        variants[variant],
        full ? 'w-full' : 'self-start',
        className
      )}
      {...props}
    >
      <span className={cn(badge ? '' : 'pr-3')}>{children}</span>
      {badge && (
        <span
          className={cn(
            'flex items-center justify-center rounded-full bg-[var(--tdz-yellow)] text-[var(--tdz-ink)] transition-transform duration-200 group-hover:translate-x-0.5',
            badgeSize[size]
          )}
        >
          <ArrowRight className='h-4 w-4' strokeWidth={2.6} />
        </span>
      )}
    </button>
  )
}

type StampProps = {
  title: string
  lines?: string[]
  color?: string
  size?: number
  animate?: boolean
  className?: string
}

/** 拟物防伪圆形印章：双圈 + 等宽字脚 */
export function Stamp({
  title,
  lines = [],
  color = 'var(--tdz-orange)',
  size = 96,
  animate = false,
  className,
}: StampProps) {
  return (
    <div
      className={cn(
        'flex select-none flex-col items-center justify-center rounded-full border-2 text-center backdrop-blur-[1px]',
        animate ? 'tdz-stamp-in' : '',
        className
      )}
      style={{
        width: size,
        height: size,
        borderColor: color,
        color,
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        transform: animate ? undefined : 'rotate(-12deg)',
      }}
      aria-hidden='true'
    >
      <div
        className='flex h-[84%] w-[84%] flex-col items-center justify-center gap-[1px] rounded-full border'
        style={{ borderColor: color, borderStyle: 'solid' }}
      >
        <span
          className='tdz-mono font-bold tracking-[0.06em] uppercase'
          style={{ fontSize: Math.max(9, size * 0.11) }}
        >
          {title}
        </span>
        {lines.map((line) => (
          <span
            key={line}
            className='tdz-mono font-semibold tracking-[0.04em] uppercase'
            style={{ fontSize: Math.max(8, size * 0.093) }}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  )
}

function hashSeed(seed: string): number {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function buildBars(seed: string, count: number): number[] {
  let state = hashSeed(seed) || 1
  const widths: number[] = []
  for (let index = 0; index < count; index += 1) {
    state = Math.imul(state ^ (state >>> 13), 1274126177)
    widths.push(1 + ((state >>> (index % 9)) & 3))
  }
  return widths
}

type BarcodeProps = {
  seed: string
  orientation?: 'horizontal' | 'vertical'
  thickness?: number
  length?: number
  bars?: number
  color?: string
  className?: string
}

/** 确定性条形码：由 seed 派生条宽，保证每次渲染一致 */
export function Barcode({
  seed,
  orientation = 'horizontal',
  thickness = 44,
  length = 160,
  bars = 44,
  color = 'var(--tdz-ink)',
  className,
}: BarcodeProps) {
  const { t } = useTranslation()
  const widths = buildBars(seed, bars)
  const rects: { position: number; size: number }[] = []
  let cursor = 0
  widths.forEach((width, index) => {
    if (index % 2 === 0) {
      rects.push({ position: cursor, size: width })
    }
    cursor += width
  })
  const total = cursor

  const renderRects = () =>
    rects.map((rect) => (
      <rect
        key={`${rect.position}-${rect.size}`}
        x={orientation === 'horizontal' ? rect.position : 0}
        y={orientation === 'horizontal' ? 0 : rect.position}
        width={orientation === 'horizontal' ? rect.size : 100}
        height={orientation === 'horizontal' ? 100 : rect.size}
        fill={color}
      />
    ))

  return (
    <svg
      role='img'
      aria-label={t('mk.common.barcode', { seed })}
      viewBox={
        orientation === 'horizontal' ? `0 0 ${total} 100` : `0 0 100 ${total}`
      }
      preserveAspectRatio='none'
      width={orientation === 'horizontal' ? length : thickness}
      height={orientation === 'horizontal' ? thickness : length}
      className={className}
      shapeRendering='crispEdges'
    >
      {renderRects()}
    </svg>
  )
}

export function MonoTag({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'emerald' | 'blue' | 'yellow' | 'orange'
  className?: string
}) {
  const tones = {
    neutral: 'bg-[var(--tdz-canvas)] text-[var(--tdz-body)] border-[color:var(--tdz-line)]',
    emerald: 'bg-[var(--tdz-mint)] text-[var(--tdz-emerald-strong)] border-[color:var(--tdz-shadow)]',
    blue: 'bg-[var(--tdz-blue-soft)] text-[var(--tdz-blue-ink)] border-[color:var(--tdz-blue-line)]',
    yellow: 'bg-[var(--tdz-amber-soft)] text-[var(--tdz-amber-ink)] border-[color:var(--tdz-yellow)]/60',
    orange: 'bg-[var(--tdz-orange-soft)] text-[var(--tdz-orange-ink)] border-[color:var(--tdz-orange-line)]',
  }
  return (
    <span
      className={cn(
        'tdz-mono rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
