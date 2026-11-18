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
import { Check, Copy, Play } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { SupportedLanguage } from '@/i18n'

import { cn } from '@/lib/utils'

import {
  SIMULATED_RESPONSE_KEY,
  createCodeSamples,
  type CodeSample,
  type LanguageId,
} from '@/lib/data'
import { useCopyState } from '@/lib/use-clipboard'
import { ArrowPillButton, MonoTag } from '../static/primitives'
import { I18nIsland } from './i18n-island'

const KEYWORDS: Record<LanguageId, string[]> = {
  python: [
    'from',
    'import',
    'for',
    'in',
    'if',
    'else',
    'elif',
    'def',
    'return',
    'with',
    'as',
    'True',
    'False',
    'None',
    'print',
    'and',
    'or',
    'not',
  ],
  curl: ['curl', 'true', 'false'],
  ts: [
    'import',
    'from',
    'const',
    'let',
    'await',
    'async',
    'for',
    'of',
    'if',
    'else',
    'return',
    'new',
    'export',
    'default',
    'true',
    'false',
    'null',
  ],
  go: [
    'package',
    'import',
    'func',
    'var',
    'const',
    'type',
    'struct',
    'return',
    'if',
    'else',
    'for',
    'range',
    'defer',
    'go',
    'nil',
    'true',
    'false',
    'panic',
    'break',
  ],
  rust: [
    'use',
    'fn',
    'let',
    'mut',
    'async',
    'await',
    'impl',
    'struct',
    'pub',
    'return',
    'if',
    'else',
    'while',
    'for',
    'in',
    'match',
    'Some',
    'None',
    'Ok',
    'true',
    'false',
  ],
}

const TOKEN_PATTERN = new RegExp(
  [
    '("(?:[^"\\\\]|\\\\.)*(?:"|$))',
    "('(?:[^'\\\\]|\\\\.)*(?:'|$))",
    '(`(?:[^`\\\\]|\\\\.)*(?:`|$))',
    '(#[^\\n]*)',
    '(//[^\\n]*)',
    '(\\b\\d+(?:\\.\\d+)?\\b)',
    '(\\b[A-Za-z_][A-Za-z0-9_]*\\b)',
  ].join('|'),
  'g'
)

function tokenizeLine(line: string, language: LanguageId): ReactNode[] {
  const keywords = new Set(KEYWORDS[language])
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0

  TOKEN_PATTERN.lastIndex = 0
  let match = TOKEN_PATTERN.exec(line)
  while (match) {
    const [raw] = match
    const index = match.index
    if (index > lastIndex) {
      nodes.push(line.slice(lastIndex, index))
    }

    if (match[1] || match[2] || match[3]) {
      nodes.push(
        <span key={key++} className='text-[var(--tdz-mint-bright)]'>
          {raw}
        </span>
      )
    } else if (match[4] || match[5]) {
      const isGuide = raw.includes('👈')
      nodes.push(
        <span
          key={key++}
          className={isGuide ? 'text-[var(--tdz-yellow)]' : 'text-[var(--tdz-slate)] italic'}
        >
          {raw}
        </span>
      )
    } else if (match[6]) {
      nodes.push(
        <span key={key++} className='text-[var(--tdz-amber-mid)]'>
          {raw}
        </span>
      )
    } else if (keywords.has(raw)) {
      nodes.push(
        <span key={key++} className='text-[var(--tdz-blue-mid)]'>
          {raw}
        </span>
      )
    } else {
      nodes.push(<span key={key++}>{raw}</span>)
    }

    lastIndex = index + raw.length
    match = TOKEN_PATTERN.exec(line)
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex))
  }
  return nodes
}

