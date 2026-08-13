import React from 'react';

export default function RelayInfoCard({ title, model, ansi, description, formulaTitle, formula, example }) {
  return (
    <div className="bg-[#1e1e2e] border border-[#313244] rounded-lg p-4 shadow-md flex flex-col justify-between hover:border-[#89b4fa] transition-all">
      <div>
        <div className="flex justify-between items-center mb-2 border-b border-[#313244] pb-2">
          <h3 className="text-[#89b4fa] text-[16px] font-bold m-0">{title}</h3>
          <span className="bg-[#f38ba8] text-[#11111b] text-[11px] font-bold px-2 py-0.5 rounded">
            {model}
          </span>
        </div>
        
        <p className="text-[#a6e3a1] text-[12px] font-mono mb-2">
          <strong>ANSI კოდები:</strong> {ansi}
        </p>

        <p className="text-[#cdd6f4] text-[13px] leading-relaxed mb-3">
          {description}
        </p>
      </div>

      <div className="bg-[#181825] p-3 rounded border border-[#45475a] mt-2">
        <span className="text-[#f9e2af] text-[11px] font-bold block mb-1">
          📐 {formulaTitle}:
        </span>
        <code className="text-[#89dceb] text-[12px] font-mono block mb-1">
          {formula}
        </code>
        {example && (
          <span className="text-[#a6adc8] text-[11px] block italic border-t border-[#313244] pt-1 mt-1">
            💡 {example}
          </span>
        )}
      </div>
    </div>
  );
}