import React from 'react';

export default function SubstationSchema({ gridRef, nodeRefs, statuses, calcData, sparkPos }) {
  const {
    hasVoltage220, hasVoltageBus1, hasVoltageBus2,
    lineACurrentVal, t1_10_city, t1_10_reg, t2_35_factory, t2_6_motor,
    t1_LV_TotalCurrent, t1_110_Current, t2_110_Current,
    at1_110_Current, at2_110_Current, at1_220_Current, at2_220_Current,
    line220_Current
  } = calcData;

  // 110კვ სექციურ ამომრთველზე ნაკადის მიმართულების დათვლა:
  // - თუ AT-2 გაითიშა -> I სექცია კვებავს II სექციას (მიმართულება: მარცხნიდან მარჯვნივ -> BUS1 -> BUS2)
  // - თუ 110კვ "მაგისტრალი ა" გაითიშა -> II სექციაზე მეტი ტვირთი რჩება, შესაბამისად II სექცია გადასცემს I-ს ან პირიქით
  // იანგარიშება Bus1-ის და Bus2-ის წმინდა ბალანსი:
  const bus1NetSupply = at1_110_Current - (lineACurrentVal + t1_110_Current);
  
  // flowToBus1 = true ნიშნავს, რომ დენი მიდის II სექციიდან I სექციისკენ (მარჯვნიდან მარცხნივ)
  const flowToBus1 = bus1NetSupply < 0 && (statuses.AT2 && hasVoltageBus2);

  return (
    <div className="bg-[#07070a] border border-[#313244] rounded-[6px] h-[520px] relative overflow-hidden mt-[8px]" ref={gridRef}>
      <svg viewBox="0 0 1000 520" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]">
        <defs>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a6e3a1" />
          </marker>
          <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f38ba8" />
          </marker>
        </defs>

        {/* 220kV Feeder Incoming Flow */}
        <path className={statuses.Line220 ? "flow-line active" : "flow-line tripped"} d="M 500 25 L 500 50" markerEnd={statuses.Line220 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        {/* AT Flows */}
        <path className={statuses.AT1 && hasVoltage220 ? "flow-line active" : "flow-line tripped"} d="M 250 50 L 250 115" markerEnd={statuses.AT1 && hasVoltage220 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.AT1 && hasVoltageBus1 ? "flow-line active" : "flow-line tripped"} d="M 250 175 L 250 230" markerEnd={statuses.AT1 && hasVoltageBus1 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        <path className={statuses.AT2 && hasVoltage220 ? "flow-line active" : "flow-line tripped"} d="M 750 50 L 750 115" markerEnd={statuses.AT2 && hasVoltage220 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.AT2 && hasVoltageBus2 ? "flow-line active" : "flow-line tripped"} d="M 750 175 L 750 230" markerEnd={statuses.AT2 && hasVoltageBus2 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        {/* Coupler Flow (დინამიური მიმართულება რეჟიმის მიხედვით) */}
        {flowToBus1 ? (
          /* მიმართულება მარჯვნიდან მარცხნივ (II სექცია -> I სექცია) */
          <path 
            className={statuses.Coupler && (hasVoltageBus1 || hasVoltageBus2) ? "flow-line active" : "flow-line tripped"} 
            d="M 570 230 L 500 215 L 430 230" 
            markerEnd={statuses.Coupler && (hasVoltageBus1 || hasVoltageBus2) ? "url(#arrow-green)" : "url(#arrow-red)"} 
          />
        ) : (
          /* მიმართულება მარცხნიდან მარჯვნივ (I სექცია -> II სექცია, მაგალითად AT-2-ის ავარიისას) */
          <path 
            className={statuses.Coupler && (hasVoltageBus1 || hasVoltageBus2) ? "flow-line active" : "flow-line tripped"} 
            d="M 430 230 L 500 215 L 570 230" 
            markerEnd={statuses.Coupler && (hasVoltageBus1 || hasVoltageBus2) ? "url(#arrow-green)" : "url(#arrow-red)"} 
          />
        )}
        
        {/* Feeder Flows */}
        <path className={statuses.LineA && hasVoltageBus1 ? "flow-line active" : "flow-line tripped"} d="M 150 230 L 150 320" markerEnd={statuses.LineA && hasVoltageBus1 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T1 && hasVoltageBus1 ? "flow-line active" : "flow-line tripped"} d="M 320 230 L 320 320" markerEnd={statuses.T1 && hasVoltageBus1 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T2 && hasVoltageBus2 ? "flow-line active" : "flow-line tripped"} d="M 750 230 L 750 320" markerEnd={statuses.T2 && hasVoltageBus2 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        <path className={statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? "flow-line active" : "flow-line tripped"} d="M 320 395 L 230 460" markerEnd={statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? "flow-line active" : "flow-line tripped"} d="M 320 395 L 410 460" markerEnd={statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? "flow-line active" : "flow-line tripped"} d="M 750 395 L 670 460" markerEnd={statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? "flow-line active" : "flow-line tripped"} d="M 750 395 L 830 460" markerEnd={statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        {/* დენების წარწერები */}
        <text x="520" y="22" fill={statuses.Line220 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 220kV ეგხ: ${line220_Current} A`}</text>
        <text x="180" y="90" fill={statuses.AT1 && hasVoltage220 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 220kV: ${at1_220_Current} A`}</text>
        <text x="680" y="90" fill={statuses.AT2 && hasVoltage220 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 220kV: ${at2_220_Current} A`}</text>
        <text x="260" y="205" fill={statuses.AT1 && hasVoltageBus1 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 110kV: ${at1_110_Current} A`}</text>
        <text x="760" y="205" fill={statuses.AT2 && hasVoltageBus2 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 110kV: ${at2_110_Current} A`}</text>
        <text x="120" y="285" fill={statuses.LineA && hasVoltageBus1 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${lineACurrentVal} A`}</text>
        
        <text x="330" y="285" fill={statuses.T1 && hasVoltageBus1 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t1_110_Current} A`}</text>
        <text x="760" y="285" fill={statuses.T2 && hasVoltageBus2 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t2_110_Current} A`}</text>
        <text x="180" y="435" fill={statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t1_10_city} A`}</text>
        <text x="370" y="435" fill={statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t1_10_reg} A`}</text>
        <text x="630" y="435" fill={statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t2_35_factory} A`}</text>
        <text x="800" y="435" fill={statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t2_6_motor} A`}</text>
      </svg>

      {sparkPos.show && (
        <div className="absolute text-[24px] z-[5] -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ left: sparkPos.x, top: sparkPos.y }}>⚡</div>
      )}

      {/* 220kV Feeder Header Box */}
      <div className={`absolute flex flex-col items-center p-[3px_8px] rounded-[4px] text-center z-[3] -translate-x-1/2 border ${statuses.Line220 ? 'bg-[#1e1e2e] border-[#fab387]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.line220} style={{ left: '50%', top: '2px' }}>
        <div className="text-[9px] font-bold text-[#cdd6f4]">⚡ 220კვ სისტემური ეგხ</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[8px] px-[3px] py-[1px] rounded mt-[1px] border border-[#313244]">SEL-311L</div>
        <div className="text-[7px] font-bold" style={{ color: statuses.Line220 ? '#a6e3a1' : '#f38ba8' }}>{statuses.Line220 ? 'ჩართულია' : 'გამორთულია'}</div>
      </div>

      {/* 220kV Bus */}
      <div className={`absolute h-[6px] rounded-[3px] z-[2] top-[50px] left-[10%] w-[80%] ${hasVoltage220 ? 'bg-[#fab387]' : 'bg-[#f38ba8]'}`} ref={nodeRefs.gen}>
        <span className="absolute -top-[16px] left-[10px] text-[10px] font-bold text-[#cdd6f4]">220 კვ სისტემური სალტე (S_sc = 2353 MVA) {hasVoltage220 ? '' : '(უძაბვოდ)'}</span>
      </div>

      {/* AT-1 & AT-2 */}
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[130px] -translate-x-1/2 border ${statuses.AT1 && hasVoltage220 ? 'bg-[#1e1e2e] border-[#fab387]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.at1} style={{ left: '25%', top: '115px' }}>
        <div className="text-[9px] font-bold text-[#cdd6f4]">AT-1 (220/110 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[8px] px-[3px] py-[1px] rounded mt-[2px] border border-[#313244]">SEL-487E</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.AT1 && hasVoltage220 ? '#a6e3a1' : '#f38ba8' }}>{statuses.AT1 && hasVoltage220 ? 'ჩართულია' : 'გათიშულია (0A)'}</div>
      </div>

      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[130px] -translate-x-1/2 border ${statuses.AT2 && hasVoltage220 ? 'bg-[#1e1e2e] border-[#fab387]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.at2} style={{ left: '75%', top: '115px' }}>
        <div className="text-[9px] font-bold text-[#cdd6f4]">AT-2 (220/110 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[8px] px-[3px] py-[1px] rounded mt-[2px] border border-[#313244]">SEL-487E</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.AT2 && hasVoltage220 ? '#a6e3a1' : '#f38ba8' }}>{statuses.AT2 && hasVoltage220 ? 'ჩართულია' : 'გათიშულია (0A)'}</div>
      </div>

      {/* 110kV Bus Sections */}
      <div className={`absolute h-[6px] rounded-[3px] z-[2] left-[8%] top-[230px] w-[35%] ${hasVoltageBus1 ? 'bg-[#89b4fa]' : 'bg-[#f38ba8]'}`} ref={nodeRefs.bus110_1}>
        <span className="absolute -top-[16px] left-[5px] text-[9px] font-bold text-[#cdd6f4]">110 კვ სალტე - I {hasVoltageBus1 ? '(ძაბვით)' : '(უძაბვოდ)'}</span>
      </div>

      <div className={`absolute flex flex-col items-center p-[3px_6px] rounded-[4px] text-center z-[3] w-[110px] -translate-x-1/2 border ${statuses.Coupler ? 'bg-[#242535] border-[#89b4fa]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.coupler} style={{ left: '50%', top: '208px' }}>
        <div className="text-[8px] font-bold">⏹️ სექციური Q-110</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-451</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.Coupler ? '#a6e3a1' : '#f38ba8' }}>
          {statuses.Coupler ? 'ჩართულია' : 'გამორთულია'}
        </div>
      </div>

      <div className={`absolute h-[6px] rounded-[3px] z-[2] left-[57%] top-[230px] w-[35%] ${hasVoltageBus2 ? 'bg-[#89b4fa]' : 'bg-[#f38ba8]'}`} ref={nodeRefs.bus110_2}>
        <span className="absolute -top-[16px] left-[5px] text-[9px] font-bold text-[#cdd6f4]">110 კვ სალტე - II {hasVoltageBus2 ? '(ძაბვით)' : '(უძაბვოდ)'}</span>
      </div>

      {/* Feeders & Transformers */}
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[120px] -translate-x-1/2 border ${statuses.LineA && hasVoltageBus1 ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userA} style={{ left: '15%', top: '320px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">🛣️ ეგხ "მაგისტრალი ა"</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-311L</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.LineA && hasVoltageBus1 ? '#a6e3a1' : '#f38ba8' }}>{statuses.LineA && hasVoltageBus1 ? 'ჩართულია' : 'გათიშულია'}</div>
      </div>

      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[125px] -translate-x-1/2 border ${statuses.T1 && hasVoltageBus1 ? 'bg-[#1e1e2e] border-[#f9e2af]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.trans1} style={{ left: '32%', top: '320px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">⚡ ტრანსფ. T-1 (110/10კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-487E</div>
        <div className="text-[7px] font-mono mt-[2px] text-[#89b4fa]">{`10kV: ${t1_LV_TotalCurrent}A`}</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T1 && hasVoltageBus1 ? '#a6e3a1' : '#f38ba8' }}>{statuses.T1 && hasVoltageBus1 ? 'ჩართულია' : 'გათიშულია'}</div>
      </div>

      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[125px] -translate-x-1/2 border ${statuses.T2 && hasVoltageBus2 ? 'bg-[#1e1e2e] border-[#f9e2af]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.trans2} style={{ left: '75%', top: '320px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">⚡ ტრანსფ. T-2 (110/35/6კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-487E</div>
        <div className="text-[7px] font-mono mt-[2px] text-[#89b4fa]">{`110kV: ${t2_110_Current}A`}</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T2 && hasVoltageBus2 ? '#a6e3a1' : '#f38ba8' }}>{statuses.T2 && hasVoltageBus2 ? 'ჩართულია' : 'გათიშულია'}</div>
      </div>

      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[115px] -translate-x-1/2 border ${statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userB} style={{ left: '23%', top: '460px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">🏙️ ქალაქის ფიდერი (10 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-351A</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? '#a6e3a1' : '#f38ba8' }}>{statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? 'ჩართულია' : 'უძაბვოდ'}</div>
      </div>

      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[120px] -translate-x-1/2 border ${statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userE} style={{ left: '41%', top: '460px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">📐 რეგიონული ფიდერი (10 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-351S</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? '#a6e3a1' : '#f38ba8' }}>{statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? 'ჩართულია' : 'უძაბვოდ'}</div>
      </div>

      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[115px] -translate-x-1/2 border ${statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userC} style={{ left: '67%', top: '460px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">🏭 ქარხნის ხაზი (35 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-421</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? '#a6e3a1' : '#f38ba8' }}>{statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? 'ჩართულია' : 'უძაბვოდ'}</div>
      </div>

      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[115px] -translate-x-1/2 border ${statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userD} style={{ left: '83%', top: '460px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">⚙️ ასინქ. ძრავა (6 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-701</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? '#a6e3a1' : '#f38ba8' }}>{statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? 'ჩართულია' : 'უძაბვოდ'}</div>
      </div>

      <div className="absolute bottom-[6px] right-[10px] text-[9px] text-[#a6adc8] font-mono opacity-80">
        <span>👨‍🔬 ავტორი: ბორის ჯინჭველეიშვილი</span>
      </div>
    </div>
  );
}