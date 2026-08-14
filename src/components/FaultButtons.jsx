import React from 'react';

const FAULT_BUTTONS = [
  { id: 'line_220_1ar_success', label: '⚡ 220კვ 1-ფაზა აგჩ (წარმატებული)' },
  { id: 'line_220_3ar_failed', label: '⚡ 220კვ 3-ფაზა აგჩ (უშედეგო - LOCKOUT)' },
  { id: 'line_a_fault_ar', label: '🔔 110კვ ეგხ "მაგისტრალი ა" (აგჩ)' },
  { id: 'line_a_fault_permanent', label: '🚨 110კვ ეგხ "მაგისტრალი ა" (მდგრადი / გათიშვა)' },
  { id: 'at1_diff', label: '🔷 AT-1 დიფერენციალური (87AT / 79 Block)' },
  { id: 'at2_diff', label: '🔷 AT-2 დიფერენციალური (87AT / 79 Block)' },
  { id: 'bus1_fault', label: '⚡ 110კვ I სექციის მ.შ. (87B / 79 Block)' },
  { id: 'bus2_fault', label: '⚡ 110კვ II სექციის მ.შ. (87B / 79 Block)' },
  { id: 't1_fault', label: '⚡ ტრანსფორმატორი T-1 (87T)' },
  { id: 't2_fault', label: '⚡ ტრანსფორმატორი T-2 (87T)' },
  { id: 'line_35_fault', label: '📱 35კვ ქარხნის ხაზი (21)' },
  { id: 'feeder_city_fault', label: '📊 10კვ საქალაქო ფიდერი (50/51)' },
  { id: 'feeder_reg_fault', label: '⚠️ 10კვ რეგიონული ფიდერი (67N)' },
  { id: 'motor_fault', label: '⚙️ 6კვ ასინქრონული ძრავი (701)' },
  { id: 'bus_coupler_fault', label: '🟦 სექციური Q-110 (ყალბი გამორთვა)' },
];

export default function FaultButtons({ onTriggerFault, onOpenAnalysis }) {
  return (
    <div className="mt-3 bg-[#181825] p-3 rounded-lg border border-[#313244]">
      <h4 className="text-[#f38ba8] text-[13px] font-bold mb-2 flex items-center gap-1.5 m-0">
        💥 ავარიული რეჟიმები & აგჩ (SEL 79 AR) იმიტაცია
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
        {FAULT_BUTTONS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-[#212130] hover:bg-[#2a2a3e] border border-[#313244] hover:border-[#89b4fa] rounded overflow-hidden transition-all text-[11px] font-medium"
          >
            {/* მარცხენა ნაწილი: იწვევს ავარიას სქემაზე (რჩება ამ გვერდზე) */}
            <button
              onClick={() => onTriggerFault(item.id)}
              className="flex-1 text-left px-2.5 py-2 text-[#cdd6f4] hover:text-[#89b4fa] transition-colors bg-transparent border-none cursor-pointer font-sans truncate"
              title="სქემაზე ავარიის სიმულაცია"
            >
              {item.label}
            </button>

            {/* გამყოფი ზოლი */}
            <div className="w-[1px] h-6 bg-[#313244]" />

            {/* მარჯვენა ნაწილი: გადადის ოსცილოგრამების გვერდზე */}
            <button
              onClick={() => onOpenAnalysis(item.id)}
              className="px-2.5 py-2 text-[#89b4fa] hover:text-[#f5e0dc] hover:bg-[#313244] transition-all bg-transparent border-none cursor-pointer flex items-center gap-1 font-semibold whitespace-nowrap"
              title="ოსცილოგრამის ნახვა"
            >
              <span>ოსცილოგრამა</span>
              <span className="text-[10px]">➔</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}