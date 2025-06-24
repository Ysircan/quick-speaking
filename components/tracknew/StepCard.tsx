'use client'

import { steps } from './steps'

interface Step {
  type: string
  title: string
  subtitle?: string
  key?: string
  placeholder?: string
}

interface StepCardProps {
  step: Step
  value?: string | number
  onChange?: (value: string | number) => void
  onNext: () => void
  onBack?: () => void
}

export default function StepCard({ step, value, onChange, onNext, onBack }: StepCardProps) {
  return (
    <div className="w-full max-w-xl bg-white/90 text-black p-8 rounded-2xl shadow-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
      {step.subtitle && <p className="text-gray-600 mb-6">{step.subtitle}</p>}

      {step.type === 'text' && (
        <input
          type="text"
          value={value || ''}
          placeholder={step.placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}

      {step.type === 'number' && (
        <input
          type="number"
          value={value || ''}
          placeholder={step.placeholder}
          onChange={(e) => onChange?.(parseInt(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}

      {step.type === 'submit' && (
        <p className="text-center text-gray-600 mb-6">Ready to launch your training camp!</p>
      )}

      <div className="flex justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Back
          </button>
        ) : <div />}

        <button
          onClick={onNext}
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition"
        >
          {step.type === 'submit' ? 'Create' : 'Next'}
        </button>
      </div>
    </div>
  )
}
