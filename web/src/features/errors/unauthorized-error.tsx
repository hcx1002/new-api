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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import {
  BackHomeButton,
  ErrorScreen,
  GoBackButton,
} from '@/features/tokendazi/errors/error-screen'

export function UnauthorisedError() {
  const { t } = useTranslation()

  return (
    <ErrorScreen
      code='401'
      kicker='Unauthorized'
      title={t('Unauthorized Access')}
      description={
        <>
          {t('Please log in with the appropriate credentials')}
          <br />
          {t('to access this resource.')}
        </>
      }
      stamp={{ title: 'LOCKED', lines: ['SIGN IN'], color: 'var(--tdz-blue)' }}
      barcodeSeed='401-unauthorized'
      actions={
        <>
          <BackHomeButton />
          <GoBackButton />
        </>
      }
      footnote={
        <>
          {t('Need to sign in first?')}{' '}
          <Link
            to='/sign-in'
            className='font-semibold text-[var(--tdz-emerald-strong)] underline decoration-dotted underline-offset-4'
          >
            {t('Sign in')}
          </Link>
          {t('to continue.')}
        </>
      }
    />
  )
}