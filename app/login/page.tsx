'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      return setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="login-page">

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          ⚙
        </div>

        {/* Title */}
        <h1 className="login-title">
          Machine Maintenance
        </h1>

        <p className="login-subtitle">
          ระบบจัดการและติดตามการบำรุงรักษาเครื่องจักร
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">

          {/* Email */}
          <div className="login-field">
            <label htmlFor="email">
              อีเมล
            </label>

            <input
              id="email"
              type="email"
              required
              placeholder="admin@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="password">
              รหัสผ่าน
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input password-input"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'ซ่อน' : 'แสดง'}
              </button>

            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span>⚠</span>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <>
                <span className="login-spinner" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="login-footer">
          <span>Machine Maintenance System</span>
          <span>•</span>
          <span>2026</span>
        </div>

      </div>

    </main>
  )
}