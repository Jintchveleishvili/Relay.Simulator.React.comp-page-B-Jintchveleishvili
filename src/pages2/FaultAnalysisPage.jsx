import React, { useState } from 'react';
import OscillogramChart from '../components2/OscillogramChart';

export default function FaultAnalysisPage({ onBack }) {
  // სრულად დაკონკრეტებული და ფიზიკურად დამოწმებული 15 ავარიული სცენარი
  const faultEventsList = [
    {
      id: 'line_220_1ar_success',
      title: "⚡ 1. 220კვ ეგხ: 1-ფაზა მ.შ. მიწასთან (A-G) და წარმატებული აგჩ (SEL-311L)",
      relayModel: "SEL-311L (21/87L/79)",
      fileName: "LINE220_1PH_AR_SUCCESS.CEV",
      timeStr: "8/13/2026 1:12:05.100 PM",
      eventType: "TRIP -> RECLOSE (79)",
      targets: "TLED_11 (21Z1) TLED_14 (79_AR_OK)",
      ia: 4100, ib: 350, ic: 340, ig: 3750,
      voltageSag: 15.0,
      faultType: "220კვ ეგხ-ზე (d=15კმ) A-ფაზის შერთვა მიწასთან (1PH-G). SEL-311L-მა ჩახსნა A ფაზა და 1.5 წამში აგჩ-მ (79) წარმატებით აღადგინა ნორმალური რეჟიმი.",
      impact: "ენერგოსისტემა დარჩა მდგრადი, აგჩ-მ აღადგინა 220კვ კვება."
    },
    {
      id: 'line_220_3ar_failed',
      title: "🚨 2. 220კვ ეგხ: 3-ფაზა მდგრადი მ.შ. (A-B-C) და უშედეგო აგჩ (SEL-311L)",
      relayModel: "SEL-311L (21/87L/79)",
      fileName: "LINE220_3PH_LOCKOUT.CEV",
      timeStr: "8/13/2026 1:18:42.025 PM",
      eventType: "LOCKOUT (79_FAIL)",
      targets: "TLED_10 (3PH_TRIP) TLED_15 (LOCKOUT)",
      ia: 9800, ib: 9750, ic: 9600, ig: 0,
      voltageSag: 0.0,
      faultType: "220კვ ეგხ-ის დასაწყისში (d=5კმ) სამფაზა სიმეტრიული მოკლე შერთვა (3PH). აგჩ-ს განმეორებითმა ჩართვამ უშედეგოდ ჩაიარა.",
      impact: "ხაზი გაითიშა LOCKOUT რეჟიმში. საჭიროა 220კვ ეგხ-ს პატრულირება."
    },
    {
      id: 'line_a_fault_ar',
      title: "⚡ 3. 110კვ ეგხ A: 1-ფაზა მ.შ. მიწასთან (A-G) და წარმატებული აგჩ (SEL-311L)",
      relayModel: "SEL-311L (21/79)",
      fileName: "LINE110_A_AR_OK.CEV",
      timeStr: "8/13/2026 1:40:15.025 PM",
      eventType: "TRIP -> RECLOSE (79)",
      targets: "TLED_1 (21Z1) TLED_4 (79_AR_OK)",
      ia: 3200, ib: 280, ic: 275, ig: 2920,
      voltageSag: 18.0,
      faultType: "110კვ ხაზზე (d=15კმ) A-ფაზის შერთვა მიწასთან (1PH-G). SEL-311L-მა თიშა ამომრთველი და 1.5 წამში აგჩ-მ აღადგინა კვება.",
      impact: "110კვ ქვესადგურის მომხმარებლებს კვება აღუდგათ უმოკლეს დროში."
    },
    {
      id: 'line_a_fault_permanent',
      title: "🚨 4. 110კვ ეგხ A: მდგრადი 1-ფაზა მ.შ. მიწასთან (SEL-311L)",
      relayModel: "SEL-311L (21/50)",
      fileName: "LINE110_A_PERMANENT.CEV",
      timeStr: "8/13/2026 1:45:30.025 PM",
      eventType: "TRIP_PERMANENT",
      targets: "TLED_1 (21Z1) TLED_12 (TRIP_3P)",
      ia: 3200, ib: 280, ic: 275, ig: 2920,
      voltageSag: 0.0,
      faultType: "110კვ ხაზზე მდგრადი A-G შერთვა. ხაზი გაითიშა საბოლოოდ აგჩ-ს გარეშე.",
      impact: "110კვ ხაზი A იზოლირებულია, მომხმარებელი A გათიშულია."
    },
    {
      id: 'at1_diff',
      title: "💥 5. AT-1 (220/110კვ): 110კვ გრაგნილის შიდა ორფაზა მ.შ. A-B (SEL-487E)",
      relayModel: "SEL-487E (87AT)",
      fileName: "AT1_INTERTURN_FAULT.CEV",
      timeStr: "8/13/2026 2:42:10.030 PM",
      eventType: "TRIP (87AT)",
      targets: "TLED_1 (87AT1) TLED_8 (DIFF_TRIP)",
      ia: 3850, ib: 3800, ic: 250, ig: 0,
      voltageSag: 45.0,
      faultType: "AT-1-ის 110კვ საერთო გრაგნილის შიდა ორფაზა მოკლე შერთვა A და B ფაზებს შორის (Internal Phase-to-Phase A-B). 3I0=0A რადგან მიწა არ მონაწილეობს.",
      impact: "SEL-487E-ს დიფერენციალურმა დაცვამ 0.025 წამში გათიშა AT-1. I სექცია გადავიდა AT-2-ზე Q-110-ის გავლით."
    },
    {
      id: 'at2_diff',
      title: "🚫 6. AT-2 (220/110კვ): 110კვ გრაგნილის შერთვა მიწასთან A-G (SEL-487E)",
      relayModel: "SEL-487E (87AT)",
      fileName: "AT2_EARTH_FAULT.CEV",
      timeStr: "8/13/2026 2:45:00.015 PM",
      eventType: "TRIP (87AT + 87N)",
      targets: "TLED_2 (87AT2) TLED_5 (GND_TRIP)",
      ia: 5200, ib: 210, ic: 190, ig: 4800,
      voltageSag: 15.0,
      faultType: "AT-2-ის 110კვ გრაგნილის A-ფაზის შერთვა კორპუსთან/მიწასთან (Earth Fault). 10კვ YNd11 სამკუთხედში ტრანსფორმირდა 33,024A A და B ფაზურ გამყვანებზე.",
      impact: "AT-2 გაითიშა 0.015 წამში. II სექციის კვება გადავიდა AT-1-ზე Q-110-ის გავლით."
    },
    {
      id: 'bus1_fault',
      title: "💥 7. 110კვ I სექციის სალტური 3-ფაზა მოკლე შერთვა (SEL-487B)",
      relayModel: "SEL-487B (87B)",
      fileName: "BUS1_110KV_FAULT.CEV",
      timeStr: "8/13/2026 2:50:11.015 PM",
      eventType: "TRIP (87B_BUS1)",
      targets: "TLED_1 (87B_ZONE1) TLED_9 (TRIP_BUS1)",
      ia: 12200, ib: 12100, ic: 11900, ig: 0,
      voltageSag: 0.0,
      faultType: "110კვ I სექციის სალტეზე პირდაპირი 3-ფაზა მოკლე შერთვა (3PH). SEL-487B სალტეების დიფერენციალურმა დაცვამ 0.015 წამში გათიშა AT-1 და Q-110.",
      impact: "I სექცია იზოლირებულია. II სექცია აგრძელებს ნორმალურ მუშაობას AT-2-დან."
    },
    {
      id: 'bus2_fault',
      title: "💥 8. 110კვ II სექციის სალტური 3-ფაზა მოკლე შერთვა (SEL-487B)",
      relayModel: "SEL-487B (87B)",
      fileName: "BUS2_110KV_FAULT.CEV",
      timeStr: "8/13/2026 2:53:40.015 PM",
      eventType: "TRIP (87B_BUS2)",
      targets: "TLED_2 (87B_ZONE2) TLED_9 (TRIP_BUS2)",
      ia: 12200, ib: 12050, ic: 11950, ig: 0,
      voltageSag: 0.0,
      faultType: "110კვ II სექციის სალტეზე 3-ფაზა მოკლე შერთვა. SEL-487B-მ გათიშა AT-2 და სექციური Q-110.",
      impact: "II სექცია იზოლირებულია, I სექცია დარჩა მუშაობაში."
    },
    {
      id: 'bus_coupler_fault',
      title: "⚠️ 9. Q-110 სექციური ამომრთველის ყალბი გამორთვა (SEL-451)",
      relayModel: "SEL-451 (50/51/BATS)",
      fileName: "COUPLER_FALSE_TRIP.CEV",
      timeStr: "8/13/2026 3:05:00.010 PM",
      eventType: "FALSE_TRIP",
      targets: "TLED_6 (COUPLER_OPEN)",
      ia: 0, ib: 0, ic: 0, ig: 0,
      voltageSag: 63.5,
      faultType: "Q-110 სექციური ამომრთველი გაითიშა ყალბად ოპერატიული წრედის გაუმართაობის გამო. დენური ავარია არ დაფიქსირებულა (I=0A, V=63.5kV).",
      impact: "I და II სექციებმა გააგრძელეს ავტონომიური კვება AT-1 და AT-2-დან."
    },
    {
      id: 't1_fault',
      title: "🚨 10. T-1 (110/10კვ): 110კვ გრაგნილის შერთვა მიწასთან A-G (SEL-487E)",
      relayModel: "SEL-487E (87T)",
      fileName: "TRANS1_EARTH_FAULT.CEV",
      timeStr: "8/13/2026 3:10:15.030 PM",
      eventType: "TRIP (87T + 87N)",
      targets: "TLED_3 (87T1) TLED_7 (GND_TRIP)",
      ia: 4150, ib: 180, ic: 170, ig: 3800,
      voltageSag: 12.0,
      faultType: "T-1 ძალოვანი ტრანსფორმატორის 110კვ გრაგნილის A-ფაზის შერთვა კორპუსთან (Earth Fault). SEL-487E-მ თიშა T-1 ორივე მხრიდან.",
      impact: "10კვ საქალაქო და რეგიონულმა ფიდერებმა დაკარგეს კვება T-1-დან."
    },
    {
      id: 't2_fault',
      title: "🚨 11. T-2 (110/10კვ): 10კვ მხარის შიდა ორფაზა მ.შ. A-B (SEL-487E)",
      relayModel: "SEL-487E (87T)",
      fileName: "TRANS2_INTERTURN_FAULT.CEV",
      timeStr: "8/13/2026 3:15:22.030 PM",
      eventType: "TRIP (87T)",
      targets: "TLED_4 (87T2) TLED_8 (DIFF_TRIP)",
      ia: 1320, ib: 1290, ic: 170, ig: 0,
      voltageSag: 48.0,
      faultType: "T-2 ტრანსფორმატორის 10კვ მხარის შიდა გრაგნილთაშორისი ორფაზა მოკლე შერთვა (A-B). 10კვ მხარეს დენმა მიაღწია 14,500A-ს.",
      impact: "T-2 გაითიშა, 35კვ ქარხანა და 6კვ ძრავა დარჩა კვების გარეშე."
    },
    {
      id: 'line_35_fault',
      title: "⚡ 12. 35კვ ქარხნის ხაზი: ორფაზა მ.შ. A-B (SEL-421)",
      relayModel: "SEL-421 (21/50/51)",
      fileName: "LINE35_FACTORY_FAULT.CEV",
      timeStr: "8/13/2026 3:20:00.020 PM",
      eventType: "TRIP (21Z1)",
      targets: "TLED_1 (21Z1_TRIP)",
      ia: 1850, ib: 1800, ic: 120, ig: 0,
      voltageSag: 10.0,
      faultType: "35კვ იზოლირებული ნეიტრალის ხაზზე (d=6კმ) ორფაზა მოკლე შერთვა A და B ფაზებს შორის (2PH). SEL-421-ის I ზონამ იმოქმედა 0.02 წამში.",
      impact: "35კვ ქარხნის მიწოდების ხაზი გაითიშა."
    },
    {
      id: 'feeder_city_fault',
      title: "🏙️ 13. 10კვ საქალაქო ფიდერი: ორფაზა დენური მოკვეთა A-B (SEL-351A)",
      relayModel: "SEL-351A (50/51)",
      fileName: "FEEDER10_CITY_50.CEV",
      timeStr: "8/13/2026 3:25:05.350 PM",
      eventType: "TRIP (50P)",
      targets: "TLED_2 (50P1_INST)",
      ia: 2100, ib: 2050, ic: 110, ig: 0,
      voltageSag: 2.5,
      faultType: "10კვ საქალაქო ფიდერზე (d=4კმ) ორფაზა მოკლე შერთვა A-B. SEL-351A-ს მყისიერმა დენურმა მოკვეთამ (50P) გათიშა ფიდერი.",
      impact: "საქალაქო დასახლების 10კვ ფიდერი გაითიშა."
    },
    {
      id: 'feeder_reg_fault',
      title: "🌱 14. 10კვ რეგიონული ფიდერი: 1-ფაზა მიწაზე შერთვა A-G (SEL-351S)",
      relayModel: "SEL-351S (67N)",
      fileName: "FEEDER10_67N_EARTH.CEV",
      timeStr: "8/13/2026 3:30:12.500 PM",
      eventType: "TRIP (67N)",
      targets: "TLED_3 (67N_GROUND_FAULT)",
      ia: 33, ib: 31, ic: 30, ig: 33,
      voltageSag: 0.0,
      faultType: "10კვ იზოლირებული ნეიტრალის ქსელში A-ფაზის მიწაზე შერთვა (1PH-G). VA=0kV, ხოლო ჯანსაღი B და C ფაზების ძაბვა გაიზარდა √3-ჯერ (10.0kV).",
      impact: "SEL-351S-მა დააფიქსირა მიმართული ტევადობითი დენი 3I0=33A და უსაფრთხოდ გათიშა ფიდერი.",
    },
    {
      id: 'motor_fault',
      title: "🏭 15. 6კვ ძრავა: როტორის გაჭედვა / სითბური გადატვირთვა (SEL-701)",
      relayModel: "SEL-701 (49/50/51)",
      fileName: "MOTOR_STALL_49.CEV",
      timeStr: "8/13/2026 3:35:40.800 PM",
      eventType: "TRIP (49_THERMAL)",
      targets: "TLED_1 (49_OVERLOAD) TLED_4 (MOTOR_STALL)",
      ia: 890, ib: 885, ic: 880, ig: 0,
      voltageSag: 3.2,
      faultType: "6კვ ასინქრონული ძრავას როტორის გაჭედვა და სამფაზა სითბური გადატვირთვა. დენმა მიაღწია 890A-ს. SEL-701-მა თიშა ძრავა.",
      impact: "ძრავა გაჩერდა სითბური დაზიანების თავიდან ასაცილებლად."
    }
  ];

  const [selectedEventId, setSelectedEventId] = useState(faultEventsList[0].id);
  const selectedEvent = faultEventsList.find(e => e.id === selectedEventId) || faultEventsList[0];

  return (
    <div className="w-screen min-h-screen bg-[#0f0f14] p-4 font-sans text-[#cdd6f4] box-border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 border-b border-[#313244] pb-3 gap-3">
        <div>
          <h1 className="text-[#89b4fa] text-[20px] font-bold m-0 flex items-center gap-2">
            📉 SEL SynchroWAVE — 15-ვე ავარიული ოსცილოგრამა & მოვლენათა ანალიზი
          </h1>
          <p className="text-[#a6adc8] text-[12px] m-0 mt-1">
            SEL რელეების მიერ დაფიქსირებული COMTRADE / CEV ოსცილოგრამები, დენის/ძაბვის ტალღები და ლოგიკური სიგნალები
          </p>
        </div>

        <button 
          onClick={onBack}
          className="bg-[#89b4fa] hover:bg-[#b4befe] text-[#11111b] font-bold px-4 py-2 rounded text-[13px] transition-colors flex items-center gap-2 cursor-pointer shadow"
        >
          ⬅️ მთავარ სქემაზე დაბრუნება
        </button>
      </div>

      {/* Dropdown Selector */}
      <div className="bg-[#161622] p-3 rounded-lg border border-[#313244] mb-4 flex items-center gap-3">
        <label className="text-[#f9e2af] text-[13px] font-bold whitespace-nowrap">
          📁 აირჩიეთ ჩაწერილი ავარია (15 ვარიანტი):
        </label>
        <select 
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="bg-[#1e1e2e] text-[#89b4fa] border border-[#45475a] p-2 rounded text-[13px] font-bold w-full cursor-pointer outline-none focus:border-[#89b4fa]"
        >
          {faultEventsList.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      {/* Main Chart Viewer */}
      <OscillogramChart eventData={selectedEvent} />

      {/* Detailed Impact Report */}
      <div className="mt-4 bg-[#161622] border border-[#313244] p-4 rounded-lg">
        <h3 className="text-[#89b4fa] text-[15px] font-bold mt-0 mb-2 flex items-center gap-2">
          <span>📑</span> ავარიის დეტალური საინჟინრო დასკვნა
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
          <div className="bg-[#181825] p-3 rounded border border-[#313244]">
            <span className="text-[#f38ba8] font-bold block mb-1">🔍 ავარიის მიზეზი და დინამიკა:</span>
            <p className="text-[#cdd6f4] m-0 leading-relaxed">{selectedEvent.faultType}</p>
          </div>
          <div className="bg-[#181825] p-3 rounded border border-[#313244]">
            <span className="text-[#a6e3a1] font-bold block mb-1">⚡ ენერგოსისტემის მდგომარეობა:</span>
            <p className="text-[#cdd6f4] m-0 leading-relaxed">{selectedEvent.impact}</p>
          </div>
        </div>
      </div>

    </div>
  );
}