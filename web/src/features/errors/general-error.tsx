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
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  BackHomeButton,
  ErrorScreen,
  GoBackButton,
  RetryButton,
} from '@/features/tokendazi/errors/error-screen'
import { cn } from '@/lib/utils'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
  error?: unknown
}

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const response = (error as Record<string, unknown>).response
  if (typeof response !== 'object' || response === null) return undefined
  const status = (response as Record<string, unknown>).status
  return typeof status === 'number' ? status : undefined
}

export function GeneralError({
  className,
  minimal = false,
  error,
}: GeneralErrorProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  useEffect(() => {
    if (
      !(error instanceof Error) ||
      (error.name !== 'ChunkLoadError' &&
        !/^Loading (CSS )?chunk .+ failed\./.test(error.message))
    ) {
      return
    }

    // Recover only when the failed route is displayed, never on intent preload.
    // Keep the marker across reloads so a persistent failure shows this page.
    try {
      const key = `tanstack_router_reload:${error.message}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // Without a persistent marker, reloading could loop indefinitely.
      return
    }
    window.location.reload()
  }, [error])

  const status = getHttpStatus(error)
  const isRateLimited = status === 429
  const title = isRateLimited
    ? t('Too many requests')
    : `${t('Oops! Something went wrong')} ${`:')`}`
  const description = isRateLimited
    ? t('Please wait a moment before trying again.')
    : t('Please try again later.')

  // minimal 只用于内嵌在已有版式里的场合，直接给一句话，不铺整页骨架
  if (minimal) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 py-10 text-center',
          className
        )}
      >
        <span className='font-medium'>{title}</span>
        <p className='text-muted-foreground text-sm'>
          {t('We apologize for the inconvenience.')} {description}
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ErrorScreen
        code={status === undefined ? 'ERR' : String(status)}
        kicker={isRateLimited ? 'Rate Limited' : 'Server Error'}
        title={title}
        description={
          <>
            {t('We apologize for the inconvenience.')}
            <br />
            {description}
          </>
        }
        stamp={
          isRateLimited
            ? { title: 'SLOW', lines: ['BACK OFF'], color: 'var(--tdz-yellow)' }
            : { title: 'FAULT', lines: ['RETRY'], color: 'var(--tdz-orange)' }
        }
        barcodeSeed={`error-${status ?? 'unknown'}`}
        actions={
          <>
            <RetryButton onClick={() => window.location.reload()} />
            <BackHomeButton />
            <GoBackButton />
          </>
        }
        footnote={
          <>
            {t('Still stuck?')}{' '}
            <button
              type='button'
              onClick={() => void navigate({ to: '/dashboard' })}
              className='font-semibold text-[var(--tdz-emerald-strong)] underline decoration-dotted underline-offset-4'
            >
              {t('Open the console to check channel status')}
            </button>
            {t('or contact your administrator.')}
          </>
        }
      />
    </div>
  )
}