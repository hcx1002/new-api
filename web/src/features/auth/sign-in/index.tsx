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
import { useSearch } from '@tanstack/react-router'

import { AuthPage } from '@/features/tokendazi/auth'

/**
 * `/sign-in` 的页面实现：视觉与交互全部来自 `features/tokendazi/auth`，
 * 这里只负责把路由上的 `?redirect=` 透传下去。
 */
export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return <AuthPage mode='login' redirectTo={redirect} />
}
