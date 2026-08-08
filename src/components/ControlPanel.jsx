import React from 'react';

export default function ControlPanel({ systemSettings, handleInputChange, X_sys_110, recalculateSystem }) {
  return (
    <div className="bg-[#161622] p-[12px] rounded-[6px] mb-[10px] border border-[#313244] shadow-md flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-3 items-center">
        <div className="flex items-center justify-between gap-2">
          <label className="text-[#cdd6f4] text-[11px] whitespace-nowrap">🛣️ 110კვ ხაზი (კმ):</label>
          <input type="number" name="lineLength" value={systemSettings.lineLength} onChange={handleInputChange} className="w-[70px] bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] p-[3px_6px] rounded text-center text-[11px]" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-[#cdd6f4] text-[11px] whitespace-nowrap">🌀 AT-2 სიმძლავრე (MVA):</label>
          <input type="number" name="at2Nominal" value={systemSettings.at2Nominal} onChange={handleInputChange} className="w-[70px] bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] p-[3px_6px] rounded text-center text-[11px]" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-[#cdd6f4] text-[11px] whitespace-nowrap">⚡ T-2 სიმძლავრე (MVA):</label>
          <input type="number" name="t2Nominal" value={systemSettings.t2Nominal} onChange={handleInputChange} className="w-[70px] bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] p-[3px_6px] rounded text-center text-[11px]" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-[#cdd6f4] text-[11px] whitespace-nowrap">🏙️ 10კვ საქალაქო (კმ):</label>
          <input type="number" name="lineLength10" value={systemSettings.lineLength10} onChange={handleInputChange} className="w-[70px] bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] p-[3px_6px] rounded text-center text-[11px]" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-[#cdd6f4] text-[11px] whitespace-nowrap">🌀 AT-1 სიმძლავრე (MVA):</label>
          <input type="number" name="at1Nominal" value={systemSettings.at1Nominal} onChange={handleInputChange} className="w-[70px] bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] p-[3px_6px] rounded text-center text-[11px]" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-[#cdd6f4] text-[11px] whitespace-nowrap">⚡ T-1 სიმძლავრე (MVA):</label>
          <input type="number" name="t1Nominal" value={systemSettings.t1Nominal} onChange={handleInputChange} className="w-[70px] bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] p-[3px_6px] rounded text-center text-[11px]" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-[#cdd6f4] text-[11px] whitespace-nowrap">🏭 35კვ ხაზი (კმ):</label>
          <input type="number" name="lineLength35" value={systemSettings.lineLength35} onChange={handleInputChange} className="w-[70px] bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] p-[3px_6px] rounded text-center text-[11px]" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-[#cdd6f4] text-[11px] whitespace-nowrap">📐 10კვ რეგიონული (კმ):</label>
          <input type="number" name="lineLengthRegional10" value={systemSettings.lineLengthRegional10} onChange={handleInputChange} className="w-[70px] bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] p-[3px_6px] rounded text-center text-[11px]" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-[10px] font-mono text-[#a6adc8]">🌐 ექვივალენტური გენერაცია: <b>2000 MW</b> | X_sys(110kV) = <b>{X_sys_110.toFixed(2)} Ω</b></span>
        <button 
          onClick={recalculateSystem} 
          className="cursor-pointer bg-[#89b4fa] text-[#11111b] border-none px-6 py-1.5 rounded-[4px] font-bold text-[11px] hover:bg-[#74c7ec] transition-colors flex items-center gap-1 shadow"
        >
          📊 გადაანგარიშება
        </button>
      </div>
    </div>
  );
}