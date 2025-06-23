'use client'

interface RoleSwitcherProps {
  value: 'PARTICIPANT' | 'CREATOR'
  onChange: (val: 'PARTICIPANT' | 'CREATOR') => void
}

export default function RoleSwitcher({ value, onChange }: RoleSwitcherProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-yellow-50 p-1 rounded-full flex space-x-2">
        {['PARTICIPANT', 'CREATOR'].map((role) => {
          const isActive = value === role
          return (
            <button
              key={role}
              onClick={() => onChange(role as 'PARTICIPANT' | 'CREATOR')}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all border-2 ${
                isActive
                  ? 'bg-white text-[#a16207] border-black shadow'
                  : 'bg-transparent text-[#5a3e1b] border-transparent hover:text-[#a16207]'
              }`}
            >
              {role === 'CREATOR' ? 'Creator' : 'Participant'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
