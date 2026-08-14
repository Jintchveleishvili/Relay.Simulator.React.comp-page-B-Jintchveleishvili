import React from 'react';

export default function OscillogramChart({ eventData }) {
  if (!eventData) return null;

  const {
    fileName = "",
    timeStr = "",
    relayModel = "",
    eventType = "",
    targets = "",
    connectionType = "ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი",
    ia = 0,
    ib = 0,
    ic = 0,
    ig = 0,
    va = 5.8,
    vb = 5.8,
    vc = 5.8,
    faultType = "",
    is3Phase = false,
    isAR = false
  } = eventData;

  // ტალღის გენერაციის ფუნქცია
  const generateTimelinePath = (type, phase) => {
    const width = 500;
    const height = 80;
    const midY = height / 2;
    const points = [];
    const steps = 200;

    let phaseShift = 0;
    if (phase === 'B') phaseShift = (2 * Math.PI) / 3;
    if (phase === 'C') phaseShift = (4 * Math.PI) / 3;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const ratio = i / steps;

      let currentAmp = 0;

      if (isAR) {
        // --- აგჩ-ს (AR) სცენარი ---
        if (ratio < 0.35) {
          if (type === 'I') {
            currentAmp = phase === 'A' ? 30 : 6;
          } else {
            currentAmp = phase === 'A' ? 5 : 25;
          }
        } else if (ratio >= 0.35 && ratio < 0.70) {
          // უძაბო პაუზა ➔ 0!
          currentAmp = 0;
        } else {
          // აგჩ-მ ჩართო
          currentAmp = type === 'I' ? 6 : 25;
        }
      } else if (is3Phase) {
        // --- სამფაზა მოკლე შერწყმის (3PH) სცენარი ---
        if (ratio < 0.35) {
          currentAmp = type === 'I' ? 6 : 25;
        } else if (ratio >= 0.35 && ratio < 0.75) {
          if (type === 'I') {
            currentAmp = 32; 
          } else {
            currentAmp = 0; // ძაბვა ეცემა 0-მდე!
          }
        } else {
          currentAmp = 0;
        }
      } else {
        // --- სტანდარტული ავარია ---
        if (ratio < 0.35) {
          currentAmp = type === 'I' ? 6 : 25;
        } else if (ratio >= 0.35 && ratio < 0.75) {
          if (type === 'I') {
            currentAmp = phase === 'A' ? 32 : 6;
          } else {
            currentAmp = phase === 'A' ? 5 : 25;
          }
        } else {
          currentAmp = 0;
        }
      }

      const y = midY - currentAmp * Math.sin((x / 15) + phaseShift);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="bg-[#111116] border border-[#272738] rounded-lg p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-white">
      
      {/* მარცხენა მხარე: ოსცილოგრამები */}
      <div className="lg:col-span-2 space-y-3">
        
        {/* ქსელის პარამეტრების ბანერი */}
        <div className="bg-[#181825] border border-[#313244] px-3 py-2 rounded flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <span className="text-[#89b4fa] font-bold">⚡ ქსელის პარამეტრები:</span>
          <span className="text-[#a6e3a1] font-bold bg-[#111116] px-2 py-1 rounded border border-[#313244]">
            🔗 {connectionType}
          </span>
        </div>

        {/* დენების გრაფიკი */}
        <div className="bg-[#181825] border border-[#313244] rounded p-3 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#f38ba8]">⚡ Analog Currents (A)</span>
            <div className="text-[11px] space-x-3 font-mono">
              <span className="text-[#f38ba8]">IA: {ia} A</span>
              <span className="text-[#a6e3a1]">IB: {ib} A</span>
              <span className="text-[#89b4fa]">IC: {ic} A</span>
              <span className="text-[#f9e2af]">3I0 (IG): {ig} A</span>
            </div>
          </div>

          <svg viewBox="0 0 500 80" className="w-full h-24 overflow-visible">
            <line x1="0" y1="40" x2="500" y2="40" stroke="#45475a" strokeDasharray="2,2" />
            
            <path d={generateTimelinePath('I', 'A')} fill="none" stroke="#f38ba8" strokeWidth="1.5" />
            <path d={generateTimelinePath('I', 'B')} fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
            <path d={generateTimelinePath('I', 'C')} fill="none" stroke="#89b4fa" strokeWidth="1.5" />

            {isAR && (
              <>
                <line x1="175" y1="0" x2="175" y2="80" stroke="#f38ba8" strokeDasharray="3,3" strokeWidth="1.5" />
                <text x="177" y="15" fill="#f38ba8" fontSize="9" fontWeight="bold">1-ლი TRIP (გამოირთო)</text>

                <line x1="350" y1="0" x2="350" y2="80" stroke="#a6e3a1" strokeDasharray="3,3" strokeWidth="1.5" />
                <text x="352" y="15" fill="#a6e3a1" fontSize="9" fontWeight="bold">აგჩ-მ ჩართო (AR OK)</text>
              </>
            )}
          </svg>
        </div>

        {/* ძაბვების გრაფიკი */}
        <div className="bg-[#181825] border border-[#313244] rounded p-3 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#89b4fa]">📉 Analog Voltages (kV Ph-G)</span>
            <div className="text-[11px] space-x-3 font-mono">
              <span className="text-[#f38ba8]">VA: {va} kV</span>
              <span className="text-[#a6e3a1]">VB: {vb} kV</span>
              <span className="text-[#89b4fa]">VC: {vc} kV</span>
            </div>
          </div>

          <svg viewBox="0 0 500 80" className="w-full h-24 overflow-visible">
            <line x1="0" y1="40" x2="500" y2="40" stroke="#45475a" strokeDasharray="2,2" />

            <path d={generateTimelinePath('V', 'A')} fill="none" stroke="#f38ba8" strokeWidth="1.5" />
            <path d={generateTimelinePath('V', 'B')} fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
            <path d={generateTimelinePath('V', 'C')} fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ციფრული სიგნალები */}
        <div className="bg-[#181825] border border-[#313244] rounded p-3">
          <span className="text-xs font-bold text-[#f9e2af] block mb-2">🚦 Digital Relay Signals (TRIP / AR 79)</span>
          
          <div className="space-y-2 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="w-12 text-[#f38ba8] font-bold">TRIP</span>
              <div className="flex-1 h-3 bg-[#313244] rounded relative overflow-hidden">
                <div 
                  className="h-full bg-[#f38ba8]" 
                  style={{ 
                    left: '35%', 
                    width: isAR ? '35%' : '40%', 
                    position: 'absolute' 
                  }} 
                />
              </div>
            </div>

            {isAR && (
              <div className="flex items-center gap-2">
                <span className="w-12 text-[#a6e3a1] font-bold">79 AR</span>
                <div className="flex-1 h-3 bg-[#313244] rounded relative overflow-hidden">
                  <div 
                    className="h-full bg-[#a6e3a1]" 
                    style={{ left: '35%', width: '65%', position: 'absolute' }} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* მარჯვენა მხარე: დეტალების პანელი */}
      <div className="bg-[#181825] border border-[#313244] rounded p-3 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#313244]">
            <span className="text-xs font-bold text-[#89b4fa]">📊 SynchroWAVE Event</span>
            <span className="text-[10px] bg-[#f38ba8]/20 text-[#f38ba8] px-2 py-0.5 rounded font-bold border border-[#f38ba8]/30">
              {eventType}
            </span>
          </div>

          <div className="text-[11px] space-y-1 text-[#a6adc8]">
            <p><strong className="text-[#cdd6f4]">File:</strong> {fileName}</p>
            <p><strong className="text-[#cdd6f4]">Time:</strong> {timeStr}</p>
            <p><strong className="text-[#cdd6f4]">FID:</strong> {relayModel}</p>
          </div>

          <div className="mt-3 pt-2 border-t border-[#313244]">
            <span className="text-xs font-bold text-[#f9e2af] block mb-1">🎯 Targets / Signals:</span>
            <span className="text-[10px] text-[#a6e3a1] font-mono bg-[#111116] p-1.5 rounded block border border-[#313244]">
              {targets}
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-[#313244] text-[11px]">
            <span className="text-xs font-bold text-[#89b4fa] block mb-1">⚡ Primary Measured Values:</span>
            <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
              <div>IA: <span className="text-[#f38ba8]">{ia} A</span></div>
              <div>VA: <span className="text-[#f38ba8]">{va} kV</span></div>
              <div>IB: <span className="text-[#a6e3a1]">{ib} A</span></div>
              <div>VB: <span className="text-[#a6e3a1]">{vb} kV</span></div>
              <div>IC: <span className="text-[#89b4fa]">{ic} A</span></div>
              <div>VC: <span className="text-[#89b4fa]">{vc} kV</span></div>
            </div>
            <div className="mt-1 pt-1 border-t border-[#313244]/50 text-center font-mono text-[10px]">
              3I0 (IG): <span className="text-[#f9e2af]">{ig} A</span>
            </div>
          </div>
        </div>

        <div className="bg-[#f38ba8]/10 border border-[#f38ba8]/30 p-2 rounded text-[#f38ba8]">
          <span className="font-bold text-[11px] block">📝 ანალიზის დასკვნა:</span>
          <p className="text-[10px] mt-1 leading-relaxed text-[#cdd6f4]">{faultType}</p>
        </div>
      </div>

    </div>
  );
}