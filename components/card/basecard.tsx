'use client';

import React from 'react';

interface BaseCardProps {
  icon?: React.ReactNode;
  label?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  icon = '🤖',
  label = 'Your Card',
}) => {
  return (
    <div className="w-52 h-72 p-0.5 rounded-2xl border border-cyan-400 shadow-[0_0_12px_rgba(0,204,255,0.33)] hover:scale-105 hover:rotate-[1deg] hover:shadow-[0_0_20px_rgba(0,204,255,0.66),_inset_0_0_30px_rgba(0,204,255,0.33)] transition-transform duration-300 ease-in-out">
      <div className="w-full h-full rounded-2xl border-[3px] border-black bg-white flex items-center justify-center">
        <div className="text-center text-black font-sans">
          <div className="text-6xl mb-3">{icon}</div>
          <div className="text-lg font-bold text-gray-800">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseCard;
