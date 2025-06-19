// File: D:\quick\app\store\page.tsx
'use client'

import StoreShell from '@/components/store/layout/StoreShell'
import TrackGrid from '@/components/store/home/TrackGrid'

export default function StorePage() {
  return (
    <StoreShell>
      <TrackGrid />
    </StoreShell>
  )
}