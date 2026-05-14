
import React from 'react';
import { SalaryNegotiation } from '../types';

export const SalaryNegotiator: React.FC<{ data: SalaryNegotiation }> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-emerald-700 p-6 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-hand-holding-dollar"></i>
          ذكاء التفاوض على الراتب (Salary Negotiator)
        </h3>
        <p className="text-emerald-100 text-sm mt-1">توقع الدخل وبناء الحجة المالية لسوق 2026</p>
      </div>
      <div className="p-8">
        <div className="mb-10">
          <h4 className="text-center text-slate-500 font-bold mb-6 text-sm">نطاق الراتب المتوقع (شهرياً)</h4>
          <div className="relative h-12 bg-slate-100 rounded-full border border-slate-200 overflow-hidden flex items-center">
            <div className="absolute left-1/4 right-1/4 h-full bg-emerald-100 border-x border-emerald-300"></div>
            <div className="absolute left-[15%] flex flex-col items-center">
               <div className="w-1 h-8 bg-slate-400"></div>
               <span className="text-[10px] font-bold text-slate-500 mt-1">الأدنى: {data.range.min}</span>
            </div>
            <div className="absolute right-[15%] flex flex-col items-center">
               <div className="w-1 h-8 bg-slate-400"></div>
               <span className="text-[10px] font-bold text-slate-500 mt-1">الأعلى: {data.range.max}</span>
            </div>
            <div className="w-full text-center font-black text-emerald-700 z-10 text-lg">
              سوق العمل السعودي 2026
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
          <h4 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-comments"></i>
            كيف تجيب على سؤال: "ما هو الراتب المتوقع؟"
          </h4>
          <div className="bg-white p-4 rounded-xl border border-amber-200 italic text-slate-700 leading-relaxed">
            "{data.script}"
          </div>
        </div>
      </div>
    </div>
  );
};
