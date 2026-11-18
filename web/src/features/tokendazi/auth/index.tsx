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
import { Link, useNavigate } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'

import {
  IconDiscord,
  IconGithub,
  IconLinuxDo,
  IconTelegram,
} from '@/assets/brand-icons'
import { Turnstile } from '@/components/turnstile'
import { login, register } from '@/features/auth/api'
import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect'
import { useEmailVerification } from '@/features/auth/hooks/use-email-verification'
import { useOAuthLogin } from '@/features/auth/hooks/use-oauth-login'
import { getAffiliateCode, saveAffiliateCode } from '@/features/auth/lib/storage'
import type { SystemStatus } from '@/features/auth/types'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import { getServerErrorMessage } from '@/lib/server-error-message'
import { countPasswordCharacters } from '@/lib/password-policy'
import { cn } from '@/lib/utils'

import { LanguageMenu } from '../components/language-menu'
import { LegalDialog, type LegalDocKind } from '../components/legal-dialog'
import {
  ArrowPillButton,
  BrandMark,
  EdgeRibbon,
} from '../components/primitives'
import { StrengthMeter } from '../components/strength-meter'
import { getPasswordStrength } from '../lib/password-strength'
import { PassportPreview } from './passport-preview'

import '../styles/tokendazi.css'

type AuthMode = 'login' | 'register'

type Errors = Partial<
  Record<'name' | 'email' | 'password' | 'code' | 'agree' | 'turnstile', string>
>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** 文案统一存 i18n key，渲染处用 t() 取值 */
const FORM_COPY_KEYS: Record<
  AuthMode,
  { tab: string; submit: string; loading: string; successTitle: string }
> = {
  login: {
    tab: 'mk.auth.form.login.tab',
    submit: 'mk.auth.form.login.submit',
    loading: 'mk.auth.form.login.loading',
    successTitle: 'mk.auth.form.login.successTitle',
  },
  register: {
    tab: 'mk.auth.form.register.tab',
    submit: 'mk.auth.form.register.submit',
    loading: 'mk.auth.form.register.loading',
    successTitle: 'mk.auth.form.register.successTitle',
  },
}

type OAuthProviderButton = {
  key: string
  label: string
  icon: ReactNode
  onClick: () => void
}

/**
 * 第三方登录入口完全由 `/api/status` 决定：
 * 后台没配 GitHub / OIDC 等，这里就一个按钮都不渲染，避免出现点了没反应的假入口。
 */
function OAuthBlock({ status }: { status: SystemStatus | null }) {
  const { t } = useTranslation()
  const {
    isLoading,
    handleGitHubLogin,
    handleDiscordLogin,
    handleOIDCLogin,
    handleLinuxDOLogin,
    handleTelegramLogin,
    handleCustomOAuthLogin,
  } = useOAuthLogin(status)

  const providers: OAuthProviderButton[] = []

  if (status?.github_oauth) {
    providers.push({
      key: 'github',
      label: 'GitHub',
      icon: <IconGithub className='h-4 w-4' />,
      onClick: handleGitHubLogin,
    })
  }
  if (status?.discord_oauth) {
    providers.push({
      key: 'discord',
      label: 'Discord',
      icon: <IconDiscord className='h-4 w-4' />,
      onClick: handleDiscordLogin,
    })
  }
  if (status?.linuxdo_oauth) {
    providers.push({
      key: 'linuxdo',
      label: 'LinuxDO',
      icon: <IconLinuxDo className='h-4 w-4' />,
      onClick: handleLinuxDOLogin,
    })
  }
  if (status?.telegram_oauth) {
    providers.push({
      key: 'telegram',
      label: 'Telegram',
      icon: <IconTelegram className='h-4 w-4' />,
      onClick: handleTelegramLogin,
    })
  }
  if (status?.oidc_enabled) {
    providers.push({
      key: 'oidc',
      label: status.oidc_display_name?.trim() || 'OIDC',
      icon: <ShieldCheck className='h-4 w-4' />,
      onClick: handleOIDCLogin,
    })
  }
  for (const provider of status?.custom_oauth_providers ?? []) {
    providers.push({
      key: `custom-${provider.slug}`,
      label: provider.name,
      icon: <ShieldCheck className='h-4 w-4' />,
      onClick: () => handleCustomOAuthLogin(provider),
    })
  }

  if (providers.length === 0) return null

  return (
    <div
      className={cn(
        'grid gap-3',
        providers.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
      )}
    >
      {providers.map((provider) => (
        <button
          key={provider.key}
          type='button'
          disabled={isLoading}
          onClick={provider.onClick}
          className='flex items-center justify-center gap-2 rounded-xl border-2 border-[color:var(--tdz-ink)] bg-white px-4 py-2.5 text-[13px] font-semibold text-[var(--tdz-ink)] shadow-[3px_3px_0px_0px_var(--tdz-line)] transition-all hover:shadow-[4px_4px_0px_0px_var(--tdz-shadow)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {provider.icon}
          {t('mk.auth.oauth.loginWith', { provider: provider.label })}
        </button>
      ))}
    </div>
  )
}

