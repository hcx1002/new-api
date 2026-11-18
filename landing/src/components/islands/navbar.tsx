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
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  LOCALE_META,
  LOCALES,
  type Locale,
  mainSiteUrl,
} from '@/config/site'
import { cn } from '@/lib/utils'

import { LanguageMenu } from './language-menu'
import { BrandMark } from '../static/primitives'
import { I18nIsland } from './i18n-island'

type NavbarProps = {
  brandName: string
  locale: Locale
}

/** 移动端菜单里的行内语言选择：图标按钮在小屏不显标签，这里补全量入口 */
function MobileLanguageRow({ locale }: { locale: Locale }) {
  return (
    <div className='flex flex-wrap justify-end gap-1'>
      {LOCALES.map((code) => (
        <a
          key={code}
          href={LOCALE_META[code].path}
          hrefLang={LOCALE_META[code].htmlLang}
          aria-current={locale === code ? 'true' : undefined}
          className={cn(
            'rounded-lg px-2 py-1 text-[11.5px] transition-colors',
            locale === code
              ? 'bg-[var(--tdz-ink)] font-semibold text-white'
              : 'text-[var(--tdz-body)] hover:bg-[var(--tdz-canvas)]'
          )}
        >
          {LOCALE_META[code].label}
        </a>
      ))}
    </div>
  )
}

const ANCHOR_LINKS = [
  { label: 'mk.nav.quick', href: '#quick-start' },
  { label: 'mk.nav.models', href: '#models' },
]

/**
 * 顶部导航。
 *
 * 落地站没有登录态，因此所有「去控制台 / 登录 / 注册」都是指向主站的普通链接，
 * 不做客户端跳转，也不需要 auth store。
 */
function NavbarInner({ brandName, locale }: NavbarProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 border-b border-[color:var(--tdz-line)] bg-white/95 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12'>
        <div className='flex items-center gap-8'>
          <a
            href={LOCALE_META[locale].path}
            className='flex items-center'
            aria-label={t('mk.nav.home')}
          >
            <BrandMark name={brandName} />
          </a>

          <nav className='hidden items-center gap-1 lg:flex'>
            <a
              href='#top'
              className='rounded-lg bg-[var(--tdz-mint)] px-3.5 py-1.5 text-sm font-semibold text-[var(--tdz-emerald-strong)]'
            >
              {t('mk.nav.home')}
            </a>
            {ANCHOR_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='rounded-lg px-3.5 py-1.5 text-sm font-medium text-[var(--tdz-body)] transition-colors hover:bg-[var(--tdz-canvas)] hover:text-[var(--tdz-ink)]'
              >
                {t(link.label)}
              </a>
            ))}
            <a
              href={mainSiteUrl('dashboard')}
              className='rounded-lg px-3.5 py-1.5 text-sm font-medium text-[var(--tdz-body)] transition-colors hover:bg-[var(--tdz-canvas)] hover:text-[var(--tdz-ink)]'
            >
              {t('mk.nav.console')}
            </a>
          </nav>
        </div>

        <div className='flex items-center gap-2'>
          <LanguageMenu locale={locale} />
          <a
            href={mainSiteUrl('signIn')}
            className='inline-flex h-9 items-center rounded-xl border border-[color:var(--tdz-ink)]/20 bg-white px-4 text-sm font-medium text-[var(--tdz-ink)] transition-colors hover:border-[color:var(--tdz-ink)]'
          >
            {t('mk.nav.signIn')}
          </a>
          <a
            href={mainSiteUrl('signUp')}
            className='inline-flex h-9 items-center rounded-xl bg-[var(--tdz-ink)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--tdz-ink-soft)]'
          >
            {t('mk.nav.signUp')}
          </a>

          <button
            type='button'
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? t('mk.nav.closeMenu') : t('mk.nav.openMenu')}
            aria-expanded={open}
            className='ml-1 rounded-lg border border-[color:var(--tdz-line)] p-2 text-[var(--tdz-ink)] lg:hidden'
          >
            {open ? <X className='h-4 w-4' /> : <Menu className='h-4 w-4' />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-[color:var(--tdz-line)] bg-white transition-[max-height] duration-200 lg:hidden',
          open ? 'max-h-80' : 'max-h-0 border-t-0'
        )}
      >
        <nav className='mx-auto flex max-w-7xl flex-col gap-1 px-6 py-3 lg:px-12'>
          {ANCHOR_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className='rounded-lg px-3 py-2 text-sm font-medium text-[var(--tdz-body)] hover:bg-[var(--tdz-canvas)] hover:text-[var(--tdz-ink)]'
            >
              {t(link.label)}
            </a>
          ))}
          <a
            href={mainSiteUrl('dashboard')}
            className='rounded-lg px-3 py-2 text-sm font-medium text-[var(--tdz-body)] hover:bg-[var(--tdz-canvas)] hover:text-[var(--tdz-ink)]'
          >
            {t('mk.nav.console')}
          </a>
          <div className='flex items-center justify-between gap-3 border-t border-[color:var(--tdz-line)] px-3 pt-3 pb-1'>
            <span className='tdz-mono text-[11px] tracking-[0.08em] text-[var(--tdz-muted)] uppercase'>
              {t('mk.common.language')}
            </span>
            <MobileLanguageRow locale={locale} />
          </div>
        </nav>
      </div>
    </header>
  )
}
/** 对外导出的 island：先注入 i18n 上下文，再渲染真正的组件 */
export function Navbar(
  props: Parameters<typeof NavbarInner>[0] & {
    /** 当前语言的翻译对象，由 .astro 在构建期传入，不进入客户端 bundle */
    resources: Record<string, unknown>
  }
) {
  const { resources, ...rest } = props
  return (
    <I18nIsland locale={props.locale} resources={resources}>
      <NavbarInner {...rest} />
    </I18nIsland>
  )
}