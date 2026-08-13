import React from 'react';

export default function OscillogramChart({ eventData }) {
  const data = eventData || {};
  const fileName = data.fileName || "EVENT_LOG.CEV";
  const timeStr = data.timeStr || new Date().toLocaleString();
  const relayModel = data.relayModel || "SEL-RELAY";
  const eventType = data.eventType || "TRIP";
  const targets = data.targets || "TLED_1 (TRIP)";
  const faultType = data.faultType || "ავარიული რეჟიმი";

  let ia = Number(data.ia) ?? 0;
  let ib = Number(data.ib) ?? 0;
  let ic = Number(data.ic) ?? 0;
  let ig = Number(data.ig) ?? 0;
  const voltageSag = Number(data.voltageSag) ?? 0;

  const textToSearch = `${fileName} ${faultType} ${relayModel}`.toUpperCase();

  // 1. აგჩ-ს და მანიპულაციის ზუსტი დეტექცია დასკვნის ტექსტიდან
  const isARSuccess = textToSearch.includes("AR_SUCCESS") || textToSearch.includes("წარმატებული") || textToSearch.includes("AR_OK");
  const isARUnsuccess = textToSearch.includes("AR_UNSUCCESS") || textToSearch.includes("FAIL") || textToSearch.includes("უშედეგო") || textToSearch.includes("PERMANENT") || textToSearch.includes("მდგრადი");
  const isFalseTrip = textToSearch.includes("FALSE") || textToSearch.includes("COUPLER") || textToSearch.includes("ყალბი");

  // 2. ძაბვის დინამიკური კლასი
  let kvLevel = 110;
  if (textToSearch.includes("220") || textToSearch.includes("LINE220")) kvLevel = 220;
  else if (textToSearch.includes("110") || textToSearch.includes("LINE110")) kvLevel = 110;
  else if (textToSearch.includes("35") || textToSearch.includes("LINE35")) kvLevel = 35;
  else if (textToSearch.includes("10") || textToSearch.includes("FEEDER10") || textToSearch.includes("10KV")) kvLevel = 10;
  else if (textToSearch.includes("6") || textToSearch.includes("MOTOR") || textToSearch.includes("6KV")) kvLevel = 6;

  // 3. შეერთების სქემა და ნეიტრალი (Y0 vs Delta)
  const isGroundedNeutral = kvLevel >= 110;
  const connectionType = isGroundedNeutral ? "Y0 (ვარსკვლავი ყრუდ დამიწებული ნეიტრალით)" : "Δ / Y (სამკუთხედი / იზოლირებული ნეიტრალი)";
  const normPhVolt = Number((kvLevel / Math.sqrt(3)).toFixed(1));

  // იზოლირებულ ნეიტრალიან ქსელში (35, 10, 6 კვ) 1PH-G მ.შ.-ს დროს 3I0 = 0
  if (!isGroundedNeutral && (textToSearch.includes("1PH") || textToSearch.includes("1-ფაზა"))) {
    ig = 0;
  }

  // 4. დაზიანებული ფაზების ზუსტი სინქრონიზაცია
  const is2Ph = textToSearch.includes("A-B") || textToSearch.includes("B-C") || textToSearch.includes("ორფაზა") || textToSearch.includes("2PH");
  const is3Ph = textToSearch.includes("3-ფაზა") || textToSearch.includes("MOTOR") || textToSearch.includes("სამფაზა") || textToSearch.includes("STALL");

  let isPhA = false;
  let isPhB = false;
  let isPhC = false;

  if (is3Ph) {
    isPhA = isPhB = isPhC = true;
  } else if (textToSearch.includes("A-B")) {
    isPhA = isPhB = true;
  } else if (textToSearch.includes("B-C")) {
    isPhB = isPhC = true;
  } else if (textToSearch.includes("A-G") || textToSearch.includes("A-ფაზა")) {
    isPhA = true;
  } else if (textToSearch.includes("B-G") || textToSearch.includes("B-ფაზა")) {
    isPhB = true;
  } else if (textToSearch.includes("C-G") || textToSearch.includes("C-ფაზა")) {
    isPhC = true;
  } else {
    // Default Fallback
    isPhA = true;
  }

  // 📈 ოსცილოგრამის გენერატორი - ზუსტი სინქრონიზაცია დასკვნასთან
  const generateTimelinePath = (channelType, phase, frequency = 8, yOffset = 40) => {
    let path = "";
    const width = 600;
    const points = 160;

    const isFaulted = (phase === 'A' && isPhA) || (phase === 'B' && isPhB) || (phase === 'C' && isPhC);

    for (let i = 0; i <= points; i++) {
      const ratio = i / points;
      const x = ratio * width;
      let amp = 0;

      const normAmpI = 5;
      const faultAmpI = phase === 'A' ? Math.min(32, Math.max(12, ia / 100)) : 
                        phase === 'B' ? Math.min(32, Math.max(12, ib / 100)) : 
                        Math.min(32, Math.max(12, ic / 100));

      const normAmpV = 20;
      const sagAmpV = Math.max(2, (voltageSag / normPhVolt) * 20);

      // --- ლოგიკა 1: წარმატებული აგჩ ---
      if (isARSuccess) {
        if (ratio < 0.25) { // ნორმალური რეჟიმი
          amp = channelType === 'V' ? normAmpV : normAmpI;
        } else if (ratio >= 0.25 && ratio < 0.40) { // ავარია & 1PH/3PH TRIP
          if (channelType === 'I') amp = isFaulted ? faultAmpI : normAmpI;
          else amp = isFaulted ? sagAmpV : normAmpV;
        } else if (ratio >= 0.40 && ratio < 0.70) { // აგჩ-ს პაუზა (გამოერთო ხაზი)
          amp = isFaulted ? 0 : (isGroundedNeutral ? 0 : normAmpI);
        } else { // აგჩ-მ შეატრიალა და წარმატებით აღდგა!
          amp = channelType === 'V' ? normAmpV : normAmpI;
        }
      } 
      // --- ლოგიკა 2: უშედეგო აგჩ (მდგრადი ავარია) ---
      else if (isARUnsuccess) {
        if (ratio < 0.20) { // ნორმალური რეჟიმი
          amp = channelType === 'V' ? normAmpV : normAmpI;
        } else if (ratio >= 0.20 && ratio < 0.35) { // 1-ლი ავარია
          if (channelType === 'I') amp = isFaulted ? faultAmpI : normAmpI;
          else amp = isFaulted ? sagAmpV : normAmpV;
        } else if (ratio >= 0.35 && ratio < 0.60) { // აგჩ-ს პაუზა (ხაზი გამორთულია)
          amp = 0;
        } else if (ratio >= 0.60 && ratio < 0.75) { // აგჩ შეტრიალდა ➔ განმეორებითი მ.შ.!
          if (channelType === 'I') amp = isFaulted ? faultAmpI * 1.1 : normAmpI;
          else amp = isFaulted ? sagAmpV * 0.7 : normAmpV;
        } else { // საბოლოო 3P TRIP - ხაზი სრულად გათიშულია
          amp = 0;
        }
      } 
      // --- ლოგიკა 3: მყარი ავარიული გამორთვა (TRIP აგჩ-ს გარეშე) ---
      else {
        if (ratio < 0.35) {
          amp = channelType === 'V' ? normAmpV : normAmpI;
        } else if (ratio >= 0.35 && ratio < 0.52) {
          if (channelType === 'I') amp = isFaulted ? faultAmpI : normAmpI;
          else amp = isFaulted ? sagAmpV : normAmpV;
        } else { // გამორთულია
          amp = 0;
        }
      }

      const phaseShift = phase === 'A' ? 0 : (phase === 'B' ? (2 * Math.PI) / 3 : (4 * Math.PI) / 3);
      const y = yOffset + amp * Math.sin(ratio * Math.PI * 2 * frequency + phaseShift);

      if (isNaN(y)) continue;
      path += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    }
    return path;
  };

  return (
    <div className="bg-[#0b0b0e] text-[#cdd6f4] border border-[#313244] rounded-lg p-3 font-mono shadow-2xl flex flex-col lg:flex-row gap-3">
      
      {/* მარცხენა მხარე: ოსცილოგრამები */}
      <div className="flex-1 bg-[#111116] border border-[#272738] p-2 rounded flex flex-col gap-2.5">
        
        {/* სტატუსის ბეჯი */}
        <div className="flex flex-wrap justify-between items-center bg-[#181825] px-2.5 py-1.5 rounded border border-[#313244] text-[11px] gap-2">
          <div className="flex gap-2 items-center">
            <span className="text-[#cba6f7] font-bold">
              🌐 {kvLevel}კვ ქსელი | {connectionType}
            </span>
          </div>
          {isARSuccess ? (
            <span className="bg-[#a6e3a1] text-[#11111b] text-[10px] px-2 py-0.5 rounded font-bold">
              ✅ აგჩ შეტრიალდა & ჩაირთო (AR OK)
            </span>
          ) : isARUnsuccess ? (
            <span className="bg-[#f38ba8] text-[#11111b] text-[10px] px-2 py-0.5 rounded font-bold">
              ❌ აგჩ შეტრიალდა ➔ განმეორებითი TRIP
            </span>
          ) : isFalseTrip ? (
            <span className="bg-[#a6adc8] text-[#11111b] text-[10px] px-2 py-0.5 rounded font-bold">
              ⚠️ ყალბი / ოპერატიული გამორთვა
            </span>
          ) : (
            <span className="bg-[#89b4fa] text-[#11111b] text-[10px] px-2 py-0.5 rounded font-bold">
              ⚡ მყარი გამორთვა (TRIP)
            </span>
          )}
        </div>

        {/* ოსცილოგრამების ბლოკი */}
        <div className="border border-[#313244] rounded p-2 bg-[#0d0d12]">
          <div className="text-[11px] font-bold text-[#89b4fa] border-b border-[#1e1e2e] pb-1 mb-2 flex justify-between">
            <span>🔹 {kvLevel}კვ ხაზის დენისა და ძაბვის ტალღები (WVFM)</span>
            <span className="text-[#a6adc8] text-[10px]">U_nom = {normPhVolt} კვ (ფაზური)</span>
          </div>

          {/* დენები */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-[#a6adc8] mb-1">
              <span className="text-[#f38ba8] font-bold">⚡ Analog Currents (A)</span>
              <div className="flex gap-3 font-bold text-[10px]">
                <span className="text-[#f38ba8]">IA: {ia} A</span>
                <span className="text-[#a6e3a1]">IB: {ib} A</span>
                <span className="text-[#89b4fa]">IC: {ic} A</span>
                <span className="text-[#f9e2af]">3I0 (IG): {ig} A</span>
              </div>
            </div>
            <svg viewBox="0 0 600 80" className="w-full h-20 stroke-2 fill-none">
              <line x1="0" y1="40" x2="600" y2="40" stroke="#2a2a3c" strokeDasharray="4 4" />
              
              {/* მარკერები დიაგრამაზე */}
              {isARSuccess && (
                <>
                  <line x1="240" y1="0" x2="240" y2="80" stroke="#f38ba8" strokeDasharray="3 3" />
                  <text x="244" y="12" fill="#f38ba8" fontSize="8">1-ლი TRIP</text>
                  <line x1="420" y1="0" x2="420" y2="80" stroke="#a6e3a1" strokeDasharray="3 3" />
                  <text x="424" y="12" fill="#a6e3a1" fontSize="8">აგჩ-მ ჩართო</text>
                </>
              )}
              {isARUnsuccess && (
                <>
                  <line x1="210" y1="0" x2="210" y2="80" stroke="#f38ba8" strokeDasharray="3 3" />
                  <text x="214" y="12" fill="#f38ba8" fontSize="8">1-ლი TRIP</text>
                  <line x1="360" y1="0" x2="360" y2="80" stroke="#f9e2af" strokeDasharray="3 3" />
                  <text x="364" y="12" fill="#f9e2af" fontSize="8">აგჩ შეტრიალდა</text>
                  <line x1="450" y1="0" x2="450" y2="80" stroke="#f38ba8" strokeWidth="2" />
                  <text x="454" y="12" fill="#f38ba8" fontSize="8">საბოლოო 3P TRIP</text>
                </>
              )}

              <path d={generateTimelinePath('I', 'A', 8, 40)} stroke="#f38ba8" strokeWidth="1.8" />
              <path d={generateTimelinePath('I', 'B', 8, 40)} stroke="#a6e3a1" strokeWidth="1.8" />
              <path d={generateTimelinePath('I', 'C', 8, 40)} stroke="#89b4fa" strokeWidth="1.8" />
            </svg>
          </div>

          {/* ძაბვები */}
          <div>
            <div className="flex justify-between text-[10px] text-[#a6adc8] mb-1">
              <span className="text-[#89dceb] font-bold">📉 Analog Voltages (kV Ph-G)</span>
              <div className="flex gap-3 font-bold text-[10px]">
                <span className="text-[#f38ba8]">VA: {isPhA ? voltageSag : normPhVolt} კვ</span>
                <span className="text-[#a6e3a1]">VB: {isPhB ? voltageSag : normPhVolt} კვ</span>
                <span className="text-[#89b4fa]">VC: {isPhC ? voltageSag : normPhVolt} კვ</span>
              </div>
            </div>
            <svg viewBox="0 0 600 70" className="w-full h-16 stroke-2 fill-none">
              <line x1="0" y1="35" x2="600" y2="35" stroke="#2a2a3c" strokeDasharray="4 4" />
              <path d={generateTimelinePath('V', 'A', 8, 35)} stroke="#f38ba8" strokeWidth="1.8" />
              <path d={generateTimelinePath('V', 'B', 8, 35)} stroke="#a6e3a1" strokeWidth="1.8" />
              <path d={generateTimelinePath('V', 'C', 8, 35)} stroke="#89b4fa" strokeWidth="1.8" />
            </svg>
          </div>
        </div>

        {/* 🚦 ციფრული სიგნალები (TRIP / AR 79) */}
        <div className="bg-[#0d0d12] border border-[#1e1e2e] rounded p-2">
          <span className="text-[11px] text-[#cba6f7] font-bold block mb-1.5">🚦 Digital Relay Signals (TRIP / AR 79)</span>
          <div className="flex flex-col gap-1.5 text-[10px]">
            
            {/* TRIP Signal */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-[#f38ba8] font-bold">TRIP</span>
              <div className="flex-1 h-3 bg-[#181825] relative rounded overflow-hidden">
                {isARSuccess && (
                  <div className="absolute left-[25%] w-[15%] top-0 bottom-0 bg-[#f38ba8]"></div>
                )}
                {isARUnsuccess && (
                  <>
                    <div className="absolute left-[20%] w-[15%] top-0 bottom-0 bg-[#f38ba8]"></div>
                    <div className="absolute left-[75%] right-0 top-0 bottom-0 bg-[#f38ba8]"></div>
                  </>
                )}
                {!isARSuccess && !isARUnsuccess && (
                  <div className="absolute left-[35%] right-0 top-0 bottom-0 bg-[#f38ba8]"></div>
                )}
              </div>
            </div>

            {/* AR 79 Signal */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-[#a6e3a1] font-bold">79 AR</span>
              <div className="flex-1 h-3 bg-[#181825] relative rounded overflow-hidden">
                {isARSuccess && (
                  <div className="absolute left-[70%] right-0 top-0 bottom-0 bg-[#a6e3a1]"></div>
                )}
                {isARUnsuccess && (
                  <div className="absolute left-[60%] w-[15%] top-0 bottom-0 bg-[#f9e2af]"></div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* მარჯვენა პანელი - ანალიზის დასკვნა */}
      <div className="w-full lg:w-[290px] bg-[#161622] border border-[#313244] p-3 rounded flex flex-col gap-2.5 text-[12px]">
        <div className="border-b border-[#313244] pb-2">
          <div className="flex justify-between items-center">
            <span className="text-[#89b4fa] font-bold">📊 SynchroWAVE Event</span>
            <span className="bg-[#f38ba8] text-[#11111b] text-[10px] font-bold px-1.5 py-0.5 rounded">
              {eventType}
            </span>
          </div>
          <span className="text-[#a6adc8] text-[10px] block mt-1">File: {fileName}</span>
          <span className="text-[#a6adc8] text-[10px] block">Time: {timeStr}</span>
          <span className="text-[#cba6f7] text-[10px] block font-bold mt-0.5">FID: {relayModel}</span>
        </div>

        <div className="bg-[#1e1e2e] p-2 rounded border border-[#45475a]">
          <span className="text-[#f9e2af] text-[11px] font-bold block mb-1">🎯 Targets / Signals:</span>
          <code className="text-[#a6e3a1] text-[11px] block font-mono">{targets}</code>
        </div>

        <div className="bg-[#181825] p-2 rounded border border-[#313244]">
          <span className="text-[#89dceb] text-[11px] font-bold block mb-1">⚡ Primary Measured Values:</span>
          <div className="grid grid-cols-2 gap-1 text-[11px] font-mono mb-1">
            <span>IA: <strong className="text-[#f38ba8]">{ia} A</strong></span>
            <span>VA: <strong className="text-[#f38ba8]">{isPhA ? voltageSag : normPhVolt} kV</strong></span>
            <span>IB: <span className="text-[#a6e3a1]">{ib} A</span></span>
            <span>VB: <span className="text-[#a6e3a1]">{isPhB ? voltageSag : normPhVolt} kV</span></span>
            <span>IC: <span className="text-[#89b4fa]">{ic} A</span></span>
            <span>VC: <span className="text-[#89b4fa]">{isPhC ? voltageSag : normPhVolt} kV</span></span>
            <span className="col-span-2 text-center border-t border-[#313244] pt-1 mt-1">
              3I0 (IG): <strong className="text-[#f9e2af]">{ig} A</strong>
            </span>
          </div>
        </div>

        <div className="bg-[#2a1320] border border-[#f38ba8] p-2 rounded text-[#f38ba8]">
          <span className="font-bold block text-[11px]">📋 ანალიზის დასკვნა:</span>
          <p className="text-[11px] m-0 mt-1 leading-snug">{faultType}</p>
        </div>
      </div>
    </div>
  );
}