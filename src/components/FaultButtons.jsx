import React from 'react';

export default function FaultButtons({ triggerFault }) {
  return (
    <>
      <h3 className="mt-[10px] text-[#89b4fa] border-b border-[#313244] pb-[4px] text-[12px] font-bold">
        💥 ავარიული რეჟიმები & აგჩ (SEL 79 AR) იმიტაცია
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[5px] mt-[6px]">
        {/* 220kV Line AR Scenarios */}
        <button 
          className="bg-[#1e1e2e] border border-[#a6e3a1] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#a6e3a1] hover:text-black transition-colors" 
          onClick={() => triggerFault('line_220_1ar_success')}
        >
          ⚡ 220კვ 1-ფაზა აგჩ (წარმატებული)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('line_220_3ar_failed')}
        >
          ⚡ 220კვ 3-ფაზა აგჩ (უშედეგო - LOCKOUT)
        </button>

        {/* 110kV Line A Scenarios */}
        <button 
          className="bg-[#1e1e2e] border border-[#a6e3a1] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#a6e3a1] hover:text-black transition-colors" 
          onClick={() => triggerFault('line_a_fault_ar')}
        >
          🛣️ 110კვ ეგხ "მაგისტრალი ა" (აგჩ)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('line_a_fault_permanent')}
        >
          🚨 110კვ ეგხ "მაგისტრალი ა" (მდგრადი / გათიშვა)
        </button>

        {/* Differential Protections (AR Blocked) */}
        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('at1_diff')}
        >
          🌀 AT-1 დიფერენციალური (87AT / 79 Block)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('at2_diff')}
        >
          🌀 AT-2 დიფერენციალური (87AT / 79 Block)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('bus1_fault')}
        >
          ⚡ 110კვ I სექციის მ.შ. (87B / 79 Block)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('bus2_fault')}
        >
          ⚡ 110კვ II სექციის მ.შ. (87B / 79 Block)
        </button>

        {/* Other Protections */}
        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('t1_fault')}
        >
          ⚡ ტრანსფორმატორი T-1 (87T)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('t2_fault')}
        >
          ⚡ ტრანსფორმატორი T-2 (87T)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('line_35_fault')}
        >
          🏭 35კვ ქარხნის ხაზი (21)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('feeder_city_fault')}
        >
          🏙️ 10კვ საქალაქო ფიდერი (50/51)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('feeder_reg_fault')}
        >
          📐 10კვ რეგიონული ფიდერი (67N)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f38ba8] text-white p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f38ba8] hover:text-black transition-colors" 
          onClick={() => triggerFault('motor_fault')}
        >
          ⚙️ 6კვ ასინქრონული ძრავა (701)
        </button>

        <button 
          className="bg-[#1e1e2e] border border-[#f9e2af] text-[#f9e2af] p-[5px] rounded text-left text-[9px] font-bold cursor-pointer hover:bg-[#f9e2af] hover:text-black transition-colors" 
          onClick={() => triggerFault('bus_coupler_fault')}
        >
          ⏹️ სექციური Q-110 (ყალბი გამორთვა)
        </button>
      </div>
    </>
  );
}