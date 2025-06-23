interface AuthTabSwitcherProps {
  activeTab: 'login' | 'register'
  onTabChange: (tab: 'login' | 'register') => void
}

export default function AuthTabSwitcher({
  activeTab,
  onTabChange,
}: AuthTabSwitcherProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-yellow-50 p-1 rounded-full flex space-x-2">
        {['login', 'register'].map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab as 'login' | 'register')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all border-2 ${
                isActive
                  ? 'bg-white text-[#a16207] border-black shadow'
                  : 'bg-transparent text-[#5a3e1b] border-transparent hover:text-[#a16207]'
              }`}
            >
              {tab === 'login' ? 'Sign In' : 'Register'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
