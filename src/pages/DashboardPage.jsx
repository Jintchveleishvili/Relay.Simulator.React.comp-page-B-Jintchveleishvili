import React, { useState, useRef, useMemo } from 'react';
import ControlPanel from '../components/ControlPanel';
import SubstationSchema from '../components/SubstationSchema';
import FaultButtons from '../components/FaultButtons';
import TelemetryPanel from '../components/TelemetryPanel';
import EventLog from '../components/EventLog';

export default function DashboardPage() {
  const [systemSettings, setSystemSettings] = useState({
    lineLength220: 100,            // 220კვ ეგხ-ს სიგრძე (კმ)
    lineLength: 50,                // 110კვ ეგხ-ს სიგრძე (კმ)
    at1Nominal: 250,
    at2Nominal: 250,
    t1Nominal: 63,
    t2Nominal: 40,
    lineLength35: 15,              // 35კვ ეგხ-ს სიგრძე (კმ)
    lineLength10: 8,               // 10კვ საქალაქო ფიდერი (კმ)
    lineLengthRegional10: 12       // 10კვ რეგიონული ფიდერი (კმ)
  });

  const [statuses, setStatuses] = useState({
    Line220: true, AT1: true, AT2: true, Coupler: true, LineA: true,
    T1: true, T2: true, Bus1: true, Bus2: true,
    FeederCity: true, FeederReg: true, Feeder35: true, Motor6: true
  });

  const [telemetry, setTelemetry] = useState({
    currentVal: "414 A", voltageVal: "110.0 კვ", preFaultCurrentVal: "207 A",
    modeVal: "ნორმალური რეჟიმი", modeColor: "#a6e3a1", activeProtection: "-",
    faultCurrentVal: "0 A", faultVoltageVal: "-", tripTimeVal: "0.00 წმ",
    faultDistanceVal: "-", zeroSeqVal: "0 A", faultTypeVal: "ნორმალური", comtradeVal: "READY"
  });

  const [sparkPos, setSparkPos] = useState({ x: 0, y: 0, show: false });
  const gridRef = useRef(null);

  const [logs, setLogs] = useState([
    { 
      time: new Date().toLocaleTimeString(), 
      message: "[SCADA] სისტემა ნორმალურ რეჟიმშია. SEL 487E ტრანსფორმატორის დიფერენციალური დაცვა მზადყოფნაშია.", 
      type: "success" 
    }
  ]);

  const nodeRefs = {
    line220: useRef(null), gen: useRef(null), at1: useRef(null), at2: useRef(null),
    bus110_1: useRef(null), bus110_2: useRef(null), coupler: useRef(null),
    trans1: useRef(null), trans2: useRef(null), userA: useRef(null),
    userB: useRef(null), userE: useRef(null), userC: useRef(null), userD: useRef(null)
  };

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, message, type }]);
  };

  const clearLogs = () => {
    setLogs([{ time: new Date().toLocaleTimeString(), message: "🧹 მოვლენათა ჟურნალი გასუფთავებულია.", type: "info" }]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSystemSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // 1. სისტემური და ხაზის წინაღობების დათვლა
  const calcResults = useMemo(() => {
    const P_sys = 2000; 
    const cosPhi = 0.85;
    const S_sc = P_sys / cosPhi; 
    
    // ხვედრითი წინაღობები x0 (Ohm/km)
    const x0_220 = 0.42; 
    const x0_110 = 0.40; 
    const x0_35 = 0.38;  
    const x0_10 = 0.35;  

    const X_sys_220 = Math.pow(220, 2) / S_sc; 
    const X_sys_110 = X_sys_220 * Math.pow(110 / 220, 2); 
    const X_sys_35_base = X_sys_220 * Math.pow(35 / 220, 2);   
    const X_sys_10_base = X_sys_220 * Math.pow(10 / 220, 2);

    // ტრანსფორმატორების (T-1, T-2) წინაღობა (Uk = 10.5%)
    const uk_percent = 10.5;
    const X_t1_10 = (uk_percent / 100) * (Math.pow(10, 2) / (systemSettings.t1Nominal || 63));
    const X_t2_35 = (uk_percent / 100) * (Math.pow(35, 2) / (systemSettings.t2Nominal || 40));

    const X_sys_10_total = X_sys_10_base + X_t1_10;
    const X_sys_35_total = X_sys_35_base + X_t2_35;

    const hasVoltage220 = statuses.Line220;
    const hasVoltageBus1 = hasVoltage220 && statuses.Bus1 && (statuses.AT1 || (statuses.Coupler && statuses.AT2 && statuses.Bus2));
    const hasVoltageBus2 = hasVoltage220 && statuses.Bus2 && (statuses.AT2 || (statuses.Coupler && statuses.AT1 && statuses.Bus1));

    const lineACurrentVal = (statuses.LineA && hasVoltageBus1) 
      ? Math.round(300 * (systemSettings.lineLength / 50)) : 0;

    const t1_10_city = (statuses.T1 && hasVoltageBus1 && statuses.FeederCity) 
      ? Math.round(250 * (systemSettings.t1Nominal / 63) * (8 / (systemSettings.lineLength10 || 1))) : 0;

    const t1_10_reg = (statuses.T1 && hasVoltageBus1 && statuses.FeederReg) 
      ? Math.round(150 * (systemSettings.t1Nominal / 63) * (12 / (systemSettings.lineLengthRegional10 || 1))) : 0;

    const t2_35_factory = (statuses.T2 && hasVoltageBus2 && statuses.Feeder35) 
      ? Math.round(200 * (systemSettings.t2Nominal / 40) * (15 / (systemSettings.lineLength35 || 1))) : 0;

    const t2_6_motor = (statuses.T2 && hasVoltageBus2 && statuses.Motor6) 
      ? Math.round(160 * (systemSettings.t2Nominal / 40)) : 0;

    const t1_LV_TotalCurrent = t1_10_city + t1_10_reg; 
    const t1_110_Current = (statuses.T1 && hasVoltageBus1) 
      ? Math.round(t1_LV_TotalCurrent * (10 / 110)) : 0;

    const t2_110_Current = (statuses.T2 && hasVoltageBus2) 
      ? Math.round(t2_35_factory * (35 / 110) + t2_6_motor * (6 / 110)) : 0;

    const loadBus1 = lineACurrentVal + t1_110_Current;
    const loadBus2 = t2_110_Current;

    let at1_110_Current = 0;
    let at2_110_Current = 0;

    if (hasVoltage220) {
      if (statuses.AT1 && statuses.AT2 && statuses.Bus1 && statuses.Bus2) {
        if (statuses.Coupler) {
          const totalLoad = loadBus1 + loadBus2;
          const totalAT = systemSettings.at1Nominal + systemSettings.at2Nominal;
          at1_110_Current = Math.round(totalLoad * (systemSettings.at1Nominal / totalAT));
          at2_110_Current = Math.round(totalLoad * (systemSettings.at2Nominal / totalAT));
        } else {
          at1_110_Current = loadBus1;
          at2_110_Current = loadBus2;
        }
      } else if (statuses.AT1 && statuses.Bus1) {
        at1_110_Current = loadBus1 + (statuses.Coupler && statuses.Bus2 ? loadBus2 : 0);
        at2_110_Current = 0;
      } else if (statuses.AT2 && statuses.Bus2) {
        at1_110_Current = 0;
        at2_110_Current = loadBus2 + (statuses.Coupler && statuses.Bus1 ? loadBus1 : 0);
      }
    }

    const at1_220_Current = Math.round(at1_110_Current * (110 / 220));
    const at2_220_Current = Math.round(at2_110_Current * (110 / 220));
    const line220_Current = statuses.Line220 ? (at1_220_Current + at2_220_Current) : 0;

    return {
      x0_220, x0_110, x0_35, x0_10,
      X_sys_220, X_sys_110, X_sys_35_total, X_sys_10_total,
      hasVoltage220, hasVoltageBus1, hasVoltageBus2,
      lineACurrentVal, t1_10_city, t1_10_reg, t2_35_factory, t2_6_motor,
      t1_110_Current, t2_110_Current, at1_110_Current, at2_110_Current,
      line220_Current
    };
  }, [systemSettings, statuses]);

  const calcData = calcResults;

  const recalculateSystem = () => {
    addLog(`⚙️ გადაანგარიშება შესრულდა: X_sys_110 = ${calcData.X_sys_110.toFixed(2)} Ohm.`, 'success');
  };

  const runARSequence = (targetKey, isSuccessful, modeLabel) => {
    addLog(`⏳ [SEL 79 AR] აგჩ-ს ციკლი დაწყებულია (${modeLabel})...`, 'warn');
    setTelemetry(prev => ({ ...prev, modeVal: `🔄 აგჩ პაუზა - ${modeLabel}`, modeColor: "#f9e2af" }));

    setTimeout(() => {
      setStatuses(prev => ({ ...prev, [targetKey]: true }));
      if (isSuccessful) {
        addLog(`✅ [SEL 79 AR] აგჩ წარმატებით დასრულდა! ხაზი აღდგენილია.`, 'success');
        setTelemetry(prev => ({ ...prev, modeVal: "ნორმალური", modeColor: "#a6e3a1" }));
      } else {
        setTimeout(() => {
          setStatuses(prev => ({ ...prev, [targetKey]: false }));
          addLog(`❌ [SEL 79 AR] აგჩ უშედეგოა! რელე გადავიდა LOCKOUT რეჟიმში.`, 'danger');
          setTelemetry(prev => ({ ...prev, modeVal: "🚨 LOCKOUT", modeColor: "#f38ba8" }));
        }, 300);
      }
    }, 1500);
  };

  const calcLineFaultCurrent = (U_kV, X_sys_total, dist_km, x0_specific) => {
    const X_line = dist_km * x0_specific;
    const X_total = X_sys_total + X_line; 
    const U_phase = (U_kV * 1000) / Math.sqrt(3); 
    return Math.round(U_phase / X_total); 
  };

  // 2. ყველა ავარიული რეჟიმის სრული დამუშავება
  const triggerFault = (faultType) => {
    let nodeKey = null;
    let faultData = {};

    switch(faultType) {
      case 'line_220_1ar_success': {
        nodeKey = 'line220';
        const d_km = Number((systemSettings.lineLength220 * 0.15).toFixed(1));
        const Ik = calcLineFaultCurrent(220, calcData.X_sys_220, d_km, calcData.x0_220);
        faultData = {
          relay: "SEL-311L", fCurrent: `${Ik.toLocaleString()} A`, fVoltage: "120.0 კვ", preCurrent: `${calcData.line220_Current} A`,
          time: "0.02 წმ", dist: `${d_km} კმ`, zeroSeq: "280 A", type: "1-ფაზა მ.შ.", mode: "⚡ 1-ფაზა აგჩ",
          logMsg: `💥 220კვ ეგხ d=${d_km}კმ-ზე მ.შ. I_k=${Ik}A. ამოქმედდა აგჩ (79).`, statusUpdate: { Line220: false },
          arConfig: { targetKey: 'Line220', success: true, label: '1-ფაზა აგჩ' }
        };
        break;
      }

      case 'line_220_3ar_failed': {
        nodeKey = 'line220';
        const d_km = Number((systemSettings.lineLength220 * 0.05).toFixed(1));
        const Ik = calcLineFaultCurrent(220, calcData.X_sys_220, d_km, calcData.x0_220);
        faultData = {
          relay: "SEL-311L", fCurrent: `${Ik.toLocaleString()} A`, fVoltage: "0.0 კვ", preCurrent: `${calcData.line220_Current} A`,
          time: "0.025 წმ", dist: `${d_km} კმ`, zeroSeq: "0 A", type: "3-ფაზა მდგრადი", mode: "🚨 3-ფაზა უშედეგო",
          logMsg: `💥 220კვ ეგხ ახლო d=${d_km}კმ-ზე 3-ფაზა მ.შ. I_k=${Ik}A! გაითიშა 3-ფაზა.`, statusUpdate: { Line220: false },
          arConfig: { targetKey: 'Line220', success: false, label: '3-ფაზა აგჩ' }
        };
        break;
      }

      case 'line_a_fault_ar': {
        nodeKey = 'userA';
        const d_km = Number((systemSettings.lineLength * 0.3).toFixed(1));
        const Ik = calcLineFaultCurrent(110, calcData.X_sys_110, d_km, calcData.x0_110);
        faultData = {
          relay: "SEL-311L", fCurrent: `${Ik.toLocaleString()} A`, fVoltage: "32.0 კვ", preCurrent: `${calcData.lineACurrentVal} A`,
          time: "0.025 წმ", dist: `${d_km} კმ`, zeroSeq: "120 A", type: "21 + 79 აგჩ", mode: "🔄 110კვ აგჩ",
          logMsg: `💥 110კვ მაგისტრალზე d=${d_km}კმ მ.შ. I_k=${Ik}A. ამოქმედდა აგჩ.`, statusUpdate: { LineA: false },
          arConfig: { targetKey: 'LineA', success: true, label: '110კვ აგჩ' }
        };
        break;
      }

      case 'line_a_fault_permanent': {
        nodeKey = 'userA';
        const d_km = Number((systemSettings.lineLength * 0.3).toFixed(1));
        const Ik = calcLineFaultCurrent(110, calcData.X_sys_110, d_km, calcData.x0_110);
        faultData = {
          relay: "SEL-311L", fCurrent: `${Ik.toLocaleString()} A`, fVoltage: "0.0 კვ", preCurrent: `${calcData.lineACurrentVal} A`,
          time: "0.025 წმ", dist: `${d_km} კმ`, zeroSeq: "120 A", type: "21 მდგრადი", mode: "🚨 110კვ გათიშულია",
          logMsg: `🚨 110კვ მაგისტრალზე მდგრადი მ.შ. I_k=${Ik}A. ხაზი გაითიშა.`, statusUpdate: { LineA: false }
        };
        break;
      }

      // AT-1: 220/110კვ გრაგნილის შერთვა 10კვ გრაგნილთან
      case 'at1_diff': {
        nodeKey = 'at1';
        faultData = {
          relay: "SEL-487E (87AT)", 
          fCurrent: "3,850 A", 
          fVoltage: "78.5 კვ", // ნარჩენი ძაბვა ავარიის 0.03 წმ-ში
          preCurrent: `${calcData.at1_110_Current} A`,
          time: "0.03 წმ", 
          dist: "შიდა (87AT)", 
          zeroSeq: "180 A", 
          type: "220/110კვ - 10კვ გრაგნილთაშორისი", 
          mode: "🚫 AT-1 გათიშულია (87AT)",
          logMsg: `🚨 [SEL-487E] AT-1: 220/110კვ გრაგნილის შერთვა 10კვ გრაგნილთან! I_k=3,850A, ნარჩენი U=78.5კვ. AT-1 იზოლირებულია.`, 
          statusUpdate: { AT1: false }
        };
        break;
      }

      // AT-2: 220/110კვ გრაგნილის შერთვა კორპუსთან (მიწასთან)
      case 'at2_diff': {
        nodeKey = 'at2';
        faultData = {
          relay: "SEL-487E (87AT)", 
          fCurrent: "5,200 A", 
          fVoltage: "62.0 კვ", // ნარჩენი ძაბვა ავარიის დროს
          preCurrent: `${calcData.at2_110_Current} A`,
          time: "0.03 წმ", 
          dist: "შიდა (87AT)", 
          zeroSeq: "1,450 A", 
          type: "220/110კვ გრაგნილის შერთვა კორპუსზე", 
          mode: "🚫 AT-2 გათიშულია (87AT)",
          logMsg: `🚨 [SEL-487E] AT-2: 220/110კვ გრაგნილის შერთვა კორპუსთან (მიწაზე)! I_k=5,200A, ნარჩენი U=62.0კვ. AT-2 იზოლირებულია.`, 
          statusUpdate: { AT2: false }
        };
        break;
      }

      case 'bus1_fault': {
        nodeKey = 'bus110_1';
        const Ik = calcLineFaultCurrent(110, calcData.X_sys_110, 0, calcData.x0_110);
        faultData = {
          relay: "SEL-487B (87B)", fCurrent: `${Ik.toLocaleString()} A`, fVoltage: "0.0 კვ", preCurrent: `${calcData.at1_110_Current} A`,
          time: "0.015 წმ", dist: "0.0 კმ (Bus)", zeroSeq: "0 A", type: "87B დიფერენციალური", mode: "🚫 I სექცია გათიშულია",
          logMsg: `🚨 [87B] 110კვ I სექციაზე მოკლე შერთვა! I_k=${Ik}A. I სექცია და Q-110 გაითიშა.`, statusUpdate: { Bus1: false, Coupler: false, AT1: false }
        };
        break;
      }

      case 'bus2_fault': {
        nodeKey = 'bus110_2';
        const Ik = calcLineFaultCurrent(110, calcData.X_sys_110, 0, calcData.x0_110);
        faultData = {
          relay: "SEL-487B (87B)", fCurrent: `${Ik.toLocaleString()} A`, fVoltage: "0.0 კვ", preCurrent: `${calcData.at2_110_Current} A`,
          time: "0.015 წმ", dist: "0.0 კმ (Bus)", zeroSeq: "0 A", type: "87B დიფერენციალური", mode: "🚫 II სექცია გათიშულია",
          logMsg: `🚨 [87B] 110კვ II სექციაზე მოკლე შერთვა! I_k=${Ik}A. II სექცია და Q-110 გაითიშა.`, statusUpdate: { Bus2: false, Coupler: false, AT2: false }
        };
        break;
      }

      // T-1: 110კვ გრაგნილის შერთვა კორპუსთან
      case 't1_fault': {
        nodeKey = 'trans1';
        faultData = {
          relay: "SEL-487E (87T)", 
          fCurrent: "4,150 A", 
          fVoltage: "71.0 კვ", 
          preCurrent: `${calcData.t1_110_Current} A`,
          time: "0.03 წმ", 
          dist: "შიდა (87T)", 
          zeroSeq: "920 A", 
          type: "110კვ გრაგნილის შერთვა კორპუსზე", 
          mode: "🚨 T-1 გათიშულია",
          logMsg: `🚨 [SEL-487E] T-1: 110კვ გრაგნილის შერთვა კორპუსთან! I_k=4,150A, ნარჩენი U=71.0კვ. T-1 იზოლირებულია.`, 
          statusUpdate: { T1: false }
        };
        break;
      }

      // T-2: 10კვ (დაბალი მხარის) გრაგნილის შერთვა კორპუსთან
      case 't2_fault': {
        nodeKey = 'trans2';
        faultData = {
          relay: "SEL-487E (87T)", 
          fCurrent: "2,400 A", 
          fVoltage: "88.0 კვ", 
          preCurrent: `${calcData.t2_110_Current} A`,
          time: "0.03 წმ", 
          dist: "შიდა (87T)", 
          zeroSeq: "40 A", 
          type: "10კვ გრაგნილის შერთვა კორპუსზე", 
          mode: "🚨 T-2 გათიშულია",
          logMsg: `🚨 [SEL-487E] T-2: 10კვ გრაგნილის შერთვა კორპუსთან! I_k=2,400A, ნარჩენი U=88.0კვ. T-2 იზოლირებულია.`, 
          statusUpdate: { T2: false }
        };
        break;
      }

      case 'line_35_fault': {
        nodeKey = 'userC';
        const d_km = Number((systemSettings.lineLength35 * 0.4).toFixed(1)); 
        const Ik = calcLineFaultCurrent(35, calcData.X_sys_35_total, d_km, calcData.x0_35);
        faultData = {
          relay: "SEL-421 (21)", fCurrent: `${Ik.toLocaleString()} A`, fVoltage: "8.5 კვ", preCurrent: `${calcData.t2_35_factory} A`,
          time: "0.02 წმ", dist: `${d_km} კმ`, zeroSeq: "15 A", type: "21 დისტანციური", mode: "35კვ ავარია",
          logMsg: `🚨 35კვ ქარხნის ხაზზე d=${d_km}კმ-ზე I_k=${Ik}A! ხაზი გაითიშა.`, statusUpdate: { Feeder35: false }
        };
        break;
      }

      case 'feeder_city_fault': {
        nodeKey = 'userB';
        const d_km = Number((systemSettings.lineLength10 * 0.5).toFixed(1)); 
        const Ik = calcLineFaultCurrent(10, calcData.X_sys_10_total, d_km, calcData.x0_10);
        faultData = {
          relay: "SEL-351A (50/51)", fCurrent: `${Ik.toLocaleString()} A`, fVoltage: "2.1 კვ", preCurrent: `${calcData.t1_10_city} A`,
          time: "0.35 წმ", dist: `${d_km} კმ`, zeroSeq: "0 A", type: "50/51 დენური", mode: "10კვ საქალაქო ავარია",
          logMsg: `🚨 10კვ საქალაქო ფიდერზე d=${d_km}კმ-ზე I_k=${Ik}A. ფიდერი გაითიშა.`, statusUpdate: { FeederCity: false }
        };
        break;
      }

      case 'feeder_reg_fault': {
        nodeKey = 'userE';
        // 10კვ იზოლირებულ ნეიტრალში ტევადობითი დენი (3I0) იზრდება მანძილის გაზრდით: 3I0 = d * 2.5 + 15
        const d_km = Number((systemSettings.lineLengthRegional10 * 0.6).toFixed(1)); 
        const capCurrent = Math.round(d_km * 2.5 + 15); 
        faultData = {
          relay: "SEL-351S (67N)", fCurrent: `${capCurrent} A`, fVoltage: "9.8 კვ", preCurrent: `${calcData.t1_10_reg} A`,
          time: "0.50 წმ", dist: `${d_km} კმ`, zeroSeq: `${capCurrent} A`, type: "67N მიწაზე", mode: "10კვ რეგიონული",
          logMsg: `🚨 10კვ რეგიონულ ფიდერზე მიწაზე შერთვა d=${d_km}კმ-ზე! ტევადობითი 3I0 = ${capCurrent}A. გაითიშა.`, statusUpdate: { FeederReg: false }
        };
        break;
      }

      case 'motor_fault': {
        nodeKey = 'userD';
        faultData = {
          relay: "SEL-701 (49/50/51)", fCurrent: "890 A", fVoltage: "3.2 კვ", preCurrent: `${calcData.t2_6_motor} A`,
          time: "0.80 წმ", dist: "-", zeroSeq: "0 A", type: "701 ძრავას დაცვა", mode: "🚨 6კვ ძრავას ავარია",
          logMsg: "🚨 [SEL-701] 6კვ ასინქრონული ძრავას გადატვირთვა/გაჭედვა! ძრავა გაჩერდა.", statusUpdate: { Motor6: false }
        };
        break;
      }

      case 'bus_coupler_fault': {
        nodeKey = 'coupler';
        faultData = {
          relay: "SEL-451", fCurrent: "0 A", fVoltage: "-", preCurrent: "0 A",
          time: "0.01 წმ", dist: "-", zeroSeq: "0 A", type: "ყალბი გამორთვა", mode: "⚠️ Q-110 გამორთულია",
          logMsg: "⚠️ [FALSE TRIP] 110კვ სექციური ამომრთველი Q-110 გაითიშა!", statusUpdate: { Coupler: false }
        };
        break;
      }

      default:
        return;
    }

    if (gridRef.current && nodeKey && nodeRefs[nodeKey]?.current) {
      const gridRect = gridRef.current.getBoundingClientRect();
      const nodeRect = nodeRefs[nodeKey].current.getBoundingClientRect();
      setSparkPos({
        x: nodeRect.left - gridRect.left + nodeRect.width / 2,
        y: nodeRect.top - gridRect.top + nodeRect.height / 2,
        show: true
      });
    }

    const nextStatuses = { ...statuses, ...faultData.statusUpdate };
    const isBlackout = !nextStatuses.Line220 || (!nextStatuses.AT1 && !nextStatuses.AT2) || (!nextStatuses.Bus1 && !nextStatuses.Bus2);

    setTelemetry({
      currentVal: faultData.fCurrent || "0 A",
      voltageVal: isBlackout ? "0.0 კვ" : faultData.fVoltage,
      preFaultCurrentVal: faultData.preCurrent,
      modeVal: isBlackout ? "🚨 სრული ბლექაუტი (BLACKOUT)" : faultData.mode,
      modeColor: isBlackout ? "#f38ba8" : (faultType === 'bus_coupler_fault' ? "#f9e2af" : "#f38ba8"),
      activeProtection: faultData.relay,
      faultCurrentVal: faultData.fCurrent,
      faultVoltageVal: faultData.fVoltage,
      tripTimeVal: faultData.time,
      faultDistanceVal: faultData.dist,
      zeroSeqVal: faultData.zeroSeq,
      faultTypeVal: faultData.type,
      comtradeVal: "SAVED (C001)"
    });

    addLog(faultData.logMsg, faultType === 'bus_coupler_fault' ? 'warn' : 'danger');

    setTimeout(() => {
      setSparkPos(prev => ({ ...prev, show: false }));
      setStatuses(nextStatuses);

      if (faultData.arConfig) {
        runARSequence(faultData.arConfig.targetKey, faultData.arConfig.success, faultData.arConfig.label);
      }
    }, 300);
  };

  const resetSystem = () => {
    setStatuses({
      Line220: true, AT1: true, AT2: true, Coupler: true, LineA: true, T1: true, T2: true,
      Bus1: true, Bus2: true, FeederCity: true, FeederReg: true, Feeder35: true, Motor6: true
    });
    setTelemetry({
      currentVal: "414 A", voltageVal: "110.0 კვ", preFaultCurrentVal: "207 A",
      modeVal: "ნორმალური რეჟიმი", modeColor: "#a6e3a1", activeProtection: "-",
      faultCurrentVal: "0 A", faultVoltageVal: "-", tripTimeVal: "0.00 წმ",
      faultDistanceVal: "-", zeroSeqVal: "0 A", faultTypeVal: "ნორმალური", comtradeVal: "READY"
    });
    setSparkPos({ x: 0, y: 0, show: false });
    addLog("🔄 [SCADA] სისტემა სრულად აღდგენილია საწყის რეჟიმში.", 'success');
  };

  return (
    <div className="w-screen min-h-screen bg-[#0f0f14] p-3 flex flex-col box-border m-0 overflow-x-hidden font-sans text-[#cdd6f4]">
      {/* Header */}
      <h1 className="text-[#89b4fa] text-[18px] mb-[10px] font-bold text-center flex items-center justify-center gap-2">
        <span>⚡</span> SEL რელეების კვანძური ქვესადგურის ინტელექტუალური მოდელი
      </h1>

      {/* Control Panel Component */}
      <ControlPanel 
        systemSettings={systemSettings} 
        handleInputChange={handleInputChange} 
        X_sys_110={calcData.X_sys_110} 
        recalculateSystem={recalculateSystem} 
      />

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[10px] w-full flex-1">
        
        {/* Left Panel */}
        <div className="bg-[#161622] rounded-[6px] p-[10px] shadow-lg border border-[#313244] flex flex-col">
          <h3 className="mt-0 text-[#89b4fa] border-b border-[#313244] pb-[4px] text-[13px] font-bold flex items-center gap-1">
            🌐 ქვესადგურის ტექნოლოგიური სქემა
          </h3>
          
          <SubstationSchema 
            gridRef={gridRef} 
            nodeRefs={nodeRefs} 
            statuses={statuses} 
            calcData={calcData} 
            sparkPos={sparkPos} 
          />

          <FaultButtons triggerFault={triggerFault} />
        </div>

        {/* Right Side Panel */}
        <div className="bg-[#161622] rounded-[6px] p-[10px] shadow-lg border border-[#313244] flex flex-col gap-3">
          <button className="bg-[#a6e3a1] text-[#11111b] text-[12px] w-full p-[8px] rounded font-bold cursor-pointer hover:bg-[#90d98b] transition-colors flex items-center justify-center gap-1 shadow" onClick={resetSystem}>
            🔄 სისტემის სრული აღდგენა (Reset)
          </button>

          <TelemetryPanel telemetry={telemetry} />
          
          <EventLog logs={logs} clearLogs={clearLogs} />
        </div>
      </div>
    </div>
  );
}