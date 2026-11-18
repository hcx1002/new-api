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

import {
  INTERFACE_LANGUAGE_OPTIONS,
  normalizeInterfaceLanguage,
} from '@/i18n/languages'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

/**
 * 首页 / 登录页的语言切换入口。
 * 不自带下拉组件库依赖，避免把控制台的设计令牌带进 `.tdz-root`。
 * 选择结果由 language-detector 写进 localStorage，下次访问沿用。
 */
export function LanguageMenu({ className }: { className?: string }) {
  const { i18n, t } = useTranslation()
  const user = useAuthStore((s) => s.auth.user)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const current = normalizeInterfaceLanguage(i18n.language)

  const changeLanguage = async (code: string) => {
    setOpen(false)
    await i18n.changeLanguage(code)
    // 已登录时同步到账号，避免进控制台后又被账号里的偏好覆盖回去
    if (!user) return
    try {
      await api.put('/api/user/self', { language: code })
    } catch {
      // 尽力而为，失败不打断界面
    }
  }

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
          {INTERFACE_LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang.code}
              type='button'
              role='option'
              aria-selected={current === lang.code}
              onClick={() => void changeLanguage(lang.code)}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors',
                current === lang.code
                  ? 'bg-[var(--tdz-ink)] font-semibold text-white'
                  : 'text-[var(--tdz-body)] hover:bg-[var(--tdz-canvas)] hover:text-[var(--tdz-ink)]'
              )}
            >
              {lang.label}
              {current === lang.code && <Check className='h-3 w-3' />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
