import React from 'react';

export default function SubstationSchema({ gridRef, nodeRefs, statuses, calcData, sparkPos }) {
  const {
    hasVoltageBus1, hasVoltageBus2,
    lineACurrentVal, t1_10_city, t1_10_reg, t2_35_factory, t2_6_motor,
    t1_LV_TotalCurrent, t1_110_Current, t2_110_Current,
    at1_110_Current, at2_110_Current, at1_220_Current, at2_220_Current
  } = calcData;

  return (
    <div className="bg-[#07070a] border border-[#313244] rounded-[6px] h-[500px] relative overflow-hidden mt-[8px]" ref={gridRef}>
      <svg viewBox="0 0 1000 500" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]">
        <defs>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a6e3a1" />
          </marker>
          <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f38ba8" />
          </marker>
        </defs>
        
        {/* AT Flows */}
        <path className={statuses.AT1 ? "flow-line active" : "flow-line tripped"} d="M 250 32 L 250 105" markerEnd={statuses.AT1 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.AT1 && hasVoltageBus1 ? "flow-line active" : "flow-line tripped"} d="M 250 165 L 250 220" markerEnd={statuses.AT1 && hasVoltageBus1 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        <path className={statuses.AT2 ? "flow-line active" : "flow-line tripped"} d="M 750 32 L 750 105" markerEnd={statuses.AT2 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.AT2 && hasVoltageBus2 ? "flow-line active" : "flow-line tripped"} d="M 750 165 L 750 220" markerEnd={statuses.AT2 && hasVoltageBus2 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        {/* Coupler Flow */}
        <path className={statuses.Coupler && (hasVoltageBus1 || hasVoltageBus2) ? "flow-line active" : "flow-line tripped"} d="M 430 220 L 500 205 L 570 220" />
        
        {/* Feeder Flows */}
        <path className={statuses.LineA && hasVoltageBus1 ? "flow-line active" : "flow-line tripped"} d="M 150 220 L 150 310" markerEnd={statuses.LineA && hasVoltageBus1 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T1 && hasVoltageBus1 ? "flow-line active" : "flow-line tripped"} d="M 320 220 L 320 310" markerEnd={statuses.T1 && hasVoltageBus1 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T2 && hasVoltageBus2 ? "flow-line active" : "flow-line tripped"} d="M 750 220 L 750 310" markerEnd={statuses.T2 && hasVoltageBus2 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        <path className={statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? "flow-line active" : "flow-line tripped"} d="M 320 385 L 230 450" markerEnd={statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? "flow-line active" : "flow-line tripped"} d="M 320 385 L 410 450" markerEnd={statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? "flow-line active" : "flow-line tripped"} d="M 750 385 L 670 450" markerEnd={statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        <path className={statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? "flow-line active" : "flow-line tripped"} d="M 750 385 L 830 450" markerEnd={statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? "url(#arrow-green)" : "url(#arrow-red)"} />
        
        {/* დენების წარწერები */}
        <text x="180" y="80" fill={statuses.AT1 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 220kV: ${at1_220_Current} A`}</text>
        <text x="680" y="80" fill={statuses.AT2 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 220kV: ${at2_220_Current} A`}</text>
        <text x="260" y="195" fill={statuses.AT1 && hasVoltageBus1 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 110kV: ${at1_110_Current} A`}</text>
        <text x="760" y="195" fill={statuses.AT2 && hasVoltageBus2 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ 110kV: ${at2_110_Current} A`}</text>
        <text x="120" y="275" fill={statuses.LineA && hasVoltageBus1 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${lineACurrentVal} A`}</text>
        
        <text x="330" y="275" fill={statuses.T1 && hasVoltageBus1 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t1_110_Current} A`}</text>
        <text x="760" y="275" fill={statuses.T2 && hasVoltageBus2 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t2_110_Current} A`}</text>
        <text x="180" y="425" fill={statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t1_10_city} A`}</text>
        <text x="370" y="425" fill={statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t1_10_reg} A`}</text>
        <text x="630" y="425" fill={statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t2_35_factory} A`}</text>
        <text x="800" y="425" fill={statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? "#a6e3a1" : "#f38ba8"} fontSize="11px" fontFamily="monospace" fontWeight="bold">{`⬇ ${t2_6_motor} A`}</text>
      </svg>

      {sparkPos.show && (
        <div className="absolute text-[24px] z-[5] -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ left: sparkPos.x, top: sparkPos.y }}>⚡</div>
      )}

      {/* 220kV Bus */}
      <div className="absolute bg-[#fab387] h-[6px] rounded-[3px] z-[2] top-[26px] left-[10%] w-[80%]" ref={nodeRefs.gen}>
        <span className="absolute -top-[16px] left-[10px] text-[10px] font-bold text-[#cdd6f4]">220 კვ სისტემური სალტე (S_sc = 2353 MVA)</span>
      </div>

      {/* AT-1 & AT-2 */}
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[130px] -translate-x-1/2 border ${statuses.AT1 ? 'bg-[#1e1e2e] border-[#fab387]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.at1} style={{ left: '25%', top: '105px' }}>
        <div className="text-[9px] font-bold text-[#cdd6f4]">AT-1 (220/110 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[8px] px-[3px] py-[1px] rounded mt-[2px] border border-[#313244]">SEL-487E</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.AT1 ? '#a6e3a1' : '#f38ba8' }}>{statuses.AT1 ? 'ჩართულია' : 'გათიშულია (0A)'}</div>
      </div>
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[130px] -translate-x-1/2 border ${statuses.AT2 ? 'bg-[#1e1e2e] border-[#fab387]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.at2} style={{ left: '75%', top: '105px' }}>
        <div className="text-[9px] font-bold text-[#cdd6f4]">AT-2 (220/110 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[8px] px-[3px] py-[1px] rounded mt-[2px] border border-[#313244]">SEL-487E</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.AT2 ? '#a6e3a1' : '#f38ba8' }}>{statuses.AT2 ? 'ჩართულია' : 'გათიშულია (0A)'}</div>
      </div>

      {/* 110kV Bus Sections */}
      <div className={`absolute h-[6px] rounded-[3px] z-[2] left-[8%] top-[220px] w-[35%] ${hasVoltageBus1 ? 'bg-[#89b4fa]' : 'bg-[#f38ba8]'}`} ref={nodeRefs.bus110_1}>
        <span className="absolute -top-[16px] left-[5px] text-[9px] font-bold text-[#cdd6f4]">110 კვ სალტე - I {hasVoltageBus1 ? '(ძაბვით)' : '(უძაბვოდ)'}</span>
      </div>
      <div className={`absolute flex flex-col items-center p-[3px_6px] rounded-[4px] text-center z-[3] w-[110px] -translate-x-1/2 border ${statuses.Coupler ? 'bg-[#242535] border-[#89b4fa]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.coupler} style={{ left: '50%', top: '198px' }}>
        <div className="text-[8px] font-bold">⏹️ სექციური Q-110</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-451</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.Coupler ? '#a6e3a1' : '#f38ba8' }}>
          {statuses.Coupler ? 'ჩართულია' : 'გამორთულია'}
        </div>
      </div>
      <div className={`absolute h-[6px] rounded-[3px] z-[2] left-[57%] top-[220px] w-[35%] ${hasVoltageBus2 ? 'bg-[#89b4fa]' : 'bg-[#f38ba8]'}`} ref={nodeRefs.bus110_2}>
        <span className="absolute -top-[16px] left-[5px] text-[9px] font-bold text-[#cdd6f4]">110 კვ სალტე - II {hasVoltageBus2 ? '(ძაბვით)' : '(უძაბვოდ)'}</span>
      </div>

      {/* Feeders & Transformers */}
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[120px] -translate-x-1/2 border ${statuses.LineA && hasVoltageBus1 ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userA} style={{ left: '15%', top: '310px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">🛣️ ეგხ "მაგისტრალი ა"</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-311L</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.LineA && hasVoltageBus1 ? '#a6e3a1' : '#f38ba8' }}>{statuses.LineA && hasVoltageBus1 ? 'ჩართულია' : 'გათიშულია'}</div>
      </div>
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[125px] -translate-x-1/2 border ${statuses.T1 && hasVoltageBus1 ? 'bg-[#1e1e2e] border-[#f9e2af]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.trans1} style={{ left: '32%', top: '310px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">⚡ ტრანსფ. T-1 (110/10კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-487E</div>
        <div className="text-[7px] font-mono mt-[2px] text-[#89b4fa]">{`10kV: ${t1_LV_TotalCurrent}A`}</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T1 && hasVoltageBus1 ? '#a6e3a1' : '#f38ba8' }}>{statuses.T1 && hasVoltageBus1 ? 'ჩართულია' : 'გათიშულია'}</div>
      </div>
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[125px] -translate-x-1/2 border ${statuses.T2 && hasVoltageBus2 ? 'bg-[#1e1e2e] border-[#f9e2af]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.trans2} style={{ left: '75%', top: '310px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">⚡ ტრანსფ. T-2 (110/35/6კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-487E</div>
        <div className="text-[7px] font-mono mt-[2px] text-[#89b4fa]">{`110kV: ${t2_110_Current}A`}</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T2 && hasVoltageBus2 ? '#a6e3a1' : '#f38ba8' }}>{statuses.T2 && hasVoltageBus2 ? 'ჩართულია' : 'გათიშულია'}</div>
      </div>
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[115px] -translate-x-1/2 border ${statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userB} style={{ left: '23%', top: '450px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">🏙️ ქალაქის ფიდერი (10 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-351A</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? '#a6e3a1' : '#f38ba8' }}>{statuses.T1 && hasVoltageBus1 && statuses.FeederCity ? 'ჩართულია' : 'უძაბვოდ'}</div>
      </div>
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[120px] -translate-x-1/2 border ${statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userE} style={{ left: '41%', top: '450px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">📐 რეგიონული ფიდერი (10 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-351S</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? '#a6e3a1' : '#f38ba8' }}>{statuses.T1 && hasVoltageBus1 && statuses.FeederReg ? 'ჩართულია' : 'უძაბვოდ'}</div>
      </div>
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[115px] -translate-x-1/2 border ${statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userC} style={{ left: '67%', top: '450px' }}>
        <div className="text-[8px] font-bold text-[#cdd6f4]">🏭 ქარხნის ხაზი (35 კვ)</div>
        <div className="bg-[#11111b] text-[#fab387] font-mono text-[7px] px-[2px] py-[1px] rounded mt-[1px]">SEL-421</div>
        <div className="text-[7px] font-bold mt-[1px]" style={{ color: statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? '#a6e3a1' : '#f38ba8' }}>{statuses.T2 && hasVoltageBus2 && statuses.Feeder35 ? 'ჩართულია' : 'უძაბვოდ'}</div>
      </div>
      <div className={`absolute flex flex-col items-center p-[4px] rounded-[4px] text-center z-[3] w-[115px] -translate-x-1/2 border ${statuses.T2 && hasVoltageBus2 && statuses.Motor6 ? 'bg-[#1e1e2e] border-[#a6e3a1]' : 'bg-[#2a171e] border-[#f38ba8]'}`} ref={nodeRefs.userD} style={{ left: '83%', top: '450px' }}>
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