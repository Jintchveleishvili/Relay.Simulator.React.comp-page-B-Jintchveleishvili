import React, { useState, useMemo } from 'react';

const FAULT_CONFIGS = {
  line_220_1ar_success: {
    title: '⚡ 220კვ 1-ფაზა აგჩ (წარმატებული)',
    relay: 'SEL-311L (21/79)',
    system: '220 კვ ეგხ',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (Effective Grounded)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი (In = 1.0)', type: 'info' },
      { time: '0.000s', event: 'ავარიის დასაწყისი (A-G 1-ფაზა მ.შ.)', type: 'danger' },
      { time: '0.025s', event: '21/87L დაცვის ამოქმედება, Q-220 A-ფაზის გამორთვა', type: 'warn' },
      { time: '0.030s', event: 'SEL 79 აგჩ-ს პაუზის ათვლა (1.00 წმ)', type: 'info' },
      { time: '1.030s', event: 'SEL 79 აგჩ-ს იმპულსი -> Q-220 A-ფაზის ჩართვა', type: 'info' },
      { time: '1.050s', event: 'ეგხ-ს წარმატებული აღდგენა, ნორმალური რეჟიმი', type: 'success' }
    ],
    parameters: {
      faultCurrent: '18.4 კა',
      faultVoltage: '120.0 კვ',
      tripTime: '0.025 წმ',
      arPauseTime: '1.00 წმ',
      arStatus: '✅ წარმატებული (1-ფაზა)',
      zeroSeqCurrent: '280 A (3I0)'
    }
  },
  line_220_3ar_failed: {
    title: '⚡ 220კვ 3-ფაზა აგჩ (უშედეგო - LOCKOUT)',
    relay: 'SEL-311L (21/79)',
    system: '220 კვ ეგხ',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (Effective Grounded)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი (In = 1.0)', type: 'info' },
      { time: '0.000s', event: '3-ფაზა მდგრადი მოკლე შერთვის დასაწყისი (A-B-C-G)', type: 'danger' },
      { time: '0.025s', event: '1-ლი სამფაზა გამორთვა (21 1-ლი ზონა / Q-220)', type: 'danger' },
      { time: '0.030s', event: 'SEL 79 აგჩ-ს პაუზის ათვლა (0.80 წმ)', type: 'info' },
      { time: '0.830s', event: '1-ლი აგჩ ჩართვა -> შეტრიალება მყარ მ.შ.-ზე', type: 'warn' },
      { time: '0.855s', event: 'საბოლოო სამფაზა გამორთვა და ბლოკირება (LOCKOUT)', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '24.2 კა',
      faultVoltage: '0.0 კვ',
      tripTime: '0.025 წმ',
      arPauseTime: '0.80 წმ (1-ჯერადი აგჩ)',
      arStatus: '❌ უშედეგო (LOCKOUT)',
      zeroSeqCurrent: '0 A (სიმეტრიული 3-ფაზა მ.შ.)'
    }
  },
  line_a_fault_ar: {
    title: '🔔 110კვ ეგხ "მაგისტრალი ა" (1-ფაზა აგჩ)',
    relay: 'SEL-311L (87L/79)',
    system: '110 კვ ეგხ',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (Effective Grounded)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: 'A-ფაზის მიწაზე გარდამავალი მ.შ. (1-ფაზა)', type: 'danger' },
      { time: '0.020s', event: 'Q-110 A-ფაზის გამორთვა', type: 'warn' },
      { time: '0.025s', event: 'SEL 79 აგჩ-ს პაუზის ათვლა (0.50 წმ)', type: 'info' },
      { time: '0.525s', event: 'SEL 79 აგჩ ჩართვა -> ხაზი აღდგენილია', type: 'success' }
    ],
    parameters: {
      faultCurrent: '8.2 კა (A-ფაზა)',
      faultVoltage: '32.0 კვ',
      tripTime: '0.020 წმ',
      arPauseTime: '0.50 წმ',
      arStatus: '✅ წარმატებული (1-ფაზა)',
      zeroSeqCurrent: '180 A (3I0)'
    }
  },
  line_a_fault_permanent: {
    title: '🚨 110კვ ეგხ "მაგისტრალი ა" (3-ფაზა მდგრადი / Lockout)',
    relay: 'SEL-311L (21/79 Block)',
    system: '110 კვ ეგხ',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (Effective Grounded)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: '3-ფაზა მყარი მოკლე შერთვის დასაწყისი', type: 'danger' },
      { time: '0.025s', event: '21 დისტანციური დაცვის ამოქმედება, სამფაზა გათიშვა', type: 'danger' },
      { time: '0.030s', event: 'აგჩ ბლოკირებულია (79 Block - მდგრადი მ.შ.)', type: 'info' }
    ],
    parameters: {
      faultCurrent: '13.5 კა',
      faultVoltage: '0.0 კვ',
      tripTime: '0.025 წმ',
      arPauseTime: 'ბლოკირებულია',
      arStatus: '🚫 ბლოკირებული (Lockout)',
      zeroSeqCurrent: '0 A (სიმეტრიული 3-ფაზა მ.შ.)'
    }
  },
  at1_diff: {
    title: '🔷 AT-1 დიფერენციალური (87AT / 79 Block)',
    relay: 'SEL-487E (87AT)',
    system: 'ავტოტრანსფორმატორი AT-1',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (220/110კვ მხარეს)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: '87AT შიდა დიფერენციალური მ.შ. (სიმეტრიული)', type: 'danger' },
      { time: '0.015s', event: 'SEL-487E მყისიერი ამოქმედება', type: 'danger' },
      { time: '0.030s', event: '220კვ და 110კვ ამომრთველების გამორთვა', type: 'danger' },
      { time: '0.035s', event: '86 Lockout რელეს ამოქმედება, აგჩ ბლოკირება', type: 'info' }
    ],
    parameters: {
      faultCurrent: '3.85 კა',
      faultVoltage: '78.5 კვ',
      tripTime: '0.015 წმ',
      arPauseTime: 'ბლოკირებულია',
      arStatus: '🚫 ბლოკირებული (86 Lockout)',
      zeroSeqCurrent: '0 A (სიმეტრიული 3-ფაზა მ.შ.)'
    }
  },
  at2_diff: {
    title: '🔷 AT-2 დიფერენციალური (87AT / 79 Block)',
    relay: 'SEL-487E (87AT)',
    system: 'ავტოტრანსფორმატორი AT-2',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (220/110კვ მხარეს)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: '87AT დიფერენციალური დაცვის ამოქმედება (სიმეტრიული)', type: 'danger' },
      { time: '0.018s', event: 'AT-2-ის ყველა მხარის ამომრთველების გათიშვა', type: 'danger' },
      { time: '0.020s', event: 'აგჩ-ს ბლოკირება', type: 'info' }
    ],
    parameters: {
      faultCurrent: '5.20 კა',
      faultVoltage: '62.0 კვ',
      tripTime: '0.018 წმ',
      arPauseTime: 'ბლოკირებულია',
      arStatus: '🚫 ბლოკირებული',
      zeroSeqCurrent: '0 A (სიმეტრიული 3-ფაზა მ.შ.)'
    }
  },
  bus1_fault: {
    title: '⚡ 110კვ I სექციის მ.შ. (87B / 79 Block)',
    relay: 'SEL-487B (87B)',
    system: '110 კვ I სექცია',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (სალტეების ზონა)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: '110კვ I სექციის სალტეზე სამფაზა მ.შ.', type: 'danger' },
      { time: '0.012s', event: '87B სალტის დიფერენციალური დაცვის ამოქმედება', type: 'danger' },
      { time: '0.025s', event: 'I სექციის ყველა ამომრთველისა და Q-110-ის გამორთვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '15.6 კა',
      faultVoltage: '0.0 კვ',
      tripTime: '0.012 წმ',
      arPauseTime: 'ბლოკირებულია',
      arStatus: '🚫 ბლოკირებული (87B)',
      zeroSeqCurrent: '0 A (სიმეტრიული)'
    }
  },
  bus2_fault: {
    title: '⚡ 110კვ II სექციის მ.შ. (87B / 79 Block)',
    relay: 'SEL-487B (87B)',
    system: '110 კვ II სექცია',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (სალტეების ზონა)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: '110კვ II სექციის სალტეზე სამფაზა მ.შ.', type: 'danger' },
      { time: '0.012s', event: '87B სალტის დიფერენციალური დაცვის ამოქმედება', type: 'danger' },
      { time: '0.025s', event: 'II სექციის ყველა ამომრთველისა და Q-110-ის გამორთვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '14.8 კა',
      faultVoltage: '0.0 კვ',
      tripTime: '0.012 წმ',
      arPauseTime: 'ბლოკირებულია',
      arStatus: '🚫 ბლოკირებული (87B)',
      zeroSeqCurrent: '0 A (სიმეტრიული)'
    }
  },
  t1_fault: {
    title: '⚡ ტრანსფორმატორი T-1 (87T)',
    relay: 'SEL-487E (87T)',
    system: 'ტრანსფორმატორი T-1 (110/10კვ)',
    neutralMode: 'შერეული: ყრუდდამიწებული (110კვ) / იზოლირებული (10კვ)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: 'T-1 შიდა დიფერენციალური მ.შ. (არასიმეტრიული)', type: 'danger' },
      { time: '0.020s', event: '87T დაცვის ამოქმედება', type: 'danger' },
      { time: '0.035s', event: 'T-1 110კვ და 10კვ ამომრთველების გათიშვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '4.15 კა',
      faultVoltage: '71.0 კვ',
      tripTime: '0.020 წმ',
      arPauseTime: 'ბლოკირებულია',
      arStatus: '🚫 ბლოკირებული',
      zeroSeqCurrent: '920 A (3I0)'
    }
  },
  t2_fault: {
    title: '⚡ ტრანსფორმატორი T-2 (87T)',
    relay: 'SEL-487E (87T)',
    system: 'ტრანსფორმატორი T-2 (110/35/6კვ)',
    neutralMode: 'შერეული: ყრუდდამიწებული (110) / იზოლირებული (35/6კვ)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: 'T-2 შიდა დიფერენციალური მ.შ. (სიმეტრიული)', type: 'danger' },
      { time: '0.020s', event: '87T დაცვის ამოქმედება', type: 'danger' },
      { time: '0.035s', event: 'T-2 110კვ, 35კვ და 6კვ ამომრთველების გათიშვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '3.90 კა',
      faultVoltage: '12.0 კვ',
      tripTime: '0.020 წმ',
      arPauseTime: 'ბლოკირებულია',
      arStatus: '🚫 ბლოკირებული',
      zeroSeqCurrent: '0 A (სიმეტრიული 3-ფაზა მ.შ.)'
    }
  },
  line_35_fault: {
    title: '📱 35კვ ქარხნის ხაზი (21)',
    relay: 'SEL-421 (21 - დისტანციური)',
    system: '35 კვ ხაზი',
    neutralMode: 'იზოლირებული ნეიტრალი (Isolated Neutral)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: '35კვ ხაზზე მ.შ. (იზოლირებული ნეიტრალი)', type: 'danger' },
      { time: '0.020s', event: 'SEL-421 დისტანციური დაცვის ამოქმედება', type: 'danger' },
      { time: '0.040s', event: '35კვ ამომრთველის გათიშვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '2.10 კა',
      faultVoltage: '8.5 კვ',
      tripTime: '0.020 წმ',
      arPauseTime: 'არ გამოიყენება',
      arStatus: 'გათიშულია',
      zeroSeqCurrent: '12 A (3I0 - ტევადური)'
    }
  },
  feeder_city_fault: {
    title: '📊 10კვ საქალაქო ფიდერი (50/51)',
    relay: 'SEL-351A (50/51)',
    system: '10 კვ საქალაქო ფიდერი',
    neutralMode: 'კომპენსირებული ნეიტრალი (R-მახშობელი ხვეულით)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: '10კვ ფიდერზე მრავალფაზა მ.შ.', type: 'danger' },
      { time: '0.150s', event: '50/51 დენური დაცვის დაყოვნების ათვლა', type: 'warn' },
      { time: '0.350s', event: 'ფიდერის ამომრთველის გათიშვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '1.45 კა',
      faultVoltage: '2.1 კვ',
      tripTime: '0.350 წმ',
      arPauseTime: 'არ გამოიყენება',
      arStatus: 'გათიშულია',
      zeroSeqCurrent: '0 A (სიმეტრიული მ.შ.)'
    }
  },
  feeder_reg_fault: {
    title: '⚠️ 10კვ რეგიონული ფიდერი (67N)',
    relay: 'SEL-351S (67N)',
    system: '10 კვ რეგიონული ფიდერი',
    neutralMode: 'იზოლირებული ნეიტრალი (Isolated Neutral)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: '10კვ ქსელში მიწაზე ერთფაზა შერთვა', type: 'danger' },
      { time: '0.200s', event: '67N მიმართული მიწის დაცვის სექტორის განსაზღვრა', type: 'warn' },
      { time: '0.500s', event: 'ფიდერის გამორთვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '45 A (ტევადური)',
      faultVoltage: '9.8 კვ',
      tripTime: '0.500 წმ',
      arPauseTime: 'არ გამოიყენება',
      arStatus: 'გათიშულია',
      zeroSeqCurrent: '45 A (3I0 - ტევადური)'
    }
  },
  motor_fault: {
    title: '⚙️ 6კვ ასინქრონული ძრავი (701)',
    relay: 'SEL-701 (49/50/51)',
    system: '6 კვ ასინქრონული ძრავა',
    neutralMode: 'იზოლირებული ნეიტრალი (Isolated Neutral)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: 'ძრავას ტექნოლოგიური ჭედვა / გადატვირთვა', type: 'danger' },
      { time: '0.400s', event: '49 თერმული მოდელის კრიტიკული გაცხელება', type: 'warn' },
      { time: '0.800s', event: 'SEL-701-ის მიერ კონტაქტორის/ამომრთველის გათიშვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '890 A',
      faultVoltage: '3.2 კვ',
      tripTime: '0.800 წმ',
      arPauseTime: 'არ გამოიყენება',
      arStatus: 'გათიშულია',
      zeroSeqCurrent: '0 A (სიმეტრიული მ.შ.)'
    }
  },
  bus_coupler_fault: {
    title: '🟦 სექციური Q-110 (ყალბი გამორთვა)',
    relay: 'SEL-451',
    system: '110 კვ სექციური ამომრთველი',
    neutralMode: 'ყრუდდამიწებული ნეიტრალი (სალტეების ზონა)',
    timeEvents: [
      { time: '-0.050s', event: 'ავარიამდელი ნორმალური რეჟიმი', type: 'info' },
      { time: '0.000s', event: 'გარე ოპერატიული წრედის ყალბი იმპულსი', type: 'warn' },
      { time: '0.010s', event: 'Q-110 სექციური ამომრთველის გამორთვა', type: 'danger' }
    ],
    parameters: {
      faultCurrent: '0 A',
      faultVoltage: '110.0 კვ',
      tripTime: '0.010 წმ',
      arPauseTime: 'არ გამოიყენება',
      arStatus: 'გამორთულია',
      zeroSeqCurrent: '0 A'
    }
  }
};

