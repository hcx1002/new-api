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
import { useEffect, useState } from 'react'

import { useStatus } from '@/hooks/use-status'

/** 统一成 OpenAI SDK 需要的 base_url：补 `/v1`，并去掉尾部斜杠 */
export function toApiBaseUrl(address: string): string {
  const trimmed = address.trim().replace(/\/+$/, '')
  if (!trimmed) return ''
  if (/\/v\d+(?:beta\d*)?$/i.test(trimmed)) return trimmed
  return `${trimmed}/v1`
}

function readOrigin(): string {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

function readHost(): string {
  if (typeof window === 'undefined') return ''
  return window.location.host
}

function isLoopbackAddress(address: string): boolean {
  try {
    const host = new URL(address).hostname
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1'
    )
  } catch {
    return false
  }
}

/**
 * Base URL 优先取后台配置的 `server_address`；该字段为空、或指向本机回环地址
 * （典型是开发环境的 localhost）时，回落到浏览器当前域名，保证对外可复制可用。
 */
export function useBaseUrl(): string {
  const { status } = useStatus()
  const [origin, setOrigin] = useState(readOrigin)
  const configured = (status as Record<string, unknown> | null)?.server_address
  const configuredAddress =
    typeof configured === 'string' ? configured.trim() : ''

  const address =
    configuredAddress && !isLoopbackAddress(configuredAddress)
      ? configuredAddress
      : origin

  useEffect(() => {
    setOrigin(readOrigin())
  }, [])

  return toApiBaseUrl(address)
}

export function useCurrentHost(): string {
  const [host, setHost] = useState(readHost)

  useEffect(() => {
    setHost(readHost())
  }, [])

  return host
}
