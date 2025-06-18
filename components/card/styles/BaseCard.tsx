'use client'

import React from 'react'

interface BaseCardProps {
  onClick?: () => void
   icon?: React.ReactNode
  label?: string
  mediaUrl?: string // ← 用于渲染背景图或边框图层
  rarity?: string   // ← 控制边框颜色、阴影等
  variant?: 'default' | 'gold' | 'silver'
}

const variantStyles = {
  default: {
    border: 'border-cyan-400',
    shadow:
      'shadow-[0_0_12px_rgba(0,204,255,0.33)] hover:shadow-[0_0_20px_rgba(0,204,255,0.66),_inset_0_0_30px_rgba(0,204,255,0.33)]',
  },
  gold: {
    border: 'border-yellow-400',
    shadow:
      'shadow-[0_0_12px_rgba(255,215,0,0.33)] hover:shadow-[0_0_20px_rgba(255,215,0,0.66),_inset_0_0_30px_rgba(255,215,0,0.33)]',
  },
silver: {
  border: 'border-red-500',
  shadow:
    'shadow-[0_0_12px_rgba(255,0,0,0.33)] hover:shadow-[0_0_20px_rgba(255,0,0,0.66),_inset_0_0_30px_rgba(255,0,0,0.33)]',
},


}

const BaseCard: React.FC<BaseCardProps> = ({ onClick, icon, label, variant = 'default' }) => {
  const style = variantStyles[variant]

  return (
    <div
      onClick={onClick}
      className={`w-52 h-72 p-0.5 rounded-2xl border ${style.border} 
        ${style.shadow} hover:scale-105 hover:rotate-[1deg] 
        transition-transform duration-300 ease-in-out cursor-pointer`}
    >
      <div className="w-full h-full rounded-2xl border-[3px] border-black bg-white flex flex-col items-center justify-center text-black font-semibold text-xl space-y-2">
        <div>{icon}</div>
        <div>{label}</div>
      </div>
    </div>
  )
}

export default BaseCard
