'use client'

import { ReactNode, useState } from 'react'

interface SubmitButtonProps {
  onClick: () => Promise<void> | void  // 支持异步操作
  loading?: boolean
  children: ReactNode
}

export default function SubmitButton({
  onClick,
  loading = false,
  children,
}: SubmitButtonProps) {
  const [clicked, setClicked] = useState(false)

  const handleClick = async () => {
    if (clicked || loading) return
    setClicked(true)
    try {
      await onClick()
    } finally {
      setClicked(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={clicked || loading}
      className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out border-2
        ${
          clicked || loading
            ? 'bg-white text-[#a16207] border-black opacity-60 cursor-not-allowed'
            : 'bg-white text-[#a16207] border-black shadow hover:shadow-md hover:brightness-105 active:scale-95'
        }`}
    >
      {loading || clicked ? 'Loading...' : children}
    </button>
  )
}
