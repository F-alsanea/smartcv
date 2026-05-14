
import React, { useState } from 'react';

interface SmartSchedulerProps {
  onSchedule: (details: string) => void;
  candidateName: string;
}

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({ onSchedule, candidateName }) => {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <i className="fa-solid fa-calendar-check text-emerald-600"></i>
        جدولة مقابلة حقيقية
      </h3>
      <p className="text-sm text-slate-500 mb-6 italic">سيتم إرسال تنبيه فوري لـ {candidateName} عبر الواتساب والإيميل.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">التاريخ والوقت</label>
            <input 
              type="datetime-local" 
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">موقع الشركة (Google Maps)</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
              placeholder="أو اكتب اسم المكتب..."
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => onSchedule(`${date} | ${location}`)}
          disabled={!date || !location}
          className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-paper-plane"></i>
          تأكيد الموعد والإرسال
        </button>
      </div>
    </div>
  );
};
