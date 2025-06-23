'use client'

interface NameInputProps {
  value: string
  onChange: (value: string) => void
}

export default function NameInput({ value, onChange }: NameInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Your name"
      className="w-full px-4 py-2 rounded-lg bg-white text-black placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
    />
  )
}
