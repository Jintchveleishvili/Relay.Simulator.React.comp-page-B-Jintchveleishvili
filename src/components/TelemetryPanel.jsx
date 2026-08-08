import React from 'react';

export default function TelemetryPanel({ telemetry }) {
  return (
    <div className="bg-[#0b0b12] rounded p-[8px] border border-[#313244]">
      <h3 className="m-0 text-[11px] text-[#89b4fa] font-bold border-b border-[#313244] pb-[4px] mb-[6px] flex items-center justify-between">
        <span>📡 SCADA ტელემეტრია & ავარიის მონაცემები</span>
        <span className="text-[9px] px-[4px] py-[1px] rounded bg-[#1e1e2e]" style={{ color: telemetry.modeColor }}>{telemetry.modeVal}</span>
      </h3>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 font-mono text-[9px]">
        <div className="bg-[#161622] p-[4px] rounded border border-[#222330]">
          <span className="text-[#a6adc8] block">🛡️ აქტიური დაცვა:</span>
          <span className="text-[#fab387] font-bold">{telemetry.activeProtection}</span>
        </div>
        <div className="bg-[#161622] p-[4px] rounded border border-[#222330]">
          <span className="text-[#a6adc8] block">📋 ავარიის ტიპი:</span>
          <span className="text-[#cdd6f4] font-bold">{telemetry.faultTypeVal}</span>
        </div>
        <div className="bg-[#161622] p-[4px] rounded border border-[#222330]">
          <span className="text-[#a6adc8] block">💥 ავარიის დენი (I_f):</span>
          <span className="text-[#f38ba8] font-bold">{telemetry.faultCurrentVal}</span>
        </div>
        <div className="bg-[#161622] p-[4px] rounded border border-[#222330]">
          <span className="text-[#a6adc8] block">📉 ავარიული ძაბვა:</span>
          <span className="text-[#f9e2af] font-bold">{telemetry.faultVoltageVal}</span>
        </div>
        <div className="bg-[#161622] p-[4px] rounded border border-[#222330]">
          <span className="text-[#a6adc8] block">⏱️ გამორთვის დრო:</span>
          <span className="text-[#a6e3a1] font-bold">{telemetry.tripTimeVal}</span>
        </div>
        <div className="bg-[#161622] p-[4px] rounded border border-[#222330]">
          <span className="text-[#a6adc8] block">📍 ავარიის მანძილი:</span>
          <span className="text-[#89b4fa] font-bold">{telemetry.faultDistanceVal}</span>
        </div>
        <div className="bg-[#161622] p-[4px] rounded border border-[#222330]">
          <span className="text-[#a6adc8] block">🌀 ნულოვანი დენი (I_0):</span>
          <span className="text-[#cdd6f4] font-bold">{telemetry.zeroSeqVal}</span>
        </div>
        <div className="bg-[#161622] p-[4px] rounded border border-[#222330]">
          <span className="text-[#a6adc8] block">📁 COMTRADE ჩანაწერი:</span>
          <span className="text-[#b4befe] font-bold">{telemetry.comtradeVal}</span>
        </div>
      </div>
    </div>
  );
}