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
  RetryButton,
} from '@/features/tokendazi/errors/error-screen'

export function MaintenanceError() {
  const { t } = useTranslation()

  return (
    <ErrorScreen
      code='503'
      kicker='Maintenance'
      title={t('Website is under maintenance!')}
      description={
        <>
          {t('The site is not available at the moment.')}
          <br />
          {t("We'll be back online shortly.")}
        </>
      }
      stamp={{ title: 'PAUSED', lines: ['SOON'], color: 'var(--tdz-yellow)' }}
      barcodeSeed='503-maintenance'
      actions={
        <>
          <RetryButton onClick={() => window.location.reload()} />
          <BackHomeButton />
        </>
      }
      footnote={t('Thanks for your patience while we finish the upgrade.')}
    />
  )
}