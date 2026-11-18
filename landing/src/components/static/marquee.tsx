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

export function Marquee(props: { items: string[] }) {
  const { t } = useTranslation()

  return (
    <div className='tdz-marquee border-b border-[color:var(--tdz-ink)] bg-[var(--tdz-ink)] py-2 text-white'>
      <div className='tdz-marquee-track'>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className='flex shrink-0 items-center'
            aria-hidden={copy === 1}
          >
            {props.items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className='tdz-mono flex items-center gap-3 px-4 text-[11px] tracking-[0.1em] whitespace-nowrap text-white/85 uppercase'
              >
                {t(item)}
                <span className='text-[var(--tdz-emerald)]'>•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
