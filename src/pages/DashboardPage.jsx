import React, { useState, useRef, useMemo } from 'react';
import ControlPanel from '../components/ControlPanel';
import SubstationSchema from '../components/SubstationSchema';
import FaultButtons from '../components/FaultButtons';
import TelemetryPanel from '../components/TelemetryPanel';
import EventLog from '../components/EventLog';

export default function DashboardPage() {
  const [systemSettings, setSystemSettings] = useState({
    lineLength: 50,
    at1Nominal: 250,
    at2Nominal: 250,
    t1Nominal: 63,
    t2Nominal: 40,
    lineLength35: 15,
    lineLength10: 8,
    lineLengthRegional10: 12
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
      message: "[SCADA] სისტემა ნორმალურ რეჟიმშია. ექვივალენტური გენერაცია: 2000 მგვტ.", 
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

  const calcResults = useMemo(() => {
    const P_sys = 2000;
    const cosPhi = 0.85;
    const S_sc = P_sys / cosPhi;
    const X_sys_220 = Math.pow(220, 2) / S_sc;
    const X_sys_110 = X_sys_220 * Math.pow(110 / 220, 2);

    // 220კვ ეგხ თუ გათიშულია -> ქვესადგურს ძაბვა არ მიეწოდება (სრული ბლექაუტი)
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
      X_sys_110, hasVoltage220, hasVoltageBus1, hasVoltageBus2,
      lineACurrentVal, t1_10_city, t1_10_reg, t2_35_factory, t2_6_motor,
      t1_LV_TotalCurrent, t1_110_Current, t2_110_Current,
      at1_110_Current, at2_110_Current, at1_220_Current, at2_220_Current,
      line220_Current
    };
  }, [systemSettings, statuses]);

  const { X_sys_110, ...calcData } = calcResults;

  const recalculateSystem = () => {
    addLog(`⚙️ გადაანგარიშება: X_sys(110kV) = ${X_sys_110.toFixed(2)} Ohm (2000MW გენერაციით).`, 'success');
  };

  const triggerFault = (faultType) => {
    let nodeKey = null;
    let faultData = {};
    const ik_110 = Math.round((110000 / Math.sqrt(3)) / X_sys_110); 
    const ik_220 = Math.round(ik_110 * (110 / 220));

    switch(faultType) {
      case 'line_220_fault':
        nodeKey = 'line220';
        faultData = {
          relay: "SEL-311L (21/87L)", fCurrent: `${ik_220 * 2} A`, fVoltage: "0.0 კვ", preCurrent: `${calcData.line220_Current} A`,
          time: "0.02 წმ", dist: "12.4 კმ", zeroSeq: "340 A", type: "21/87L 220კვ ეგხ-ს ავარია", mode: "🚨 სრული ბლექაუტი (BLACKOUT)",
          logMsg: "🚨 [87L] 220კვ მკვებავი ეგხ ავარიულად გაითიშა! ქვესადგურს კვება შეუნყდა (BLACKOUT).", statusUpdate: { Line220: false }
        };
        break;
      case 'at1_diff':
        nodeKey = 'at1';
        faultData = {
          relay: "SEL-487E (87AT)", fCurrent: `${Math.round(ik_110 * 1.1)} A`, fVoltage: "18.5 კვ", preCurrent: `${calcData.at1_110_Current} A`,
          time: "0.03 წმ", dist: "-", zeroSeq: "0 A", type: "87AT დიფერენციალური", mode: "AT-1 ავარია",
          logMsg: "🚨 [87AT] AT-1 შიდა მოკლე შერთვა! AT-1 გათიშულია.", statusUpdate: { AT1: false }
        };
        break;
      case 'at2_diff':
        nodeKey = 'at2';
        faultData = {
          relay: "SEL-487E (87AT)", fCurrent: `${Math.round(ik_110 * 1.08)} A`, fVoltage: "19.1 კვ", preCurrent: `${calcData.at2_110_Current} A`,
          time: "0.03 წმ", dist: "-", zeroSeq: "0 A", type: "87AT დიფერენციალური", mode: "AT-2 ავარია",
          logMsg: "🚨 [87AT] AT-2 შიდა მოკლე შერთვა! AT-2 გათიშულია.", statusUpdate: { AT2: false }
        };
        break;
      case 'bus1_fault':
        nodeKey = 'bus110_1';
        faultData = {
          relay: "SEL-487B (87B)", fCurrent: `${ik_110} A`, fVoltage: "0.0 კვ", preCurrent: `${calcData.at1_110_Current} A`,
          time: "0.015 წმ", dist: "-", zeroSeq: "0 A", type: "87B შინების დიფერენციალური", mode: "110კვ I სექციის მ.შ.",
          logMsg: "🚨 [87B] 110კვ I სექციის მოკლე შერთვა! Q-110 და AT-1 გაითიშა.", statusUpdate: { Bus1: false, Coupler: false, AT1: false }
        };
        break;
      case 'bus2_fault':
        nodeKey = 'bus110_2';
        faultData = {
          relay: "SEL-487B (87B)", fCurrent: `${ik_110} A`, fVoltage: "0.0 კვ", preCurrent: `${calcData.at2_110_Current} A`,
          time: "0.015 წმ", dist: "-", zeroSeq: "0 A", type: "87B შინების დიფერენციალური", mode: "110კვ II სექციის მ.შ.",
          logMsg: "🚨 [87B] 110კვ II სექციის მოკლე შერთვა! Q-110 და AT-2 გაითიშა.", statusUpdate: { Bus2: false, Coupler: false, AT2: false }
        };
        break;
      case 'line_a_fault':
        nodeKey = 'userA';
        faultData = {
          relay: "SEL-311L (21/87L)", fCurrent: `${Math.round(ik_110 * 0.7)} A`, fVoltage: "32.0 კვ", preCurrent: `${calcData.lineACurrentVal} A`,
          time: "0.025 წმ", dist: `${(systemSettings.lineLength * 0.35).toFixed(1)} კმ`, zeroSeq: "120 A", type: "21 დისტანციური დაცვა", mode: "110კვ ეგხ ავარია",
          logMsg: "🚨 [21] 110კვ ეგხ მაგისტრალის მოკლე შერთვა! ხაზი გათიშულია.", statusUpdate: { LineA: false }
        };
        break;
      case 't1_fault':
        nodeKey = 'trans1';
        faultData = {
          relay: "SEL-487E (87T)", fCurrent: `${Math.round(ik_110 * 0.45)} A`, fVoltage: "12.0 კვ", preCurrent: `${calcData.t1_110_Current} A`,
          time: "0.03 წმ", dist: "-", zeroSeq: "0 A", type: "87T დიფერენციალური", mode: "T-1 ტრანსფ. ავარია",
          logMsg: "🚨 [87T] ტრანსფორმატორ T-1-ის შიდა ავარია! T-1 გაითიშა.", statusUpdate: { T1: false }
        };
        break;
      case 't2_fault':
        nodeKey = 'trans2';
        faultData = {
          relay: "SEL-487E (87T)", fCurrent: `${Math.round(ik_110 * 0.42)} A`, fVoltage: "15.0 კვ", preCurrent: `${calcData.t2_110_Current} A`,
          time: "0.03 წმ", dist: "-", zeroSeq: "0 A", type: "87T დიფერენციალური", mode: "T-2 ტრანსფ. ავარია",
          logMsg: "🚨 [87T] ტრანსფორმატორ T-2-ის შიდა ავარია! T-2 გაითიშა.", statusUpdate: { T2: false }
        };
        break;
      case 'line_35_fault':
        nodeKey = 'userC';
        faultData = {
          relay: "SEL-421 (21)", fCurrent: "3,600 A", fVoltage: "8.5 კვ", preCurrent: `${calcData.t2_35_factory} A`,
          time: "0.02 წმ", dist: `${(systemSettings.lineLength35 * 0.4).toFixed(1)} კმ`, zeroSeq: "15 A", type: "21 დისტანციური დაცვა", mode: "35კვ ხაზის ავარია",
          logMsg: "🚨 [21] 35კვ ქარხნის ხაზის ავარია! ხაზი გათიშულია.", statusUpdate: { Feeder35: false }
        };
        break;
      case 'feeder_city_fault':
        nodeKey = 'userB';
        faultData = {
          relay: "SEL-351A (50/51)", fCurrent: "1,200 A", fVoltage: "2.1 კვ", preCurrent: `${calcData.t1_10_city} A`,
          time: "0.35 წმ", dist: "-", zeroSeq: "0 A", type: "50/51 მაქსიმალური დენური", mode: "10კვ საქალაქო ავარია",
          logMsg: "🚨 [50/51] 10კვ საქალაქო ფიდერის ჭარბი დენი! ფიდერი გაითიშა.", statusUpdate: { FeederCity: false }
        };
        break;
      case 'feeder_reg_fault':
        nodeKey = 'userE';
        faultData = {
          relay: "SEL-351S (67N)", fCurrent: "65 A", fVoltage: "9.8 კვ", preCurrent: `${calcData.t1_10_reg} A`,
          time: "0.50 წმ", dist: "-", zeroSeq: "65 A", type: "67N მიწაზე მიმართული", mode: "10კვ რეგიონული მიწაზე",
          logMsg: "🚨 [67N] 10კვ რეგიონული ფიდერის მიწაზე შერთვა! ფიდერი გაითიშა.", statusUpdate: { FeederReg: false }
        };
        break;
      case 'motor_fault':
        nodeKey = 'userD';
        faultData = {
          relay: "SEL-701 (49/50/51)", fCurrent: "890 A", fVoltage: "3.2 კვ", preCurrent: `${calcData.t2_6_motor} A`,
          time: "0.80 წმ", dist: "-", zeroSeq: "0 A", type: "49/51 თერმული / ჭარბი დენი", mode: "6კვ ძრავას ავარია",
          logMsg: "🚨 [701] 6კვ ასინქრონული ძრავას გადატვირთვა! ძრავა გაჩერდა.", statusUpdate: { Motor6: false }
        };
        break;
      case 'bus_coupler_fault':
        nodeKey = 'coupler';
        faultData = {
          relay: "SEL-451", fCurrent: "0 A", fVoltage: "-", preCurrent: "0 A",
          time: "0.01 წმ", dist: "-", zeroSeq: "0 A", type: "ყალბი გამორთვა", mode: "Q-110 ყალბი გამორთვა",
          logMsg: "⚠️ [FALSE TRIP] სექციური ამომრთველის Q-110 ყალბი გამორთვა!", statusUpdate: { Coupler: false }
        };
        break;
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
      currentVal: faultData.fCurrent,
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

    if (isBlackout) {
      addLog("❌ [BLACKOUT] ქვესადგურს კვება სრულად შეუნყდა! 220კვ, 110კვ, 35კვ, 10კვ და 6კვ ხაზები ძაბვის გარეშეა.", 'danger');
    }

    setTimeout(() => {
      setSparkPos(prev => ({ ...prev, show: false }));
      setStatuses(nextStatuses);
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
        X_sys_110={X_sys_110} 
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