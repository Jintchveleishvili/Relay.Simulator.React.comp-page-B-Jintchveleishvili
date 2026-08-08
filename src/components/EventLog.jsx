import React from 'react';

export default function EventLog({ logs, clearLogs }) {
  return (
    <div className="flex-1 flex flex-col bg-[#07070a] rounded p-[8px] border border-[#222330] min-h-[160px]">
      <div className="flex justify-between items-center mb-[4px]">
        <h3 className="m-0 text-[11px] text-[#89b4fa] font-bold flex items-center gap-1">
          📜 მოვლენათა ჟურნალი
        </h3>
        <button className="bg-transparent text-white cursor-pointer p-[2px] rounded text-[11px] hover:bg-[#313244]" onClick={clearLogs}>🗑️</button>
      </div>
      <div className="flex-1 overflow-y-auto font-mono text-[9px]">
        {logs.map((log, index) => (
          <div key={index} className="mb-[3px] leading-[1.3]" style={{ color: log.type === 'success' ? '#a6e3a1' : log.type === 'warn' ? '#f9e2af' : log.type === 'danger' ? '#f38ba8' : '#cdd6f4' }}>
            <code>[{log.time}] {log.message}</code>
          </div>
        ))}
      </div>
    </div>
  );
}