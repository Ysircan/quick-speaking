'use client'

import { useState } from 'react'
import UnlockModeSelector, { UnlockModeType } from './UnlockModeSelector'
import ModuleMultiSelector, { ModuleType } from './ModuleTypeSelector'
import SettingSummary from './SettingSummaryPanel'

interface TopSettingPanelProps {
  trackId: string
  dayId: string
  dayIndex: number
}

export default function TopSettingPanel({
  trackId,
  dayId,
  dayIndex,
}: TopSettingPanelProps) {
  const [unlockMode, setUnlockMode] = useState<UnlockModeType>('DAILY')
  const [moduleTypes, setModuleTypes] = useState<ModuleType[]>([])
  const [isEditing, setIsEditing] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!unlockMode || moduleTypes.length === 0) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')

      // Save unlock mode
      await fetch(`/api/create/track/content/day/${dayId}/unlock-mode`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ unlockMode }),
      })

      // Create group(s) for each selected module type
      for (const type of moduleTypes) {
        await fetch(`/api/create/track/content/group`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            trackId,
            dayIndex,
            type,
          }),
        })
      }

      setIsEditing(false)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-40">
      <div
        className="px-6 py-3 rounded-full 
        bg-gradient-to-r from-white/10 via-white/5 to-white/10 
        backdrop-blur-md border border-white/10 
        shadow-lg flex items-center gap-4"
      >
        {isEditing ? (
          <>
            <UnlockModeSelector
              value={unlockMode}
              onChange={setUnlockMode}
              disabled={loading}
            />
            <ModuleMultiSelector
              value={moduleTypes}
              onChange={setModuleTypes}
              disabled={loading}
            />
            <button
              onClick={handleSave}
              disabled={loading || moduleTypes.length === 0}
              className="px-4 py-1.5 text-sm rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 hover:scale-105 transition-transform shadow"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <SettingSummary
            unlockMode={unlockMode}
            moduleTypes={moduleTypes}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  )
}
