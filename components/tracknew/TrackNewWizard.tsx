'use client'

import { useState } from 'react'
import { steps } from './steps'
import StepCard from './StepCard'
import SuccessPanel from './SuccessPanel'

interface TrackFormData {
  title: string
  description: string
  durationDays: number
}

export default function TrackNewWizard({ onStepChange }: { onStepChange?: (step: number) => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState<Partial<TrackFormData>>({})
  const [successId, setSuccessId] = useState<string | null>(null)

  const currentStep = steps[stepIndex]

  const handleNext = async () => {
    if (stepIndex === steps.length - 1) {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/create/track/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessId(data.trackId)
      } else {
        alert(`❌ Failed: ${data.error || 'Unknown error'}`)
      }
      return
    }

    setStepIndex((prev) => prev + 1)
    onStepChange?.(stepIndex + 1)
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1)
      onStepChange?.(stepIndex - 1)
    }
  }

  const handleChange = (value: string | number) => {
    const key = currentStep.key
    if (!key) return

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const value = currentStep.key && ['title', 'description', 'durationDays'].includes(currentStep.key)
    ? formData[currentStep.key as keyof TrackFormData]
    : undefined

  if (successId) {
    return <SuccessPanel trackId={successId} />
  }

  return (
    <StepCard
      step={currentStep}
      value={value}
      onChange={handleChange}
      onNext={handleNext}
      onBack={stepIndex > 0 ? handleBack : undefined}
    />
  )
}
