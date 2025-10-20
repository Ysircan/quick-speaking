'use client';

import useUser from '@/hooks/useUser';
import styles from '@/app/store/Store.module.css';

export default function WelcomeHeader() {
  const { user, loading } = useUser();
  if (loading) {
    return (
      <div className={styles.header}>
        <h1 className={styles.title}>Loading...</h1>
      </div>
    );
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'Student';
  const initial = displayName[0]?.toUpperCase() || 'U';

  return (
    <header className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>👋 Welcome back, {displayName}</h1>
        <p className={styles.subtitle}>
          Continue your PTE practice — stay consistent, stay confident.
        </p>
      </div>

      {/* 右侧：BETA + 头像首字母 */}
      <div className={styles.headerRight}>
        <span className={styles.beta}>BETA</span>
        <div className={styles.profileCircle}>{initial}</div>
      </div>
    </header>
  );
}
