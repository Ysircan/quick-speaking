'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useUser from '@/hooks/useUser'
import styles from '@/app/store/Store.module.css'

export default function WelcomeHeader() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // ✅ 点击空白处自动关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 检查 ref 是否存在并且点击目标不在菜单内
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    // 绑定事件
    document.addEventListener('mousedown', handleClickOutside)
    // 卸载事件
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ✅ 登出逻辑
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (_) {
      // 忽略请求错误
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/auth/login')
  }

  if (loading) {
    return (
      <div className={styles.header}>
        <h1 className={styles.title}>Loading...</h1>
      </div>
    )
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'Student'
  const initial = displayName[0]?.toUpperCase() || 'U'

  return (
    <header className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>👋 Welcome back, {displayName.toUpperCase()}</h1>
        <p className={styles.subtitle}>
          Continue your PTE practice — stay consistent, stay confident.
        </p>
      </div>

{/* 右侧：BETA + 头像 + 菜单（锚定在头像上） */}
<div className={styles.headerRight}>
  <span className={styles.beta}>BETA</span>

  {/* 使用相对定位的容器包住头像和菜单，菜单就不会飞了 */}
  <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
    {/* 头像按钮 */}
    <div
      className={styles.profileCircle}
      onClick={() => setMenuOpen(v => !v)}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      title="Profile menu"
    >
      {initial}
    </div>

    {/* 下拉菜单：相对于上面的容器定位 */}
    {menuOpen && (
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)', // 紧贴头像下方 8px
          right: 0,
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          width: 180,
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            fontSize: '0.9rem',
            color: '#333',
            borderBottom: '1px solid #f0f0f0',
            maxWidth: 180,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={user?.email || ''}
        >
          {user?.email}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '10px 14px',
            fontSize: '0.9rem',
            color: '#d32f2f',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
           Logout
        </button>
      </div>
    )}
  </div>
</div>

    </header>
  )
}
