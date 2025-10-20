'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'
import SubmitButton from './SubmitButton'

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data?.ok) {
        setError(data?.message || data?.error || 'Login failed')
        return
      }

      // 保存 token
      localStorage.setItem('token', data.token)

      // 成功：优先走父组件回调，否则兜底跳 /store
      if (onSuccess) onSuccess()
      else router.push('/store')
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <EmailInput value={email} onChange={setEmail} />
      <PasswordInput value={password} onChange={setPassword} />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <SubmitButton onClick={handleLogin} loading={loading}>
        Sign In
      </SubmitButton>
    </div>
  )
}
