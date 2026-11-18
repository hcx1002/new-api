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
/** 四色密码强度：橙 → 黄 → 蓝 → 绿。`label` 存 i18n key，渲染处用 t() 取值 */
export const STRENGTH_STEPS = [
  { label: 'mk.strength.weak', color: 'var(--tdz-orange)' },
  { label: 'mk.strength.fair', color: 'var(--tdz-yellow)' },
  { label: 'mk.strength.strong', color: 'var(--tdz-blue)' },
  { label: 'mk.strength.veryStrong', color: 'var(--tdz-emerald)' },
] as const

/** 长度、大小写、数字、符号各计 1 分 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  if (score === 0) return 1
  return Math.min(score, 4)
}
