'use client'

import { ReactNode } from 'react'
import styles from '@/app/store/Store.module.css'

interface StoreGridProps {
  children: ReactNode
}

export default function StoreGrid({ children }: StoreGridProps) {
  return (
    <main className={styles.grid} aria-label="Skill entries">
      {children}
    </main>
  )
}