export default function FaultAnalysisPage({ selectedFaultId = 'line_220_1ar_success', onBackToSchema }) {
  const [activeTab, setActiveTab] = useState(selectedFaultId);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPhases, setShowPhases] = useState({ A: true, B: true, C: true });
  const [showVoltagePhases, setShowVoltagePhases] = useState({ A: true, B: true, C: true });

  const currentConfig = FAULT_CONFIGS[activeTab] || FAULT_CONFIGS.line_220_1ar_success;

  const { currentWaves, voltageWaves, arMarkers } = useMemo(() => {
    const pointsCount = 600;
    const isFailed3AR = activeTab === 'line_220_3ar_failed';
    const isSingleAR = activeTab === 'line_220_1ar_success';
    const isLineA_AR = activeTab === 'line_a_fault_ar';
    const isLineA_Perm = activeTab === 'line_a_fault_permanent';
    const is35kVFault = activeTab === 'line_35_fault';
    const isRegFeederFault = activeTab === 'feeder_reg_fault';
    const isMotorFault = activeTab === 'motor_fault';
    const isCityFeederFault = activeTab === 'feeder_city_fault';
    const isT1Fault = activeTab === 't1_fault';

    let currentA = [], currentB = [], currentC = [];
    let voltageA = [], voltageB = [], voltageC = [];
    let markers = [];

    for (let i = 0; i < pointsCount; i++) {
      const t = i / (pointsCount - 1);
      const rad = t * Math.PI * 55;
      let ampA_I = 1.0, ampB_I = 1.0, ampC_I = 1.0;
      let ampA_U = 1.0, ampB_U = 1.0, ampC_U = 1.0;

      // 3-ფაზა აგჩ (ერთჯერადი შეტრიალება -> მყარი მ.შ. -> LOCKOUT)
      if (isFailed3AR) {
        if (t < 0.10) { // 1. Pre-fault
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.10 && t < 0.25) { // 2. პირველი მოკლე შერთვა
          ampA_I = 3.2; ampB_I = 3.2; ampC_I = 3.2;
          ampA_U = 0.05; ampB_U = 0.05; ampC_U = 0.05;
        } else if (t >= 0.25 && t < 0.60) { // 3. 1-ლი გათიშვა / აგჩ-ს პაუზა (0.80s)
          ampA_I = 0.0; ampB_I = 0.0; ampC_I = 0.0;
          ampA_U = 0.0; ampB_U = 0.0; ampC_U = 0.0;
        } else if (t >= 0.60 && t < 0.75) { // 4. 1-ლი აგჩ ჩართვა -> მყარი მოკლე შერთვა!
          ampA_I = 3.2; ampB_I = 3.2; ampC_I = 3.2;
          ampA_U = 0.05; ampB_U = 0.05; ampC_U = 0.05;
        } else { // 5. საბოლოო გამორთვა (LOCKOUT)
          ampA_I = 0.0; ampB_I = 0.0; ampC_I = 0.0;
          ampA_U = 0.0; ampB_U = 0.0; ampC_U = 0.0;
        }
      } else if (isT1Fault) {
        if (t < 0.08) {
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.08 && t < 0.25) {
          ampA_I = 3.4; ampB_I = 1.8; ampC_I = 1.8;
          ampA_U = 0.2; ampB_U = 0.7; ampC_U = 0.7;
        } else {
          ampA_I = 0.0; ampB_I = 0.0; ampC_I = 0.0;
          ampA_U = 0.0; ampB_U = 0.0; ampC_U = 0.0;
        }
      } else if (is35kVFault || isRegFeederFault) {
        if (t < 0.08) {
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.08 && t < 0.35) {
          ampA_I = isRegFeederFault ? 1.5 : 2.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 0.05; ampB_U = 1.73; ampC_U = 1.73;
        } else {
          ampA_I = 0.0; ampB_I = 0.0; ampC_I = 0.0;
          ampA_U = 0.0; ampB_U = 0.0; ampC_U = 0.0;
        }
      } else if (isMotorFault) {
        if (t < 0.08) {
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.08 && t < 0.45) {
          ampA_I = 2.5; ampB_I = 2.5; ampC_I = 2.5;
          ampA_U = 0.8; ampB_U = 0.8; ampC_U = 0.8;
        } else {
          ampA_I = 0.0; ampB_I = 0.0; ampC_I = 0.0;
          ampA_U = 0.0; ampB_U = 0.0; ampC_U = 0.0;
        }
      } else if (isCityFeederFault) {
        if (t < 0.08) {
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.08 && t < 0.35) {
          ampA_I = 3.0; ampB_I = 3.0; ampC_I = 3.0;
          ampA_U = 0.1; ampB_U = 0.1; ampC_U = 0.1;
        } else {
          ampA_I = 0.0; ampB_I = 0.0; ampC_I = 0.0;
          ampA_U = 0.0; ampB_U = 0.0; ampC_U = 0.0;
        }
      } else if (isLineA_Perm) {
        if (t < 0.08) {
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.08 && t < 0.28) {
          ampA_I = 3.2; ampB_I = 3.2; ampC_I = 3.2;
          ampA_U = 0.1; ampB_U = 0.1; ampC_U = 0.1;
        } else {
          ampA_I = 0.0; ampB_I = 0.0; ampC_I = 0.0;
          ampA_U = 0.0; ampB_U = 0.0; ampC_U = 0.0;
        }
      } else if (isSingleAR || isLineA_AR) {
        if (t < 0.08) {
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.08 && t < 0.25) {
          ampA_I = 3.5; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 0.2; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.25 && t < 0.65) {
          ampA_I = 0.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 0.0; ampB_U = 1.0; ampC_U = 1.0;
        } else {
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        }
      } else {
        if (t < 0.08) {
          ampA_I = 1.0; ampB_I = 1.0; ampC_I = 1.0;
          ampA_U = 1.0; ampB_U = 1.0; ampC_U = 1.0;
        } else if (t >= 0.08 && t < 0.28) {
          ampA_I = 2.8; ampB_I = 2.8; ampC_I = 2.8;
          ampA_U = 0.2; ampB_U = 0.2; ampC_U = 0.2;
        } else {
          ampA_I = 0.0; ampB_I = 0.0; ampC_I = 0.0;
          ampA_U = 0.0; ampB_U = 0.0; ampC_U = 0.0;
        }
      }

      const x = i * 1.5 * zoomLevel;

      const valA_I = Math.sin(rad) * ampA_I;
      const valB_I = Math.sin(rad - (2 * Math.PI / 3)) * ampB_I;
      const valC_I = Math.sin(rad - (4 * Math.PI / 3)) * ampC_I;
      currentA.push(`${x},${100 - valA_I * 28}`);
      currentB.push(`${x},${100 - valB_I * 28}`);
      currentC.push(`${x},${100 - valC_I * 28}`);

      const valA_U = Math.sin(rad) * ampA_U;
      const valB_U = Math.sin(rad - (2 * Math.PI / 3)) * ampB_U;
      const valC_U = Math.sin(rad - (4 * Math.PI / 3)) * ampC_U;
      voltageA.push(`${x},${100 - valA_U * 28}`);
      voltageB.push(`${x},${100 - valB_U * 28}`);
      voltageC.push(`${x},${100 - valC_U * 28}`);
    }

    if (isFailed3AR) {
      markers = [
        { x: 0.10 * 600 * 1.5 * zoomLevel, text: '💥 მ.შ. (0.00s)', color: '#f38ba8' },
        { x: 0.25 * 600 * 1.5 * zoomLevel, text: '🔴 1-ლი გათიშვა', color: '#f9e2af' },
        { x: 0.60 * 600 * 1.5 * zoomLevel, text: '🔄 აგჩ -> მყარი მ.შ.', color: '#f38ba8' },
        { x: 0.75 * 600 * 1.5 * zoomLevel, text: '🚫 LOCKOUT', color: '#f38ba8' }
      ];
    } else {
      markers = [
        { x: 0.08 * 600 * 1.5 * zoomLevel, text: 'Fault (0.00s)', color: '#f38ba8' }
      ];
    }

    return {
      currentWaves: { pathA: currentA.join(' '), pathB: currentB.join(' '), pathC: currentC.join(' ') },
      voltageWaves: { pathA: voltageA.join(' '), pathB: voltageB.join(' '), pathC: voltageC.join(' ') },
      arMarkers: markers
    };
  }, [activeTab, zoomLevel]);

  return (
    <div className="w-screen min-h-screen bg-[#0f0f14] p-3 flex flex-col font-sans text-[#cdd6f4]">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-[#161622] p-3 rounded border border-[#313244] mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSchema}
            className="bg-[#313244] hover:bg-[#45475a] text-[#89b4fa] font-bold text-[12px] px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1"
          >
            ➔ უკან სქემაზე
          </button>
          <h2 className="text-[#89b4fa] text-[15px] font-bold m-0 flex items-center gap-2">
            <span>📉</span> SynchroWAVE COMTRADE ოსცილოგრამების სიღრმისეული ანალიზი
          </h2>
        </div>
        <div className="text-[11px] font-mono text-[#a6adc8]">
          ფაილი: <span className="text-[#f9e2af]">SEL_R311L_FAULT_{activeTab.toUpperCase()}.RER</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3 flex-1">
        {/* მარცხენა მენიუ: ავარიების სია */}
        <div className="bg-[#161622] p-2.5 rounded border border-[#313244] flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-100px)]">
          <h4 className="text-[#f38ba8] text-[12px] font-bold m-0 mb-1 border-b border-[#313244] pb-1">
            💥 ავარიული სცენარები (15 რეჟიმი)
          </h4>
          {Object.keys(FAULT_CONFIGS).map((key) => {
            const item = FAULT_CONFIGS[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`text-left p-2 rounded text-[11px] font-medium transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#2a2a3e] text-[#89b4fa] border-[#89b4fa] font-bold shadow'
                    : 'bg-[#181825] text-[#cdd6f4] border-[#313244] hover:bg-[#212130]'
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        {/* მარჯვენა ნაწილი: ოსცილოგრამები & პარამეტრები */}
        <div className="flex flex-col gap-3">
          {/* დენის ტალღების პანელი */}
          <div className="bg-[#161622] p-3 rounded border border-[#313244] flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-[#313244] pb-2">
              <h3 className="text-[#89b4fa] text-[13px] font-bold m-0 flex items-center gap-2">
                <span>🌊</span> {currentConfig.title} — დენის ტალღები (IA, IB, IC)
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 text-[10px] font-mono">
                  <label className="flex items-center gap-1 text-[#f38ba8] cursor-pointer">
                    <input type="checkbox" checked={showPhases.A} onChange={(e) => setShowPhases({ ...showPhases, A: e.target.checked })} />
                    Phase A
                  </label>
                  <label className="flex items-center gap-1 text-[#a6e3a1] cursor-pointer">
                    <input type="checkbox" checked={showPhases.B} onChange={(e) => setShowPhases({ ...showPhases, B: e.target.checked })} />
                    Phase B
                  </label>
                  <label className="flex items-center gap-1 text-[#89b4fa] cursor-pointer">
                    <input type="checkbox" checked={showPhases.C} onChange={(e) => setShowPhases({ ...showPhases, C: e.target.checked })} />
                    Phase C
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.2))} className="bg-[#313244] text-[#cdd6f4] px-2 py-0.5 rounded text-[10px] cursor-pointer">🔍 -</button>
                  <span className="text-[10px] font-mono text-[#a6adc8]">{(zoomLevel * 100).toFixed(0)}%</span>
                  <button onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.2))} className="bg-[#313244] text-[#cdd6f4] px-2 py-0.5 rounded text-[10px] cursor-pointer">🔍 +</button>
                </div>
              </div>
            </div>

            {/* SVG Current Visualizer */}
            <div className="bg-[#09090d] border border-[#222330] rounded p-2 overflow-x-auto relative min-h-[180px]">
              <svg viewBox={`0 0 ${900 * zoomLevel} 200`} className="w-full h-[180px] pointer-events-none">
                <line x1="0" y1="100" x2={900 * zoomLevel} y2="100" stroke="#313244" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* დროითი მარკერები */}
                {arMarkers.map((m, idx) => (
                  <g key={idx}>
                    <line x1={m.x} y1="0" x2={m.x} y2="200" stroke={m.color} strokeWidth="1" strokeDasharray="3 3" />
                    <text x={m.x + 3} y={15 + (idx % 2) * 12} fill={m.color} fontSize="8px" fontFamily="monospace">{m.text}</text>
                  </g>
                ))}
                <text x="5" y="15" fill="#a6adc8" fontSize="8px" fontFamily="monospace">Pre-fault</text>
                {showPhases.A && <polyline fill="none" stroke="#f38ba8" strokeWidth="2" points={currentWaves.pathA} />}
                {showPhases.B && <polyline fill="none" stroke="#a6e3a1" strokeWidth="2" points={currentWaves.pathB} />}
                {showPhases.C && <polyline fill="none" stroke="#89b4fa" strokeWidth="2" points={currentWaves.pathC} />}
              </svg>
            </div>
          </div>

          {/* ძაბვის ტალღების პანელი */}
          <div className="bg-[#161622] p-3 rounded border border-[#313244] flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-[#313244] pb-2">
              <h3 className="text-[#f9e2af] text-[13px] font-bold m-0 flex items-center gap-2">
                <span>⚡</span> {currentConfig.title} — ძაბვის ტალღები (UA, UB, UC)
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 text-[10px] font-mono">
                  <label className="flex items-center gap-1 text-[#f38ba8] cursor-pointer">
                    <input type="checkbox" checked={showVoltagePhases.A} onChange={(e) => setShowVoltagePhases({ ...showVoltagePhases, A: e.target.checked })} />
                    Phase A (UA)
                  </label>
                  <label className="flex items-center gap-1 text-[#a6e3a1] cursor-pointer">
                    <input type="checkbox" checked={showVoltagePhases.B} onChange={(e) => setShowVoltagePhases({ ...showVoltagePhases, B: e.target.checked })} />
                    Phase B (UB)
                  </label>
                  <label className="flex items-center gap-1 text-[#89b4fa] cursor-pointer">
                    <input type="checkbox" checked={showVoltagePhases.C} onChange={(e) => setShowVoltagePhases({ ...showVoltagePhases, C: e.target.checked })} />
                    Phase C (UC)
                  </label>
                </div>
              </div>
            </div>

            {/* SVG Voltage Visualizer */}
            <div className="bg-[#09090d] border border-[#222330] rounded p-2 overflow-x-auto relative min-h-[180px]">
              <svg viewBox={`0 0 ${900 * zoomLevel} 200`} className="w-full h-[180px] pointer-events-none">
                <line x1="0" y1="100" x2={900 * zoomLevel} y2="100" stroke="#313244" strokeWidth="1" strokeDasharray="4 4" />
                
                {arMarkers.map((m, idx) => (
                  <line key={idx} x1={m.x} y1="0" x2={m.x} y2="200" stroke={m.color} strokeWidth="1" strokeDasharray="3 3" />
                ))}
                <text x="5" y="15" fill="#a6adc8" fontSize="8px" fontFamily="monospace">Pre-fault</text>
                {showVoltagePhases.A && <polyline fill="none" stroke="#f38ba8" strokeWidth="2" points={voltageWaves.pathA} />}
                {showVoltagePhases.B && <polyline fill="none" stroke="#a6e3a1" strokeWidth="2" points={voltageWaves.pathB} />}
                {showVoltagePhases.C && <polyline fill="none" stroke="#89b4fa" strokeWidth="2" points={voltageWaves.pathC} />}
              </svg>
            </div>
          </div>

          {/* ქვედა ნაწილი: დროითი ქრონოლოგია & ტექნიკური პარამეტრები */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* დროითი მოვლენების ჟურნალი */}
            <div className="bg-[#161622] p-3 rounded border border-[#313244]">
              <h4 className="text-[#89b4fa] text-[12px] font-bold m-0 mb-2 border-b border-[#313244] pb-1 flex items-center gap-1.5">
                <span>⏱️</span> რელეს მოქმედების ქრონოლოგია
              </h4>
              <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                {currentConfig.timeEvents.map((ev, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#181825] p-1.5 rounded border border-[#222330]">
                    <span className="text-[#a6adc8] font-bold">{ev.time}</span>
                    <span
                      className="font-semibold text-right"
                      style={{
                        color:
                          ev.type === 'danger'
                            ? '#f38ba8'
                            : ev.type === 'warn'
                            ? '#f9e2af'
                            : ev.type === 'success'
                            ? '#a6e3a1'
                            : '#89b4fa'
                      }}
                    >
                      {ev.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ტექნიკური პარამეტრები */}
            <div className="bg-[#161622] p-3 rounded border border-[#313244]">
              <h4 className="text-[#89b4fa] text-[12px] font-bold m-0 mb-2 border-b border-[#313244] pb-1 flex items-center gap-1.5">
                <span>📊</span> გაზომილი ელექტრული პარამეტრები
              </h4>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div className="bg-[#181825] p-2 rounded border border-[#222330]">
                  <span className="text-[#a6adc8] block">🛡️ რელეს მოდელი:</span>
                  <span className="text-[#fab387] font-bold">{currentConfig.relay}</span>
                </div>
                <div className="bg-[#181825] p-2 rounded border border-[#222330]">
                  <span className="text-[#a6adc8] block">🌐 ობიექტი:</span>
                  <span className="text-[#cdd6f4] font-bold">{currentConfig.system}</span>
                </div>
                <div className="bg-[#181825] p-2 rounded border border-[#222330] col-span-2">
                  <span className="text-[#a6adc8] block">⚙️ ნეიტრალის რეჟიმი:</span>
                  <span className="text-[#a6e3a1] font-bold">{currentConfig.neutralMode}</span>
                </div>
                <div className="bg-[#181825] p-2 rounded border border-[#222330]">
                  <span className="text-[#a6adc8] block">💥 ავარიის დენი (I_f):</span>
                  <span className="text-[#f38ba8] font-bold">{currentConfig.parameters.faultCurrent}</span>
                </div>
                <div className="bg-[#181825] p-2 rounded border border-[#222330]">
                  <span className="text-[#a6adc8] block">📉 ავარიული ძაბვა:</span>
                  <span className="text-[#f9e2af] font-bold">{currentConfig.parameters.faultVoltage}</span>
                </div>
                <div className="bg-[#181825] p-2 rounded border border-[#222330]">
                  <span className="text-[#a6adc8] block">⏱️ გამორთვის დრო:</span>
                  <span className="text-[#a6e3a1] font-bold">{currentConfig.parameters.tripTime}</span>
                </div>
                <div className="bg-[#181825] p-2 rounded border border-[#222330]">
                  <span className="text-[#a6adc8] block">🌀 ნულ. მიმდევრობის დენი (3I0):</span>
                  <span className="text-[#cdd6f4] font-bold">{currentConfig.parameters.zeroSeqCurrent}</span>
                </div>
                <div className="bg-[#181825] p-2 rounded border border-[#222330] col-span-2">
                  <span className="text-[#a6adc8] block">🔄 აგჩ-ს სტატუსი & პაუზა:</span>
                  <span className="text-[#89b4fa] font-bold">
                    {currentConfig.parameters.arStatus} ({currentConfig.parameters.arPauseTime})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}