function resolveTurnstileHint(
  state: {
    failed: boolean
    verified: boolean
    bypass: boolean
    slow: boolean
  },
  t: (key: string) => string
): { tone: 'muted' | 'warn'; text: string } {
  if (state.failed) {
    return { tone: 'warn', text: t('mk.auth.turnstile.failed') }
  }
  if (state.verified) return { tone: 'muted', text: t('mk.auth.turnstile.verified') }
  if (state.bypass) {
    return { tone: 'muted', text: t('mk.auth.turnstile.bypass') }
  }
  if (state.slow) {
    return { tone: 'warn', text: t('mk.auth.turnstile.slow') }
  }
  return { tone: 'muted', text: t('mk.auth.turnstile.pending') }
}

/** 后端部分错误是英文原文，人机验证相关给出可操作的本站提示 */
function localizeAuthError(
  message: string,
  fallback: string,
  t: (key: string) => string
): string {
  if (!message) return fallback
  if (/turnstile/i.test(message)) {
    return t('mk.auth.turnstile.blocked')
  }
  return message
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className='mt-1.5 text-[11px] font-medium text-[var(--tdz-orange)]'>{message}</p>
  )
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: ReactNode
}) {
  return (
    <label className='flex cursor-pointer items-start gap-2 text-[12px] leading-relaxed text-[var(--tdz-body)]'>
      <button
        type='button'
        role='checkbox'
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 border-[color:var(--tdz-ink)] transition-colors',
          checked ? 'bg-[var(--tdz-emerald)]' : 'bg-white'
        )}
      >
        {checked && (
          <Check className='h-2.5 w-2.5 text-white' strokeWidth={4} />
        )}
      </button>
      <span>{label}</span>
    </label>
  )
}

const PASSWORD_COPY: Record<
  AuthMode,
  { label: string; placeholder: string; autocomplete: string }
> = {
  login: {
    label: 'mk.auth.password.login.label',
    placeholder: 'mk.auth.password.login.placeholder',
    autocomplete: 'current-password',
  },
  register: {
    label: 'mk.auth.password.register.label',
    placeholder: 'mk.auth.password.register.placeholder',
    autocomplete: 'new-password',
  },
}

function SendCodeButton({
  active,
  countdown,
  sending,
  onClick,
}: {
  active: boolean
  countdown: number
  sending: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()
  let label = t('mk.auth.sendCode.idle')
  if (active) label = t('mk.auth.sendCode.countdown', { seconds: countdown })
  else if (sending) label = t('mk.auth.sendCode.sending')

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={active || sending}
      className='absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-[var(--tdz-emerald)] px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white transition-colors hover:bg-[var(--tdz-emerald-strong)] disabled:cursor-not-allowed disabled:bg-[var(--tdz-shadow)] disabled:text-[var(--tdz-emerald-strong)]'
    >
      {label}
    </button>
  )
}

