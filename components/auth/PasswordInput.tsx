'use client'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
}

export default function PasswordInput({ value, onChange }: PasswordInputProps) {
  return (
    <input
       type="text"
  placeholder="Password
"
  className="w-full px-4 py-3 rounded-xl bg-white text-gray-700 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
