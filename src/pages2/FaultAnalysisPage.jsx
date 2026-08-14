import React, { useState, useEffect } from 'react';

export const FAULT_PRESETS = [
  {
    id: 'line_220_1ar_success',
    title: '1. 220კვ 1-ფაზა აგჩ (წარმატებული)',
    file: 'LINE220_1PH_AR_SUCCESS.CEV',
    time: '8/14/2026 12:00:15.100 PM',
    fid: 'SEL-311L (79 AR)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_AR_OK',
    targets: ['TLED_1 (87L)', 'TLED_3 (79_AR_OK)'],
    ia: '4800 A', ib: '210 A', ic: '210 A', '3i0': '4590 A',
    va: '0.0 kV', vb: '127.0 kV', vc: '127.0 kV',
    type: '1ph_ar',
    analysis: '220კვ ხაზზე A-ფაზის მოკლე შერთვა მიწაზე. SEL-311L-მა წარმატებით განახორციელა 1-ფაზა აგჩ (AR 79) და ხაზი ჩართულია ძაბვისა და ტვირთის ქვეშ.'
  },
  {
    id: 'line_220_3ar_failed',
    title: '2. 220კვ 3-ფაზა აგჩ (უშედეგო - LOCKOUT)',
    file: 'LINE220_3PH_AR_FAIL.CEV',
    time: '8/14/2026 12:05:30.200 PM',
    fid: 'SEL-311L (79 AR)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_LOCKOUT',
    targets: ['TLED_1 (21P)', 'TLED_4 (AR_FAIL)'],
    ia: '8200 A', ib: '8150 A', ic: '8100 A', '3i0': '0 A',
    va: '0.0 kV', vb: '0.0 kV', vc: '0.0 kV',
    type: '3ph_ar_fail',
    analysis: 'მყარი 3-ფაზა მოკლე შერთვა. აგჩ-ს ციკლის განმეორებითი ჩართვის შემდეგ დაცვამ ხელახლა გამორთო ხაზი (Lockout) და 3-ვე ფაზაში დენი და ძაბვა განულდა.'
  },
  {
    id: 'line_a_fault_ar',
    title: '3. 110კვ ეგხ "მაგისტრალი ა" (აგჩ)',
    file: 'LINE110_A_AR_SUCCESS.CEV',
    time: '8/14/2026 12:10:00.000 PM',
    fid: 'SEL-311L (87L / 79)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_AR_OK',
    targets: ['TLED_1 (87L)', 'TLED_2 (79_AR)'],
    ia: '3200 A', ib: '180 A', ic: '180 A', '3i0': '3020 A',
    va: '0.0 kV', vb: '63.5 kV', vc: '63.5 kV',
    type: '1ph_ar',
    analysis: '110კვ "მაგისტრალი ა"-ზე ელვის შედეგად გამოწვეული 1-ფაზა შერთვა. აგჩ წარმატებით დასრულდა.'
  },
  {
    id: 'line_a_fault_permanent',
    title: '4. 110კვ ეგხ "მაგისტრალი ა" (მდგრადი A-B შერთვა)',
    file: 'LINE110_A_PERMANENT.CEV',
    time: '8/14/2026 12:14:22.000 PM',
    fid: 'SEL-311L (21)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_21_LOCKOUT',
    targets: ['TLED_1 (21_ZONE1)', 'TLED_4 (LOCKOUT)'],
    ia: '3500 A', ib: '3480 A', ic: '180 A', '3i0': '0 A',
    va: '15.0 kV', vb: '15.0 kV', vc: '63.5 kV',
    type: 'permanent_2ph_ab',
    analysis: 'ფაზათაშორისი მდგრადი შერთვა A-B. დისტანციურმა დაცვამ (21) გათიშა ხაზი აგჩ-ს ბლოკირებით (Lockout). გათიშვის შემდეგ 3-ვე ფაზაში დენი და ძაბვა განულდა.'
  },
  {
    id: 'at1_diff',
    title: '5. AT-1 დიფერენციალური (87AT / 79 Block)',
    file: 'AUTOTRANS_AT1_DIFF.CEV',
    time: '8/14/2026 12:18:05.500 PM',
    fid: 'SEL-487E (87AT)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_87AT',
    targets: ['TLED_1 (87AT_TRIP)', 'TLED_5 (87_87STD)'],
    ia: '6500 A', ib: '250 A', ic: '250 A', '3i0': '6250 A',
    va: '0.0 kV', vb: '127.0 kV', vc: '127.0 kV',
    type: 'diff_1ph',
    analysis: 'ავტოტრანსფორმატორ AT-1-ის შიდა ხვიათაშორისი შერთვა A ფაზაში. 87AT დიფერენციალურმა დაცვამ მყისიერად დააიზოლირა AT-1 (აგჩ ბლოკირებულია, 3-ვე ფაზა განულდა).'
  },
  {
    id: 'at2_diff',
    title: '6. AT-2 დიფერენციალური (87AT / B-C შერთვა)',
    file: 'AUTOTRANS_AT2_DIFF.CEV',
    time: '8/14/2026 12:21:40.000 PM',
    fid: 'SEL-487E (87AT)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_87AT',
    targets: ['TLED_1 (87AT_TRIP)', 'TLED_2 (51_OVERCURRENT)'],
    ia: '250 A', ib: '5850 A', ic: '5900 A', '3i0': '0 A',
    va: '127.0 kV', vb: '12.0 kV', vc: '12.0 kV',
    type: 'permanent_2ph_bc',
    analysis: 'AT-2-ის 110კვ მხარის B-C ფაზებს შორის შერთვა. დიფერენციალური დაცვა ამოქმედდა დაუყოვნებლივ (აგჩ ბლოკირებული, დენები და ძაბვები 0-ზე).'
  },
  {
    id: 'bus1_fault',
    title: '7. 110კვ I სექციის მ.შ. (87B / 3-ფაზა)',
    file: 'BUS110_BUS1_DIFF.CEV',
    time: '8/14/2026 12:25:10.120 PM',
    fid: 'SEL-487B (87B)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_87B_BUS1',
    targets: ['TLED_1 (87B_ZONE1)', 'TLED_3 (BKR_TRIP_Q1)'],
    ia: '9100 A', ib: '9050 A', ic: '9000 A', '3i0': '0 A',
    va: '0.0 kV', vb: '0.0 kV', vc: '0.0 kV',
    type: 'bus_3ph',
    analysis: '110კვ I სექციის სალტეების 3-ფაზა მოკლე შერთვა. სექციურმა დაცვამ 87B-მ 3-ფაზიანად გამორთო I სექცია და Q-110.'
  },
  {
    id: 'bus2_fault',
    title: '8. 110კვ II სექციის მ.შ. (87B / A-ფაზა)',
    file: 'BUS110_BUS2_DIFF.CEV',
    time: '8/14/2026 12:28:44.800 PM',
    fid: 'SEL-487B (87B)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_87B_BUS2',
    targets: ['TLED_2 (87B_ZONE2)', 'TLED_3 (BKR_TRIP_Q2)'],
    ia: '8800 A', ib: '200 A', ic: '200 A', '3i0': '8600 A',
    va: '0.0 kV', vb: '63.5 kV', vc: '63.5 kV',
    type: 'diff_1ph',
    analysis: '110კვ II სექციაზე A-ფაზის მიწაზე შერთვა. სექციური დაცვა 87B-მ უზრუნველყო II სექციის იზოლაცია.'
  },
  {
    id: 't1_fault',
    title: '9. ტრანსფორმატორი T-1 (87T / გაზური)',
    file: 'TRANS_T1_FAULT.CEV',
    time: '8/14/2026 12:31:00.000 PM',
    fid: 'SEL-487E (87T)',
    system: 'სამკუთხედი (Δ) / იზოლირებული ნეიტრალი',
    tripTag: 'TRIP_87T',
    targets: ['TLED_1 (87T_TRIP)', 'TLED_4 (GAS_RELY_63)'],
    ia: '4150 A', ib: '150 A', ic: '150 A', '3i0': '0 A',
    va: '2.0 kV', vb: '10.0 kV', vc: '10.0 kV',
    type: 'diff_1ph',
    analysis: 'T-1 ტრანსფორმატორის (110/10კვ) შიდა დაზიანება A ფაზაში. 87T და გაზურმა რელემ (63) გათიშეს T-1 ორივე მხრიდან (აგჩ ბლოკირებულია).'
  },
  {
    id: 't2_fault',
    title: '10. ტრანსფორმატორი T-2 (87T / B-C)',
    file: 'TRANS_T2_FAULT.CEV',
    time: '8/14/2026 12:33:15.000 PM',
    fid: 'SEL-487E (87T)',
    system: 'სამკუთხედი (Δ) / იზოლირებული ნეიტრალი',
    tripTag: 'TRIP_87T',
    targets: ['TLED_1 (87T_TRIP)'],
    ia: '140 A', ib: '3900 A', ic: '3850 A', '3i0': '0 A',
    va: '35.0 kV', vb: '12.0 kV', vc: '12.0 kV',
    type: 'permanent_2ph_bc',
    analysis: 'T-2 ტრანსფორმატორის 35კვ მხარის B-C ფაზათაშორისი შერთვა. 87T დაცვამ მყისიერად გამორთო T-2 (აგჩ ბლოკირებული, 3-ვე ფაზა 0-ზე).'
  },
  {
    id: 'line_35_fault',
    title: '11. 35კვ ქარხნის ხაზი (21 / A-B შერთვა)',
    file: 'LINE35_FACTORY_21.CEV',
    time: '8/14/2026 12:36:20.000 PM',
    fid: 'SEL-421 (21)',
    system: 'სამკუთხედი (Δ) / იზოლირებული ნეიტრალი',
    tripTag: 'TRIP_Z1_21',
    targets: ['TLED_2 (Z1_DIST)', 'TLED_3 (50P)'],
    ia: '5200 A', ib: '5200 A', ic: '320 A', '3i0': '0 A',
    va: '22.0 kV', vb: '22.0 kV', vc: '35.0 kV',
    type: 'permanent_2ph_ab',
    analysis: '35კვ ქარხნის ხაზზე A-B ფაზათაშორისი შერთვა. SEL-421-ის დისტანციური დაცვის 1-ელმა ზონამ გათიშა ხაზი (Lockout, 3-ვე ფაზა განულდა).'
  },
  {
    id: 'feeder_city_fault',
    title: '12. 10კვ საქალაქო ფიდერი (50/51 A-B)',
    file: 'FEEDER10_CITY_50_51.CEV',
    time: '8/14/2026 12:39:10.000 PM',
    fid: 'SEL-351A (50/51)',
    system: 'სამკუთხედი (Δ) / იზოლირებული ნეიტრალი',
    tripTag: 'TRIP_50P',
    targets: ['TLED_1 (50P1_TRIP)', 'TLED_2 (51P_TOC)'],
    ia: '3200 A', ib: '3200 A', ic: '120 A', '3i0': '0 A',
    va: '2.1 kV', vb: '2.1 kV', vc: '10.0 kV',
    type: 'permanent_2ph_ab',
    analysis: '10კვ საქალაქო ფიდერზე მყარი ფაზათაშორისი შერთვა A-B. სწრაფქმედმა დენურმა დაცვამ (50P) გათიშა ფიდერი.'
  },
  {
    id: 'feeder_reg_fault',
    title: '13. 10კვ რეგიონული ფიდერი (67N მიწაზე)',
    file: 'FEEDER10_REG_67N.CEV',
    time: '8/14/2026 12:42:00.000 PM',
    fid: 'SEL-351S (67N)',
    system: 'სამკუთხედი (Δ) / იზოლირებული ნეიტრალი',
    tripTag: 'TRIP_67N',
    targets: ['TLED_1 (67N1_GROUND)', 'TLED_4 (3U0_ALARM)'],
    ia: '45 A', ib: '110 A', ic: '110 A', '3i0': '45 A',
    va: '0.0 kV', vb: '10.0 kV', vc: '10.0 kV',
    type: 'earth_67n',
    analysis: '10კვ იზოლირებულ ნეიტრალში A-ფაზის მიწაზე შერთვა. 67N დაცვამ იმოქმედა და გამორთო ფიდერი (გათიშვის შემდეგ დენები და ძაბვები განულდა).'
  },
  {
    id: 'motor_fault',
    title: '14. 6კვ ასინქრონული ძრავი (49 თერმული)',
    file: 'MOTOR6_701_OVERLOAD.CEV',
    time: '8/14/2026 12:45:00.000 PM',
    fid: 'SEL-701 (49/50/51)',
    system: 'სამკუთხედი (Δ) / იზოლირებული ნეიტრალი',
    tripTag: 'TRIP_49_THERMAL',
    targets: ['TLED_1 (49_THERMAL)', 'TLED_2 (51R_LOCKED)'],
    ia: '1250 A', ib: '1240 A', ic: '1250 A', '3i0': '0 A',
    va: '5.8 kV', vb: '5.8 kV', vc: '5.8 kV',
    type: 'motor_thermal',
    analysis: '6კვ ასინქრონული ძრავას როტორის გაჭედვა / თერმული გადატვირთვა. SEL-701-მა გამორთო ძრავი ტემპერატურული მოდელის დაყოვნებით (3-ვე ფაზა 0-ზე).'
  },
  {
    id: 'bus_coupler_fault',
    title: '15. სექციური Q-110 (ყალბი გამორთვა)',
    file: 'COUPLER110_FALSE_TRIP.CEV',
    time: '8/14/2026 12:48:30.000 PM',
    fid: 'SEL-451 (FALSE TRIP)',
    system: 'ვარსკვლავი (Y0) / ყრუდ დამიწებული ნეიტრალი',
    tripTag: 'TRIP_FALSE',
    targets: ['TLED_5 (MECHANICAL_TRIP)'],
    ia: '0 A', ib: '0 A', ic: '0 A', '3i0': '0 A',
    va: '63.5 kV', vb: '63.5 kV', vc: '63.5 kV',
    type: 'false_trip',
    analysis: '110კვ სექციური ამომრთველი Q-110-ის მექანიკური/ყალბი გათიშვა. გათიშვის შემდეგ დენი და ძაბვა სექციურზე განულდა.'
  }
];

