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
import { Check, Languages } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LOCALE_META, LOCALES, type Locale } from '@/config/site'
import { cn } from '@/lib/utils'

/**
 * 语言切换入口。
 *
 * 与主站实现的根本差异：本语言由 URL 决定，切换即整站跳转到对应路径，
 * 不调用 changeLanguage、不写 localStorage、也不向账号同步 ——
 * 静态站每个 URL 必须只对应一种语言，否则搜索引擎会索引到混杂内容。
 */
export function LanguageMenu({
  locale,
  className,
}: {
  locale: Locale
  className?: string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        type='button'
        onClick={() => setOpen((value) => !value)}
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-label={t('mk.common.language')}
        className='flex h-9 items-center gap-1.5 rounded-xl border border-[color:var(--tdz-ink)]/20 bg-white px-2.5 text-[12.5px] font-medium text-[var(--tdz-ink)] transition-colors hover:border-[color:var(--tdz-ink)]'
      >
        <Languages className='h-4 w-4' />
      </button>

      {open && (
        <div
          role='listbox'
          className='absolute right-0 z-50 mt-2 w-40 rounded-xl border-2 border-[color:var(--tdz-ink)] bg-white p-1 shadow-[4px_4px_0px_0px_var(--tdz-shadow)]'
        >
          {LOCALES.map((code) => (
            <a
              key={code}
              role='option'
              aria-selected={locale === code}
              // 直接整页跳转，保证地址栏与服务端渲染的语言一致
              href={LOCALE_META[code].path}
              hrefLang={LOCALE_META[code].htmlLang}
              onClick={() => setOpen(false)}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors',
                locale === code
                  ? 'bg-[var(--tdz-ink)] font-semibold text-white'
                  : 'text-[var(--tdz-body)] hover:bg-[var(--tdz-canvas)] hover:text-[var(--tdz-ink)]'
              )}
            >
              {LOCALE_META[code].label}
              {locale === code && <Check className='h-3 w-3' />}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}