'use client'

import { ReactNode } from 'react'
import styles from '@/app/store/Store.module.css'

interface CorePanelProps {
  heading: string
  children: ReactNode
}

export default function CorePanel({ heading, children }: CorePanelProps) {
  return (
    <section className={styles.panel} aria-label={heading}>
      <div className={styles.panelHead}>{heading}</div>
      <div>{children}</div>
    </section>
  )
}
