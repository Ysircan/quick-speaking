'use client'

import Link from 'next/link'
import styles from '@/app/store/Store.module.css'

interface SkillCardProps {
  href: string
  title: string
  caption: string
}

export default function SkillCard({ href, title, caption }: SkillCardProps) {
  return (
    <Link className={styles.card} href={href} aria-label={`Open ${title}`}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardCaption}>{caption}</p>
    </Link>
  )
}
