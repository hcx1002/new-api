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
import { useTranslation } from 'react-i18next'

import {
  BackHomeButton,
  ErrorScreen,
  GoBackButton,
} from '@/features/tokendazi/errors/error-screen'

export function ForbiddenError() {
  const { t } = useTranslation()

  return (
    <ErrorScreen
      code='403'
      kicker='Forbidden'
      title={t('Access Forbidden')}
      description={
        <>
          {t("You don't have necessary permission")}
          <br />
          {t('to view this resource.')}
        </>
      }
      stamp={{ title: 'DENIED', lines: ['NO ACCESS'], color: 'var(--tdz-orange)' }}
      barcodeSeed='403-forbidden'
      actions={
        <>
          <BackHomeButton />
          <GoBackButton />
        </>
      }
      footnote={t(
        'If you believe you should have access, ask an administrator to review your group permissions.'
      )}
    />
  )
}