export default function FaultAnalysisPage({ selectedFaultId, onBackToSchema }) {
  const [currentId, setCurrentId] = useState(selectedFaultId || 'line_220_1ar_success');

  useEffect(() => {
    if (selectedFaultId) {
      setCurrentId(selectedFaultId);
    }
  }, [selectedFaultId]);

  const preset = FAULT_PRESETS.find(p => p.id === currentId) || FAULT_PRESETS[0];

  return (
    <div className="w-screen min-h-screen bg-[#0d0d12] text-[#cdd6f4] p-4 font-sans box-border">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#161622] p-3 rounded-lg border border-[#313244] mb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[#89b4fa] font-bold text-sm">📁 აირჩიეთ ავარია:</span>
          <select 
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            className="bg-[#1e1e2e] text-[#f5e0dc] border border-[#45475a] px-3 py-1.5 rounded font-semibold text-xs cursor-pointer focus:outline-none focus:border-[#89b4fa]"
          >
            {FAULT_PRESETS.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* 👇 დამატებულია უსაფრთხო გამოძახება ?() */}
        <button 
          onClick={() => {
            if (onBackToSchema) {
              onBackToSchema();
            } else {
              console.warn("onBackToSchema prop არ არის გადაცემული!");
            }
          }}
          className="bg-[#313244] hover:bg-[#45475a] text-[#89b4fa] font-bold text-xs px-4 py-2 rounded transition-all cursor-pointer border border-[#45475a] flex items-center gap-1.5"
        >
          ← მთავარ სქემაზე დაბრუნება
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Left Side: Waveforms */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#161622] p-3 rounded-lg border border-[#313244]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#89b4fa]">⚡ ქსელის პარამეტრები:</span>
              <span className="text-[11px] text-[#a6e3a1] bg-[#1e1e2e] px-2 py-0.5 rounded border border-[#313244]">
                🔗 {preset.system}
              </span>
            </div>

            {/* Currents Chart */}
            <div className="bg-[#11111b] p-3 rounded border border-[#313244] mb-3 relative">
              <div className="flex justify-between text-[11px] mb-1 font-mono">
                <span className="text-[#f38ba8] font-bold">⚡ Analog Currents (A)</span>
                <span className="text-[#cdd6f4]">
                  <span className="text-[#f38ba8]">Phase A: {preset.ia}</span> | <span className="text-[#89b4fa]">Phase B: {preset.ib}</span> | <span className="text-[#a6e3a1]">Phase C: {preset.ic}</span>
                </span>
              </div>
              <CurrentWaveformSvg type={preset.type} maxVal={preset.ia} />
            </div>

            {/* Voltages Chart */}
            <div className="bg-[#11111b] p-3 rounded border border-[#313244] relative">
              <div className="flex justify-between text-[11px] mb-1 font-mono">
                <span className="text-[#89b4fa] font-bold">📉 Analog Voltages (kV)</span>
                <span className="text-[#cdd6f4]">
                  <span className="text-[#f38ba8]">VA: {preset.va}</span> | <span className="text-[#89b4fa]">VB: {preset.vb}</span> | <span className="text-[#a6e3a1]">VC: {preset.vc}</span>
                </span>
              </div>
              <VoltageWaveformSvg type={preset.type} maxVal="127.0 kV" />
            </div>
          </div>

          {/* Digital Signals */}
          <div className="bg-[#161622] p-3 rounded-lg border border-[#313244]">
            <span className="text-xs font-bold text-[#f9e2af] block mb-2">🚦 Digital Relay Signals (TRIP / CLOSE / LOCKOUT)</span>
            <DigitalSignalsSvg type={preset.type} />
          </div>
        </div>

        {/* Right Side: Analysis */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#161622] p-3 rounded-lg border border-[#313244]">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#313244]">
              <span className="text-xs font-bold text-[#89b4fa] flex items-center gap-1">📊 SynchroWAVE Event</span>
              <span className="text-[10px] bg-[#f38ba8] text-[#11111b] font-extrabold px-2 py-0.5 rounded">
                {preset.tripTag}
              </span>
            </div>
            <div className="text-[11px] font-mono space-y-1 text-[#a6adc8]">
              <div><strong className="text-[#cdd6f4]">File:</strong> {preset.file}</div>
              <div><strong className="text-[#cdd6f4]">Time:</strong> {preset.time}</div>
              <div><strong className="text-[#cdd6f4]">FID:</strong> {preset.fid}</div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#313244]">
              <span className="text-xs font-bold text-[#f9e2af] block mb-1">🎯 Targets / Signals:</span>
              <div className="flex flex-wrap gap-1">
                {preset.targets.map((t, idx) => (
                  <span key={idx} className="bg-[#1e1e2e] text-[#a6e3a1] border border-[#a6e3a1]/30 text-[10px] font-mono px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#161622] p-3 rounded-lg border border-[#313244] flex-1">
            <span className="text-xs font-bold text-[#a6e3a1] block mb-1">
              📝 ანალიზის დასკვნა:
            </span>
            <p className="text-[11px] text-[#cdd6f4] leading-relaxed m-0 bg-[#1e1e2e] p-2.5 rounded border border-[#313244]">
              {preset.analysis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== SVG CURRENT WAVEFORMS ==================== */

function CurrentWaveformSvg({ type, maxVal = "5000 A" }) {
  return (
    <svg viewBox="0 0 650 150" className="w-full h-36">
      <line x1="50" y1="20" x2="620" y2="20" stroke="#2a2b3d" strokeDasharray="2,2" />
      <line x1="50" y1="45" x2="620" y2="45" stroke="#2a2b3d" strokeDasharray="2,2" />
      <line x1="50" y1="70" x2="620" y2="70" stroke="#45475a" strokeWidth="1" />
      <line x1="50" y1="95" x2="620" y2="95" stroke="#2a2b3d" strokeDasharray="2,2" />
      <line x1="50" y1="120" x2="620" y2="120" stroke="#2a2b3d" strokeDasharray="2,2" />

      <line x1="50" y1="10" x2="50" y2="130" stroke="#6c7086" strokeWidth="1.5" />
      <text x="45" y="23" fill="#a6adc8" fontSize="9" textAnchor="end">+{maxVal}</text>
      <text x="45" y="73" fill="#a6adc8" fontSize="9" textAnchor="end">0 A</text>
      <text x="45" y="123" fill="#a6adc8" fontSize="9" textAnchor="end">-{maxVal}</text>

      <line x1="50" y1="130" x2="630" y2="130" stroke="#6c7086" strokeWidth="1.5" />
      <text x="50" y="143" fill="#a6adc8" fontSize="9" textAnchor="middle">0 ms</text>
      <text x="190" y="143" fill="#a6adc8" fontSize="9" textAnchor="middle">100 ms</text>
      <text x="280" y="143" fill="#a6adc8" fontSize="9" textAnchor="middle">280 ms</text>
      <text x="430" y="143" fill="#a6adc8" fontSize="9" textAnchor="middle">430 ms</text>
      <text x="610" y="143" fill="#a6adc8" fontSize="9" textAnchor="middle">600 ms</text>

      {/* 1. 1-PHASE AR SUCCESS (Ia fault -> pause -> restored) */}
      {type === '1ph_ar' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,-10 220,70 T 250,70 T 280,70 L 430,70 Q 445,45 460,70 T 490,70 T 520,70 T 550,70 T 580,70 T 610,70" fill="none" stroke="#f38ba8" strokeWidth="2" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 200,70 T 230,70 T 260,70 T 290,70 T 320,70 T 350,70 T 380,70 T 410,70 T 440,70 T 470,70 T 500,70 T 530,70 T 560,70 T 590,70 T 620,70" fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 208,70 T 238,70 T 268,70 T 298,70 T 328,70 T 358,70 T 388,70 T 418,70 T 448,70 T 478,70 T 508,70 T 538,70 T 568,70 T 598,70 T 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}

      {/* 2. 3-PHASE AR FAILED (3ph fault -> pause -> reclosed on fault -> trip lockout -> 0 A on all phases) */}
      {type === '3ph_ar_fail' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,-10 220,70 T 250,70 T 280,70 L 430,70 Q 445,-10 460,70 T 490,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="2" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,150 220,70 T 250,70 T 280,70 L 430,70 Q 445,150 460,70 T 490,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 190,70 Q 205,-5 220,70 T 250,70 T 280,70 L 430,70 Q 445,-5 460,70 T 490,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}

      {/* 3. A-B PHASE TO PHASE FAULT (Lockout -> 0 A on all 3 phases after trip) */}
      {type === 'permanent_2ph_ab' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,-10 220,70 T 250,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="2" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,150 220,70 T 250,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="2" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 208,70 T 238,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.2" />
        </>
      )}

      {/* 4. B-C PHASE TO PHASE FAULT (Lockout -> 0 A on all 3 phases after trip) */}
      {type === 'permanent_2ph_bc' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 200,70 T 230,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="1.2" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,150 220,70 T 250,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="2" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 190,70 Q 205,-15 220,70 T 250,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="2" />
        </>
      )}

      {/* 5. DIFFERENTIAL 1-PHASE (Fast trip -> 0 A on all 3 phases after trip) */}
      {type === 'diff_1ph' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,-20 220,70 T 250,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="2.5" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 200,70 T 230,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 208,70 T 238,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}

      {/* 6. BUSBAR 3-PHASE FAULT (0 A on all 3 phases after trip) */}
      {type === 'bus_3ph' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,-25 220,70 T 250,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="2.5" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,165 220,70 T 250,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="2.5" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 190,70 Q 205,-25 220,70 T 250,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="2.5" />
        </>
      )}

      {/* 7. 10KV ISOLATED NEUTRAL EARTH FAULT (67N Trip -> 0 A on all phases after trip) */}
      {type === 'earth_67n' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,55 220,70 T 250,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="1.5" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 200,70 T 230,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 208,70 T 238,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}

      {/* 8. MOTOR THERMAL OVERLOAD (49 Trip -> 0 A on all phases after trip) */}
      {type === 'motor_thermal' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,25 220,70 T 250,70 T 280,70 T 310,70 T 340,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="2" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,115 220,70 T 250,70 T 280,70 T 310,70 T 340,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="2" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 190,70 Q 205,25 220,70 T 250,70 T 280,70 T 310,70 T 340,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="2" />
        </>
      )}

      {/* 9. FALSE TRIP (Breaker opens mechanically -> 0 A on all phases) */}
      {type === 'false_trip' && (
        <>
          <path d="M 50,70 Q 65,45 80,70 T 110,70 T 140,70 T 170,70 T 200,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="1.5" />
          <path d="M 50,70 Q 65,95 80,70 T 110,70 T 140,70 T 170,70 T 200,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          <path d="M 50,88 Q 72,45 88,70 T 118,70 T 148,70 T 178,70 T 208,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

/* ==================== SVG VOLTAGE WAVEFORMS ==================== */

function VoltageWaveformSvg({ type, maxVal = "127.0 kV" }) {
  return (
    <svg viewBox="0 0 650 150" className="w-full h-36">
      <line x1="50" y1="20" x2="620" y2="20" stroke="#2a2b3d" strokeDasharray="2,2" />
      <line x1="50" y1="45" x2="620" y2="45" stroke="#2a2b3d" strokeDasharray="2,2" />
      <line x1="50" y1="70" x2="620" y2="70" stroke="#45475a" strokeWidth="1" />
      <line x1="50" y1="95" x2="620" y2="95" stroke="#2a2b3d" strokeDasharray="2,2" />
      <line x1="50" y1="120" x2="620" y2="120" stroke="#2a2b3d" strokeDasharray="2,2" />

      <line x1="50" y1="10" x2="50" y2="130" stroke="#6c7086" strokeWidth="1.5" />
      <text x="45" y="23" fill="#a6adc8" fontSize="9" textAnchor="end">+{maxVal}</text>
      <text x="45" y="73" fill="#a6adc8" fontSize="9" textAnchor="end">0 kV</text>
      <text x="45" y="123" fill="#a6adc8" fontSize="9" textAnchor="end">-{maxVal}</text>

      <line x1="50" y1="130" x2="630" y2="130" stroke="#6c7086" strokeWidth="1.5" />

      {/* 1. 1-PHASE AR VOLTAGE (Va drops to 0, recovers after successful AR) */}
      {type === '1ph_ar' && (
        <>
          <path d="M 50,70 Q 65,25 80,70 T 110,70 T 140,70 T 170,70 T 190,70 L 430,70 Q 445,25 460,70 T 490,70 T 520,70 T 550,70 T 580,70 T 610,70" fill="none" stroke="#f38ba8" strokeWidth="2" />
          <path d="M 50,70 Q 65,115 80,70 T 110,70 T 140,70 T 170,70 T 200,70 T 230,70 T 260,70 T 290,70 T 320,70 T 350,70 T 380,70 T 410,70 T 440,70 T 470,70 T 500,70 T 530,70 T 560,70 T 590,70 T 620,70" fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          <path d="M 50,100 Q 72,25 88,70 T 118,70 T 148,70 T 178,70 T 208,70 T 238,70 T 268,70 T 298,70 T 328,70 T 358,70 T 388,70 T 418,70 T 448,70 T 478,70 T 508,70 T 538,70 T 568,70 T 598,70 T 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}

      {/* 2. 3-PHASE AR FAILED VOLTAGE (All voltages 0 kV permanently after Lockout) */}
      {type === '3ph_ar_fail' && (
        <>
          <path d="M 50,70 Q 65,25 80,70 T 110,70 T 140,70 T 170,70 T 190,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="2" />
          <path d="M 50,70 Q 65,115 80,70 T 110,70 T 140,70 T 170,70 T 190,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          <path d="M 50,100 Q 72,25 88,70 T 118,70 T 148,70 T 178,70 T 190,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}

      {/* 3. A-B FAULT VOLTAGE (Va, Vb drop on fault -> 0 kV on all 3 phases after Lockout) */}
      {type === 'permanent_2ph_ab' && (
        <>
          <path d="M 50,70 Q 65,25 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,50 220,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="2" />
          <path d="M 50,70 Q 65,115 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,90 220,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="2" />
          <path d="M 50,100 Q 72,25 88,70 T 118,70 T 148,70 T 178,70 T 208,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}

      {/* 4. B-C FAULT VOLTAGE (Vb, Vc drop on fault -> 0 kV on all 3 phases after Lockout) */}
      {type === 'permanent_2ph_bc' && (
        <>
          <path d="M 50,70 Q 65,25 80,70 T 110,70 T 140,70 T 170,70 T 200,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="1.5" />
          <path d="M 50,70 Q 65,115 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,90 220,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="2" />
          <path d="M 50,100 Q 72,25 88,70 T 118,70 T 148,70 T 178,70 T 190,70 Q 205,50 220,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="2" />
        </>
      )}

      {/* 5. 10KV EARTH FAULT (67N) (Va=0, Vb/Vc shift during fault -> 0 kV on all phases after trip) */}
      {type === 'earth_67n' && (
        <>
          <path d="M 50,70 Q 65,25 80,70 T 110,70 T 140,70 T 170,70 T 190,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="2" />
          <path d="M 50,70 Q 65,115 80,70 T 110,70 T 140,70 T 170,70 T 190,70 Q 205,130 220,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="2" />
          <path d="M 50,100 Q 72,25 88,70 T 118,70 T 148,70 T 178,70 T 190,70 Q 205,10 220,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="2" />
        </>
      )}

      {/* 6. ALL OTHER LOCKOUT / PERMANENT TRIPS (0 kV on all 3 phases after trip) */}
      {(type === 'diff_1ph' || type === 'bus_3ph' || type === 'motor_thermal' || type === 'false_trip') && (
        <>
          <path d="M 50,70 Q 65,25 80,70 T 110,70 T 140,70 T 170,70 T 200,70 T 230,70 L 620,70" fill="none" stroke="#f38ba8" strokeWidth="1.5" />
          <path d="M 50,70 Q 65,115 80,70 T 110,70 T 140,70 T 170,70 T 200,70 T 230,70 L 620,70" fill="none" stroke="#89b4fa" strokeWidth="1.5" />
          <path d="M 50,100 Q 72,25 88,70 T 118,70 T 148,70 T 178,70 T 208,70 T 238,70 L 620,70" fill="none" stroke="#a6e3a1" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

function DigitalSignalsSvg({ type }) {
  const isARSuccess = type === '1ph_ar';
  const isARFail = type === '3ph_ar_fail';

  return (
    <svg viewBox="0 0 650 70" className="w-full h-16">
      <text x="10" y="20" fill="#f38ba8" fontSize="10" fontWeight="bold">TRIP</text>
      {isARFail ? (
        <path d="M 50,22 L 280,22 L 280,8 L 350,8 L 350,22 L 430,22 L 430,8 L 620,8" fill="none" stroke="#f38ba8" strokeWidth="2" />
      ) : (
        <path d="M 50,22 L 280,22 L 280,8 L 430,8 L 430,22 L 620,22" fill="none" stroke="#f38ba8" strokeWidth="2" />
      )}

      <text x="10" y="42" fill="#a6e3a1" fontSize="10" fontWeight="bold">79 CLOSE</text>
      {isARSuccess ? (
        <path d="M 50,42 L 280,42 L 430,42 L 430,28 L 620,28" fill="none" stroke="#a6e3a1" strokeWidth="2" />
      ) : isARFail ? (
        <path d="M 50,42 L 390,42 L 390,28 L 430,28 L 430,42 L 620,42" fill="none" stroke="#a6e3a1" strokeWidth="2" />
      ) : (
        <line x1="50" y1="42" x2="620" y2="42" stroke="#585b70" strokeWidth="2" />
      )}

      <text x="10" y="62" fill="#f9e2af" fontSize="10" fontWeight="bold">LOCKOUT</text>
      {isARFail ? (
        <path d="M 50,62 L 430,62 L 430,48 L 620,48" fill="none" stroke="#f9e2af" strokeWidth="2" />
      ) : (
        <line x1="50" y1="62" x2="620" y2="62" stroke="#585b70" strokeWidth="2" />
      )}
    </svg>
  );
}