export function AuthPage({
  mode,
  redirectTo,
}: {
  /** 由路由决定：`/sign-in` 传 login，`/sign-up` 传 register */
  mode: AuthMode
  /** 登录成功后回跳地址，由 `?redirect=` 传入，内部会再次做同源校验 */
  redirectTo?: string
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { systemName } = useSystemConfig()
  const { status } = useStatus()
  const brandName = systemName?.trim() || t('mk.common.brandFallback')

  const [email, setEmail] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [agree, setAgree] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [legalOpen, setLegalOpen] = useState<LegalDocKind | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [shaking, setShaking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)
  const [turnstileFailed, setTurnstileFailed] = useState(false)
  const [turnstileSlow, setTurnstileSlow] = useState(false)

  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { handleLoginResult } = useAuthRedirect()

  const strength = getPasswordStrength(password)
  const copy = FORM_COPY_KEYS[mode]
  const passwordCopy = PASSWORD_COPY[mode]

  // 全部开关取自后端 /api/status，未启用的能力不渲染入口
  const isTurnstileEnabled = Boolean(
    status?.turnstile_check && status?.turnstile_site_key
  )
  const turnstileSiteKey = status?.turnstile_site_key || ''
  const hasUserAgreement = Boolean(status?.user_agreement_enabled)
  const hasPrivacyPolicy = Boolean(status?.privacy_policy_enabled)
  const requiresLegalConsent = hasUserAgreement || hasPrivacyPolicy
  const emailVerificationEnabled = status?.email_verification !== false
  const passwordLoginEnabled = status?.password_login_enabled !== false
  // 注册开关：status 未加载时按「开放」处理，避免首屏闪一下再收起来
  const registerBlocked = Boolean(
    status &&
    (status.register_enabled === false ||
      status.password_register_enabled === false ||
      status.self_use_mode_enabled)
  )
  const canRegister = !registerBlocked
  const hasOAuth = Boolean(
    status?.github_oauth ||
    status?.discord_oauth ||
    status?.oidc_enabled ||
    status?.linuxdo_oauth ||
    status?.telegram_oauth ||
    (status?.custom_oauth_providers?.length ?? 0) > 0
  )
  // 本地开发时 localhost 不在 Site Key 域名白名单里，校验会一直挂起；
  // 这里只在 dev 下、且确实等超时之后才放行，生产构建不受影响。
  const turnstileBypass = Boolean(
    import.meta.env.DEV && isTurnstileEnabled && turnstileSlow && !turnstileToken
  )
  const turnstileHint = resolveTurnstileHint(
    {
      failed: turnstileFailed,
      verified: Boolean(turnstileToken),
      bypass: turnstileBypass,
      slow: turnstileSlow,
    },
    t
  )

  useEffect(
    () => () => {
      if (shakeTimer.current) clearTimeout(shakeTimer.current)
    },
    []
  )

  // ?aff=xxx 推广链接落地时先存下来，注册时自动带上
  useEffect(() => {
    const aff = new URLSearchParams(window.location.search).get('aff')?.trim()
    if (aff) saveAffiliateCode(aff)
  }, [])

  // Turnstile 脚本被拦截时不会有人机验证框，给个明确提示而不是静默空白
  useEffect(() => {
    if (!isTurnstileEnabled) return
    setTurnstileFailed(false)
    const timer = setTimeout(() => {
      setTurnstileFailed(!window.turnstile)
    }, 5000)
    return () => clearTimeout(timer)
  }, [isTurnstileEnabled, turnstileKey])

  // 校验长时间没有结果：Site Key 的域名白名单通常没包含 localhost
  useEffect(() => {
    if (!isTurnstileEnabled || turnstileToken) {
      setTurnstileSlow(false)
      return
    }
    const timer = setTimeout(() => setTurnstileSlow(true), 8000)
    return () => clearTimeout(timer)
  }, [isTurnstileEnabled, turnstileKey, turnstileToken])

  const reloadTurnstile = () => {
    setTurnstileToken('')
    setErrors((prev) => ({ ...prev, turnstile: undefined }))
    setTurnstileKey((value) => value + 1)
  }

  const passwordEncryptionEnabled =
    status?.password_login_encryption_enabled === true

  // 验证码由后端真实发送，倒计时与失败提示都复用既有实现
  const {
    isSending,
    secondsLeft,
    isActive: codeCountdownActive,
    sendCode,
  } = useEmailVerification({
    turnstileToken,
    validateTurnstile: () => {
      if (isTurnstileEnabled && !turnstileToken && !turnstileBypass) {
        setErrors((prev) => ({
          ...prev,
          turnstile: t('mk.auth.validation.turnstileBeforeCode'),
        }))
        return false
      }
      return true
    },
  })

  const triggerShake = () => {
    setShaking(false)
    window.requestAnimationFrame(() => setShaking(true))
    if (shakeTimer.current) clearTimeout(shakeTimer.current)
    shakeTimer.current = setTimeout(() => setShaking(false), 400)
  }

  // 两个 Tab 各自是真实路由，切换即换页，URL 始终与当前表单一致
  const switchMode = (next: AuthMode) => {
    if (next === mode) return
    if (next === 'login') {
      void navigate({
        to: '/sign-in',
        search: { redirect: redirectTo },
        replace: true,
      })
      return
    }
    void navigate({
      to: '/sign-up',
      search: { redirect: redirectTo },
      replace: true,
    })
  }

  const resetTurnstileToken = () => {
    if (!isTurnstileEnabled) return
    setTurnstileToken('')
    setTurnstileKey((value) => value + 1)
  }

  const handleSendCode = async () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErrors((prev) => ({
        ...prev,
        email: t('mk.auth.validation.emailBeforeCode'),
      }))
      triggerShake()
      return
    }
    setErrors((prev) => ({ ...prev, email: undefined }))
    const sent = await sendCode(email.trim())
    if (sent) {
      // Turnstile token 一次性有效，发完验证码要换一张
      resetTurnstileToken()
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const next: Errors = {}
    const account = email.trim()
    const username = registerName.trim()

    if (mode === 'login') {
      if (!account) next.email = t('mk.auth.validation.accountRequired')
      if (!password) next.password = t('mk.auth.validation.passwordRequired')
    } else {
      if (!username) next.name = t('mk.auth.validation.usernameRequired')
      if (!EMAIL_PATTERN.test(account)) {
        next.email = t('mk.auth.validation.emailInvalid')
      }
      if (emailVerificationEnabled && !/^\d{6}$/.test(code.trim())) {
        next.code = t('mk.auth.validation.codeRequired')
      }
      const length = countPasswordCharacters(password)
      if (length < 8 || length > 128) {
        next.password = t('mk.auth.validation.passwordLength')
      }
      if (requiresLegalConsent && !agree) {
        next.agree = t('mk.auth.validation.agreeRequired')
      }
    }

    if (isTurnstileEnabled && !turnstileToken && !turnstileBypass) {
      next.turnstile = t('mk.auth.validation.turnstileRequired')
    }

    setErrors(next)
    setFormError('')
    if (Object.keys(next).length > 0) {
      triggerShake()
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'login') {
        const res = await login({
          username: account,
          password,
          turnstile: turnstileToken,
          passwordEncryptionEnabled,
        })

        if (!res?.success) {
          setFormError(
            localizeAuthError(
              res?.message ?? '',
              t('mk.auth.error.loginFailed'),
              t
            )
          )
          triggerShake()
          resetTurnstileToken()
          return
        }

        // 需要二次验证时这里会跳到 /otp，否则直接进控制台
        await handleLoginResult(res.data, redirectTo)
        return
      }

      const res = await register({
        username,
        password,
        email: account,
        verification_code: emailVerificationEnabled ? code.trim() : undefined,
        aff_code: inviteCode.trim() || getAffiliateCode() || undefined,
        turnstile: turnstileToken,
      })

      if (!res?.success) {
        setFormError(
          localizeAuthError(
            res?.message ?? '',
            t('mk.auth.error.registerFailed'),
            t
          )
        )
        triggerShake()
        resetTurnstileToken()
        return
      }

      resetTurnstileToken()
      setSuccess(true)
    } catch (error: unknown) {
      setFormError(
        localizeAuthError(
          getServerErrorMessage(error, ''),
          mode === 'login'
            ? t('mk.auth.error.loginRetry')
            : t('mk.auth.error.registerRetry'),
          t
        )
      )
      triggerShake()
      resetTurnstileToken()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='tdz-root relative flex min-h-screen flex-col justify-between overflow-hidden bg-[var(--tdz-canvas)]'>
      <EdgeRibbon />

      <div className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 pt-6'>
        <div className='flex items-center gap-3'>
          <Link
            to='/'
            className='flex h-9 items-center gap-2 rounded-xl border border-[color:var(--tdz-ink)]/20 bg-white px-4 text-[13px] font-medium text-[var(--tdz-ink)] shadow-sm transition-colors hover:border-[color:var(--tdz-ink)]'
          >
            <ArrowLeft className='h-3.5 w-3.5' />
            {t('mk.auth.backHome')}
          </Link>
          <span className='hidden sm:block'>
            <BrandMark name={brandName} compact />
          </span>
        </div>
        <div className='flex items-center gap-3'>
          <LanguageMenu />
          <span className='tdz-mono hidden items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-[var(--tdz-body)] uppercase sm:flex'>
            <span className='tdz-pulse h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
            {t('mk.auth.gatewayOnline')}
          </span>
        </div>
      </div>

      <div className='mx-auto my-8 w-full max-w-5xl px-6'>
        <div className='relative'>
          <span className='tdz-notch top-[-11px] left-[calc(41.6667%_-_11px)] z-20 hidden lg:block' />
          <span className='tdz-notch bottom-[-11px] left-[calc(41.6667%_-_11px)] z-20 hidden lg:block' />

          <div className='grid grid-cols-1 overflow-hidden rounded-3xl border-2 border-[color:var(--tdz-ink)] bg-white shadow-[12px_12px_0px_0px_var(--tdz-shadow)] lg:grid-cols-12'>
            <PassportPreview
              mode={mode}
              email={mode === 'register' ? registerName.trim() : email.trim()}
              password={password}
              inviteCode={inviteCode}
              success={success}
            />

            <div className='flex flex-col justify-center p-8 lg:col-span-7 lg:p-12'>
              {success ? (
                <div className='tdz-rise'>
                  <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tdz-emerald)] text-white'>
                    <Check className='h-6 w-6' strokeWidth={3} />
                  </span>
                  <h3 className='mt-5 text-[26px] font-extrabold tracking-tight text-[var(--tdz-ink)]'>
                    {t(copy.successTitle)}
                  </h3>
                  <p className='mt-2 text-[14px] leading-relaxed text-[var(--tdz-body)]'>
                    {mode === 'register'
                      ? t('mk.auth.success.registerDesc', {
                          account: registerName.trim() || email.trim(),
                        })
                      : t('mk.auth.success.loginDesc')}
                  </p>
                  <div className='mt-7 flex flex-wrap items-center gap-3'>
                    <ArrowPillButton
                      onClick={() => {
                        if (mode === 'register') {
                          switchMode('login')
                          return
                        }
                        void navigate({ href: redirectTo ?? '/dashboard' })
                      }}
                      size='lg'
                    >
                      {mode === 'register'
                        ? t('mk.auth.success.goLogin')
                        : t('mk.auth.success.enterConsole')}
                    </ArrowPillButton>
                    <button
                      type='button'
                      onClick={() => void navigate({ to: '/' })}
                      className='h-12 rounded-full border-2 border-[color:var(--tdz-ink)] bg-white px-5 text-[14px] font-bold text-[var(--tdz-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--tdz-shadow)]'
                    >
                      {t('mk.auth.backHome')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {canRegister ? (
                    <div className='grid grid-cols-2 gap-1.5 rounded-2xl border border-[color:var(--tdz-line)] bg-[var(--tdz-canvas)] p-1.5'>
                      {(['login', 'register'] as AuthMode[]).map((item) => (
                        <button
                          key={item}
                          type='button'
                          onClick={() => switchMode(item)}
                          aria-pressed={mode === item}
                          className={cn(
                            'relative rounded-xl py-2.5 text-[13px] transition-colors',
                            mode === item
                              ? 'bg-[var(--tdz-ink)] font-bold text-white shadow-sm'
                              : 'font-medium text-[var(--tdz-body)] hover:text-[var(--tdz-ink)]'
                          )}
                        >
                          {t(FORM_COPY_KEYS[item].tab)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    // 后台关掉注册时不摆一个点不动的 Tab，直接单标题
                    <div className='rounded-2xl border border-[color:var(--tdz-line)] bg-[var(--tdz-canvas)] p-1.5'>
                      <div className='rounded-xl bg-[var(--tdz-ink)] py-2.5 text-center text-[13px] font-bold text-white'>
                        {t(FORM_COPY_KEYS.login.tab)}
                      </div>
                    </div>
                  )}

                  {registerBlocked && mode === 'register' && (
                    <p className='mt-6 rounded-xl border border-[color:var(--tdz-line)] bg-[var(--tdz-canvas)] p-4 text-[12px] leading-relaxed text-[var(--tdz-body)]'>
                      {t('mk.auth.registerClosed.before')}
                      <Link
                        to='/sign-in'
                        search={{ redirect: redirectTo }}
                        className='mx-1 font-semibold text-[var(--tdz-emerald-strong)] hover:underline'
                      >
                        {t('mk.auth.registerClosed.link')}
                      </Link>
                      {t('mk.auth.registerClosed.after')}
                    </p>
                  )}

                  {hasOAuth && (
                    <div className='mt-6'>
                      <OAuthBlock status={status} />
                    </div>
                  )}

                  {hasOAuth && (
                    <div className='mt-6 flex items-center gap-3'>
                      <span className='h-px flex-1 bg-[var(--tdz-line)]' />
                      <span className='tdz-mono text-[9.5px] tracking-[0.1em] text-[var(--tdz-muted)]'>
                        {t('mk.auth.oauthDivider')}
                      </span>
                      <span className='h-px flex-1 bg-[var(--tdz-line)]' />
                    </div>
                  )}

                  {!passwordLoginEnabled && (
                    <p className='mt-6 rounded-xl border border-[color:var(--tdz-line)] bg-[var(--tdz-canvas)] p-4 text-[12px] leading-relaxed text-[var(--tdz-body)]'>
                      {t('mk.auth.passwordDisabled')}
                    </p>
                  )}

                  {passwordLoginEnabled &&
                    !(registerBlocked && mode === 'register') && (
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className={cn('mt-5', shaking && 'tdz-shake')}
                    >
                    {mode === 'register' && (
                      <label className='block'>
                        <span className='mb-1.5 block text-[12px] font-semibold text-[var(--tdz-ink)]'>
                          {t('mk.auth.field.username')}
                        </span>
                        <span className='relative block'>
                          <UserRound className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--tdz-muted)]' />
                          <input
                            type='text'
                            value={registerName}
                            onChange={(event) => {
                              setRegisterName(event.target.value)
                              setErrors((prev) => ({
                                ...prev,
                                name: undefined,
                              }))
                            }}
                            placeholder={t('mk.auth.field.usernamePlaceholder')}
                            autoComplete='username'
                            data-invalid={Boolean(errors.name)}
                            className='tdz-field tdz-field-icon'
                          />
                        </span>
                        <FieldError message={errors.name} />
                      </label>
                    )}

                    <label
                      className={cn('block', mode === 'register' && 'mt-4')}
                    >
                      <span className='mb-1.5 block text-[12px] font-semibold text-[var(--tdz-ink)]'>
                        {mode === 'login'
                          ? t('mk.auth.field.account')
                          : t('mk.auth.field.email')}
                      </span>
                      <span className='relative block'>
                        <Mail className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--tdz-muted)]' />
                        <input
                          type={mode === 'login' ? 'text' : 'email'}
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value)
                            setErrors((prev) => ({ ...prev, email: undefined }))
                          }}
                          placeholder={
                            mode === 'login'
                              ? t('mk.auth.field.accountPlaceholder')
                              : t('mk.auth.field.emailPlaceholder')
                          }
                          autoComplete={
                            mode === 'login' ? 'username' : 'email'
                          }
                          data-invalid={Boolean(errors.email)}
                          className='tdz-field tdz-field-icon'
                        />
                      </span>
                      <FieldError message={errors.email} />
                    </label>

                    {mode === 'register' && emailVerificationEnabled && (
                      <label className='mt-4 block'>
                        <span className='mb-1.5 block text-[12px] font-semibold text-[var(--tdz-ink)]'>
                          {t('mk.auth.field.code')}
                        </span>
                        <span className='relative block'>
                          <KeyRound className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--tdz-muted)]' />
                          <input
                            type='text'
                            inputMode='numeric'
                            maxLength={6}
                            value={code}
                            onChange={(event) => {
                              setCode(event.target.value.replaceAll(/\D/g, ''))
                              setErrors((prev) => ({
                                ...prev,
                                code: undefined,
                              }))
                            }}
                            placeholder={t('mk.auth.field.codePlaceholder')}
                            autoComplete='one-time-code'
                            data-invalid={Boolean(errors.code)}
                            className='tdz-field tdz-field-icon tdz-field-action'
                          />
                          <SendCodeButton
                            active={codeCountdownActive}
                            countdown={secondsLeft}
                            sending={isSending}
                            onClick={() => void handleSendCode()}
                          />
                        </span>
                        <FieldError message={errors.code} />
                      </label>
                    )}

                    <label className='mt-4 block'>
                      <span className='mb-1.5 flex items-center justify-between gap-2'>
                        <span className='text-[12px] font-semibold text-[var(--tdz-ink)]'>
                          {t(passwordCopy.label)}
                        </span>
                        {mode === 'login' && (
                          <Link
                            to='/forgot-password'
                            className='text-[11px] font-medium text-[var(--tdz-emerald-strong)] hover:underline'
                          >
                            {t('mk.auth.field.forgot')}
                          </Link>
                        )}
                      </span>
                      <span className='relative block'>
                        <Lock className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--tdz-muted)]' />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value)
                            setErrors((prev) => ({
                              ...prev,
                              password: undefined,
                            }))
                          }}
                          placeholder={t(passwordCopy.placeholder)}
                          autoComplete={passwordCopy.autocomplete}
                          data-invalid={Boolean(errors.password)}
                          className='tdz-field tdz-field-icon tdz-field-eye'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword((value) => !value)}
                          aria-label={
                            showPassword
                              ? t('mk.auth.field.hidePassword')
                              : t('mk.auth.field.showPassword')
                          }
                          className='absolute top-1/2 right-3 -translate-y-1/2 text-[var(--tdz-muted)] transition-colors hover:text-[var(--tdz-ink)]'
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </span>
                      <FieldError message={errors.password} />
                    </label>

                    {mode === 'register' && (
                      <div className='mt-3'>
                        <StrengthMeter level={strength} />
                      </div>
                    )}

                    {mode === 'register' && (
                      <div className='mt-4 space-y-3'>
                        <div>
                          <button
                            type='button'
                            onClick={() => setInviteOpen((value) => !value)}
                            className='flex items-center gap-1 text-[12px] font-medium text-[var(--tdz-body)] transition-colors hover:text-[var(--tdz-ink)]'
                          >
                            {t('mk.auth.field.inviteToggle')}
                            <ChevronDown
                              className={cn(
                                'h-3.5 w-3.5 transition-transform',
                                inviteOpen && 'rotate-180'
                              )}
                            />
                          </button>
                          {inviteOpen && (
                            <div className='mt-2'>
                              <input
                                type='text'
                                value={inviteCode}
                                onChange={(event) =>
                                  setInviteCode(event.target.value)
                                }
                                placeholder={t('mk.auth.field.invitePlaceholder')}
                                className='tdz-field'
                              />
                            </div>
                          )}
                        </div>
                        {requiresLegalConsent && (
                          <>
                            <Checkbox
                              checked={agree}
                              onChange={(value) => {
                                setAgree(value)
                                setErrors((prev) => ({
                                  ...prev,
                                  agree: undefined,
                                }))
                              }}
                              label={
                                <>
                                  {t('mk.auth.field.agreePrefix')}
                                  {hasUserAgreement && (
                                    <button
                                      type='button'
                                      onClick={() => setLegalOpen('agreement')}
                                      className='mx-0.5 font-medium text-[var(--tdz-emerald-strong)] hover:underline'
                                    >
                                      {t('mk.auth.field.terms')}
                                    </button>
                                  )}
                                  {hasUserAgreement && hasPrivacyPolicy && (
                                    <>{t('mk.auth.field.agreeAnd')}</>
                                  )}
                                  {hasPrivacyPolicy && (
                                    <button
                                      type='button'
                                      onClick={() => setLegalOpen('privacy')}
                                      className='mx-0.5 font-medium text-[var(--tdz-emerald-strong)] hover:underline'
                                    >
                                      {t('mk.auth.field.privacy')}
                                    </button>
                                  )}
                                </>
                              }
                            />
                            <FieldError message={errors.agree} />
                          </>
                        )}
                      </div>
                    )}

                    {isTurnstileEnabled && (
                      <div className='mt-4 rounded-xl border border-[color:var(--tdz-line)] bg-[var(--tdz-canvas)] p-2.5'>
                        <div className='mb-1.5 flex items-center justify-between gap-2'>
                          <span className='tdz-mono text-[9.5px] font-bold tracking-[0.12em] text-[var(--tdz-muted)] uppercase'>
                            {t('mk.auth.turnstile.section')}
                          </span>
                          <button
                            type='button'
                            onClick={reloadTurnstile}
                            className='tdz-mono text-[9.5px] font-bold text-[var(--tdz-emerald-strong)] hover:underline'
                          >
                            {t('mk.auth.turnstile.reload')}
                          </button>
                        </div>
                        <div className='min-h-[65px]'>
                          <Turnstile
                            key={turnstileKey}
                            siteKey={turnstileSiteKey}
                            onVerify={(token) => {
                              setTurnstileToken(token)
                              setErrors((prev) => ({
                                ...prev,
                                turnstile: undefined,
                              }))
                            }}
                            onExpire={() => setTurnstileToken('')}
                          />
                        </div>
                        <p
                          className={cn(
                            'mt-1',
                            turnstileHint.tone === 'warn'
                              ? 'text-[10.5px] leading-relaxed text-[var(--tdz-orange)]'
                              : 'tdz-mono text-[9.5px] tracking-[0.08em] text-[var(--tdz-muted)] uppercase'
                          )}
                        >
                          {turnstileHint.text}
                        </p>
                        <FieldError message={errors.turnstile} />
                      </div>
                    )}

                    {formError && (
                      <p className='mt-4 flex items-start gap-2 rounded-xl border border-[color:var(--tdz-orange)]/40 bg-[var(--tdz-orange-soft)] px-3 py-2 text-[12px] leading-relaxed text-[var(--tdz-orange-ink)]'>
                        <AlertCircle className='mt-[1px] h-3.5 w-3.5 shrink-0' />
                        {formError}
                      </p>
                    )}

                    <ArrowPillButton
                      type='submit'
                      full
                      size='lg'
                      disabled={submitting}
                      className='mt-6'
                    >
                      {submitting ? (
                        <span className='flex items-center gap-2'>
                          <Loader2 className='h-4 w-4 animate-spin' />
                          {t(copy.loading)}
                        </span>
                      ) : (
                        t(copy.submit)
                      )}
                    </ArrowPillButton>

                  </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {legalOpen && (
        <LegalDialog kind={legalOpen} onClose={() => setLegalOpen(null)} />
      )}

      <div className='mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 pt-2 pb-6 text-[11px] text-[var(--tdz-muted)] sm:flex-row'>
        <span className='tdz-mono tracking-[0.06em]'>
          {brandName} · {t('mk.auth.footer.gateway')}
        </span>
        <span className='tdz-mono flex items-center gap-1.5 tracking-[0.06em]'>
          <span className='h-1.5 w-1.5 rounded-full bg-[var(--tdz-emerald)]' />
          {t('mk.auth.footer.online')}
        </span>
      </div>
    </div>
  )
}
