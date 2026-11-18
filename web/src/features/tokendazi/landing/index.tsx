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
import { useTranslation } from 'react-i18next'

import { useSystemConfig } from '@/hooks/use-system-config'

import { BentoSection } from '../components/bento-section'
import {
  CtaBanner,
  DarkSteps,
  SiteFooter,
} from '../components/closing-sections'
import { CodeShowcase } from '../components/code-showcase'
import { Marquee } from '../components/marquee'
import { EdgeRibbon } from '../components/primitives'
import { MARQUEE_ITEMS } from '../lib/data'
import { useBaseUrl } from '../lib/use-base-url'
import { Hero } from './hero'
import { Navbar } from './navbar'

import '../styles/tokendazi.css'

export function LandingPage({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { systemName } = useSystemConfig()
  const baseUrl = useBaseUrl()
  const brandName = systemName?.trim() || t('mk.common.brandFallback')

  const goAuth = (mode: 'login' | 'register') => {
    if (mode === 'login') {
      void navigate({ to: '/sign-in' })
      return
    }
    void navigate({ to: '/sign-up' })
  }

  const goPrimary = () => {
    if (isAuthenticated) {
      void navigate({ to: '/dashboard' })
      return
    }
    goAuth('register')
  }

  return (
    <div className='tdz-root min-h-screen bg-[var(--tdz-canvas)]'>
      <EdgeRibbon />
      <Navbar
        brandName={brandName}
        isAuthenticated={isAuthenticated}
        onAuth={goAuth}
      />
      <Marquee items={MARQUEE_ITEMS} />

      <main>
        <Hero brandName={brandName} baseUrl={baseUrl} onPrimary={goPrimary} />
        <BentoSection />
        <CodeShowcase
          brandName={brandName}
          baseUrl={baseUrl}
          onGetKey={goPrimary}
        />
        <DarkSteps brandName={brandName} />
        <CtaBanner onGetKey={goPrimary} />
      </main>

      <SiteFooter brandName={brandName} />
    </div>
  )
}
