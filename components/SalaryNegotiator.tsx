
import React from 'react';
import { SalaryNegotiation } from '../types';

export const SalaryNegotiator: React.FC<{ data: SalaryNegotiation }> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800 overflow-hidden font-ar">
      <div className="bg-emerald-700 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px]"></div>
        <h3 className="text-2xl font-black flex items-center gap-3 relative z-10">
          <i className="fa-solid fa-hand-holding-dollar"></i>
          ذكاء التفاوض على الراتب (Salary Negotiator)
        </h3>
        <p className="text-emerald-100 text-xs font-bold mt-2 opacity-80 relative z-10 uppercase tracking-widest">توقع الدخل وبناء الحجة المالية لسوق 2026</p>
      </div>
      <div className="p-10">
        <div className="mb-12">
          <h4 className="text-center text-slate-400 font-black mb-8 text-[10px] uppercase tracking-[0.2em]">نطاق الراتب المتوقع (شهرياً)</h4>
          <div className="relative h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 overflow-hidden flex items-center shadow-inner">
            <div className="absolute left-1/4 right-1/4 h-full bg-emerald-500/10 border-x-2 border-emerald-500/20"></div>
            <div className="absolute left-[10%] flex flex-col items-center">
               <div className="w-1 h-10 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
               <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-tighter">MIN: {data?.range?.min}</span>
            </div>
            <div className="absolute right-[10%] flex flex-col items-center">
               <div className="w-1 h-10 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
               <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-tighter">MAX: {data?.range?.max}</span>
            </div>
            <div className="w-full text-center font-black text-emerald-600 dark:text-emerald-400 z-10 text-xl tracking-tight">
              Sira-AI Market Pulse
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-[32px] border-2 border-emerald-100 dark:border-emerald-900/50 relative group">
          <div className="absolute top-4 left-4 text-emerald-200 dark:text-emerald-800/30 text-5xl opacity-50 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-quote-left"></i>
          </div>
          <h4 className="text-emerald-800 dark:text-emerald-400 font-black mb-4 flex items-center gap-3 text-sm relative z-10">
            <i className="fa-solid fa-comments"></i>
            كيف تجيب على سؤال: "ما هو الراتب المتوقع؟"
          </h4>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800 italic text-slate-700 dark:text-slate-300 leading-relaxed font-medium relative z-10 text-sm">
            "{data?.script}"
          </div>
        </div>
      </div>
    </div>
  );
};