function CodeLines({
  sample,
  baseUrl,
}: {
  sample: CodeSample
  baseUrl: string
}) {
  const lines = sample.code.split('\n').map((text, index) => ({
    id: `${sample.id}-${index}-${text.length}`,
    text,
  }))

  return (
    <div className='min-h-[340px]'>
      {lines.map((line, index) => {
        const isEndpoint = Boolean(baseUrl) && line.text.includes(baseUrl)
        const isComment = /^\s*(#|\/\/)/.test(line.text)
        return (
          <div
            key={line.id}
            className={cn(
              'flex px-6',
              isEndpoint &&
                'border-l-2 border-emerald-400 bg-emerald-500/15 py-0.5',
              isComment && !isEndpoint && 'text-[var(--tdz-muted-alt)]'
            )}
          >
            <span className='w-6 shrink-0 py-0.5 text-right text-[11px] text-white/25 select-none'>
              {index + 1}
            </span>
            <code className='overflow-visible pl-4 whitespace-pre'>
              {tokenizeLine(line.text, sample.id)}
            </code>
          </div>
        )
      })}
    </div>
  )
}

function CodeShowcaseInner({
  brandName,
  baseUrl,
  signUpUrl,
}: {
  brandName: string
  baseUrl: string
  /** 主站注册地址，用真实链接保证无 JS 可跳转 */
  signUpUrl: string
  locale: SupportedLanguage
}) {
  const { t } = useTranslation()
  const [language, setLanguage] = useState<LanguageId>('python')
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState('')
  const runTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { copied, copy } = useCopyState()

  const samples = useMemo(() => createCodeSamples(baseUrl, t), [baseUrl, t])
  const sample = samples.find((item) => item.id === language) ?? samples[0]
  const simulated = t(SIMULATED_RESPONSE_KEY)

  useEffect(
    () => () => {
      if (runTimer.current) clearInterval(runTimer.current)
    },
    []
  )

  useEffect(() => {
    if (!running) return
    let cursor = 0
    setOutput('')
    runTimer.current = setInterval(() => {
      cursor += 2
      setOutput(simulated.slice(0, cursor))
      if (cursor >= simulated.length) {
        if (runTimer.current) clearInterval(runTimer.current)
        runTimer.current = null
        setRunning(false)
      }
    }, 16)

    return () => {
      if (runTimer.current) {
        clearInterval(runTimer.current)
        runTimer.current = null
      }
    }
  }, [running, simulated])

  return (
    <section
      id='quick-start'
      className='scroll-mt-24 border-y border-[color:var(--tdz-line)] bg-white py-20'
    >
      <div className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:px-12'>
        <div className='lg:col-span-5'>
          <span className='inline-flex items-center gap-2 rounded-full bg-[var(--tdz-mint)] px-3 py-1 text-[11px] font-semibold text-[var(--tdz-emerald-strong)]'>
            <span className='h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
            {t('mk.landing.code.kicker')}
          </span>
          <h2 className='mt-5 text-[30px] leading-[1.2] font-extrabold tracking-tight text-[var(--tdz-ink)] lg:text-4xl'>
            {t('mk.landing.code.titleLine1')}
            <br />
            <span className='text-[var(--tdz-emerald)]'>
              {t('mk.landing.code.titleLine2', { brand: brandName })}
            </span>
          </h2>
          <p className='mt-4 max-w-md text-[15px] leading-relaxed text-[var(--tdz-body)]'>
            {t('mk.landing.code.lead')}
          </p>

          <div className='mt-8 flex flex-wrap gap-2'>
            {samples.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => setLanguage(item.id)}
                aria-pressed={language === item.id}
                className={cn(
                  'tdz-mono rounded-full px-4 py-2 text-[12.5px] transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-[color:var(--tdz-emerald)] focus-visible:ring-offset-2 focus-visible:outline-none',
                  language === item.id
                    ? 'bg-[var(--tdz-ink)] font-semibold text-white shadow-sm'
                    : 'border border-[color:var(--tdz-line)] bg-[var(--tdz-canvas)] text-[var(--tdz-ink)] hover:bg-[var(--tdz-line-alt)]'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className='mt-8 flex items-center gap-3 rounded-xl border border-[color:var(--tdz-line)] bg-[var(--tdz-canvas)] p-3'>
            <MonoTag tone='emerald'>Base URL</MonoTag>
            <code className='tdz-mono min-w-0 flex-1 truncate text-[12px] text-[var(--tdz-ink)]'>
              {baseUrl || t('mk.common.loading')}
            </code>
          </div>

          <ArrowPillButton className='mt-6' size='lg' href={signUpUrl}>
            {t('mk.landing.code.cta')}
          </ArrowPillButton>
        </div>

        <div className='lg:col-span-7'>
          <div className='overflow-hidden rounded-2xl border-2 border-[color:var(--tdz-ink)] bg-[var(--tdz-surface-dark)] text-slate-100 shadow-[8px_8px_0px_0px_var(--tdz-shadow)]'>
            <div className='flex items-center justify-between border-b border-white/10 bg-[var(--tdz-ink)] px-4 py-3'>
              <div className='flex items-center gap-1.5'>
                <span className='h-3 w-3 rounded-full bg-[var(--tdz-mac-red)]' />
                <span className='h-3 w-3 rounded-full bg-[var(--tdz-mac-yellow)]' />
                <span className='h-3 w-3 rounded-full bg-[var(--tdz-mac-green)]' />
              </div>
              <span className='tdz-mono text-[11px] text-white/60'>
                {sample.filename}
              </span>
              <div className='flex items-center gap-2'>
                <span className='tdz-mono hidden max-w-[180px] truncate text-[10px] text-white/40 sm:inline'>
                  {baseUrl.replace(/^https?:\/\//, '')}
                </span>
                <button
                  type='button'
                  onClick={() => copy(sample.code)}
                  aria-label={t('mk.landing.code.copyCode')}
                  className='rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white'
                >
                  {copied ? (
                    <Check className='h-3.5 w-3.5 text-[var(--tdz-emerald)]' />
                  ) : (
                    <Copy className='h-3.5 w-3.5' />
                  )}
                </button>
              </div>
            </div>

            <div className='tdz-scroll tdz-mono h-[440px] overflow-auto py-4 text-[12.5px] leading-[1.75]'>
              <CodeLines sample={sample} baseUrl={baseUrl} />
            </div>

            <div className='flex flex-col gap-2 border-t border-white/10 bg-[var(--tdz-ink)]/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
              <button
                type='button'
                onClick={() => setRunning(true)}
                disabled={running}
                className='tdz-mono inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap text-emerald-300 transition-colors hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60'
              >
                <Play className='h-3 w-3' />
                {running
                  ? t('mk.landing.code.running')
                  : t('mk.landing.code.run')}
              </button>
              <code
                className={cn(
                  'tdz-mono min-h-[18px] min-w-0 flex-1 truncate text-[11px] text-emerald-300/90',
                  running && 'tdz-caret'
                )}
              >
                {output || (running ? '' : t('mk.landing.code.runHint'))}
              </code>
            </div>
          </div>

          <p className='tdz-mono mt-3 flex items-center justify-end gap-2 text-[10px] tracking-[0.08em] text-[var(--tdz-muted)] uppercase'>
            <span className='h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
            Gateway · Auto Routing
          </p>
        </div>
      </div>
    </section>
  )
}

/** 对外导出的 island：先注入 i18n 上下文，再渲染真正的组件 */
export function CodeShowcase(
  props: Parameters<typeof CodeShowcaseInner>[0] & {
    /** 当前语言的翻译对象，由 .astro 在构建期传入，不进入客户端 bundle */
    resources: Record<string, unknown>
  }
) {
  const { resources, ...rest } = props
  return (
    <I18nIsland locale={props.locale} resources={resources}>
      <CodeShowcaseInner {...rest} />
    </I18nIsland>
  )
}