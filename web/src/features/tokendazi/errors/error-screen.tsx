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
import { useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Home, RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useSystemConfigStore } from '@/stores/system-config-store'
import { cn } from '@/lib/utils'

import {
  Barcode,
  BrandMark,
  EdgeRibbon,
  MonoTag,
  Stamp,
} from '../components/primitives'

import '../styles/tokendazi.css'

type ErrorShellProps = {
  /** 大号等宽数字/代号，替代原来的 7rem 纯文本标题 */
  code: string
  /** 顶部小标签，例如 NOT FOUND / SERVER ERROR */
  kicker: string
  /** 主标题，必须能被测试以 heading 角色选中 */
  title: string
  description: ReactNode
  /** 印章上的两行小字，缺省不渲染印章 */
  stamp?: { title: string; lines: string[]; color?: string }
  /** 条形码种子，保证同一种错误每次编码一致 */
  barcodeSeed: string
  actions: ReactNode
  /** 页面底部的补充说明，通常放反馈入口 */
  footnote?: ReactNode
  className?: string
}

/**
 * 错误页外壳：沿用首页的 Lite Neo-Brutalism 版式（粗边、硬阴影、等宽标签），
 * 让 404 / 500 与落地页保持同一套视觉语言。
 */
export function ErrorScreen({
  code,
  kicker,
  title,
  description,
  stamp,
  barcodeSeed,
  actions,
  footnote,
  className,
}: ErrorShellProps) {
  const { t } = useTranslation()
  // 错误页可能作为根级 errorComponent 渲染，此时不应依赖 QueryClient，
  // 否则一次渲染失败会连带触发二次异常；直接从本地 store 取品牌名即可。
  const systemName = useSystemConfigStore((state) => state.config.systemName)
  const brandName = systemName?.trim() || t('mk.common.brandFallback')

  return (
    <div
      className={cn(
        'tdz-root relative flex min-h-svh flex-col overflow-hidden bg-[var(--tdz-canvas)]',
        className
      )}
    >
      <EdgeRibbon />

      <header className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 pt-6'>
        <BrandMark name={brandName} compact />
        <span className='tdz-mono hidden items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-[var(--tdz-muted)] uppercase sm:flex'>
          <span className='tdz-pulse h-1.5 w-1.5 rounded-full bg-[var(--tdz-orange)]' />
          {kicker}
        </span>
      </header>

      <main className='mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-12'>
        <div className='relative w-full'>
          <span className='tdz-notch top-[-11px] left-[calc(16.6667%_-_11px)] z-20 hidden lg:block' />
          <span className='tdz-notch bottom-[-11px] left-[calc(16.6667%_-_11px)] z-20 hidden lg:block' />

          <div className='grid grid-cols-1 overflow-hidden rounded-3xl border-2 border-[color:var(--tdz-ink)] bg-white shadow-[12px_12px_0px_0px_var(--tdz-shadow)] lg:grid-cols-12'>
            <div className='relative flex flex-col justify-between gap-8 border-b-2 border-dashed border-[color:var(--tdz-ink)]/20 bg-[var(--tdz-canvas)]/70 p-8 lg:col-span-5 lg:border-r-2 lg:border-b-0 lg:p-10'>
              <div>
                <MonoTag tone='orange'>{kicker}</MonoTag>
                <h2 className='tdz-mono mt-5 text-[clamp(3.4rem,9vw,5.4rem)] leading-none font-extrabold tracking-tighter text-[var(--tdz-ink)]'>
                  {code}
                </h2>
                <div className='mt-4 flex items-center gap-3'>
                  <Barcode seed={barcodeSeed} thickness={30} length={150} />
                  <span className='tdz-mono text-[9px] leading-tight tracking-[0.14em] text-[var(--tdz-muted)] uppercase'>
                    err
                    <br />
                    ref
                  </span>
                </div>
              </div>

              {stamp && (
                <div className='flex justify-start lg:justify-end'>
                  <Stamp
                    title={stamp.title}
                    lines={stamp.lines}
                    color={stamp.color}
                    size={104}
                    animate
                  />
                </div>
              )}
            </div>

            <div className='flex flex-col justify-center p-8 lg:col-span-7 lg:p-12'>
              <h1 className='text-[26px] leading-tight font-extrabold tracking-tight text-[var(--tdz-ink)] lg:text-[32px]'>
                {title}
              </h1>
              <div className='mt-3 max-w-lg text-[14px] leading-relaxed text-[var(--tdz-body)]'>
                {description}
              </div>

              <div className='mt-7 flex flex-wrap items-center gap-3'>
                {actions}
              </div>

              {footnote && (
                <div className='mt-6 max-w-lg text-[12px] leading-relaxed text-[var(--tdz-muted)]'>
                  {footnote}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

/** 与首页 ArrowPillButton 同款的描边按钮，用于错误页的次要操作 */
export function GhostAction({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-full border-2 border-[color:var(--tdz-ink)] bg-white px-5 text-[13.5px] font-bold text-[var(--tdz-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--tdz-shadow)] active:translate-y-0',
        className
      )}
    >
      {children}
    </button>
  )
}

/** 主操作：实心黑底 + 黄色箭头，与首页 CTA 一致 */
export function SolidAction({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-full bg-[var(--tdz-ink)] px-5 text-[13.5px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--tdz-ink-soft)] active:translate-y-0',
        className
      )}
    >
      {children}
    </button>
  )
}

export function BackHomeButton() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <SolidAction onClick={() => void navigate({ to: '/' })}>
      <Home className='h-3.5 w-3.5' />
      {t('Back to Home')}
    </SolidAction>
  )
}

export function GoBackButton() {
  const { t } = useTranslation()
  const { history } = useRouter()

  return (
    <GhostAction onClick={() => history.go(-1)}>
      <ArrowLeft className='h-3.5 w-3.5' />
      {t('Go Back')}
    </GhostAction>
  )
}

export function RetryButton({ onClick }: { onClick?: () => void }) {
  const { t } = useTranslation()

  return (
    <GhostAction onClick={onClick}>
      <RotateCw className='h-3.5 w-3.5' />
      {t('Retry')}
    </GhostAction>
  )
}