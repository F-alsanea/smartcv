
import React from 'react';
import { ScorecardData } from '../types';

export const Scorecard: React.FC<{ data: ScorecardData }> = ({ data }) => {
  const getBadgeColor = () => {
    switch (data.recommendation) {
      case 'HIRE': return 'bg-emerald-500';
      case 'FUTURE': return 'bg-amber-500';
      case 'REJECT': return 'bg-slate-500';
    }
  };

  const getRecText = () => {
    switch (data.recommendation) {
      case 'HIRE': return 'نوصي بالتوظيف فوراً';
      case 'FUTURE': return 'جيد للمستقبل';
      case 'REJECT': return 'غير مناسب حالياً';
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-2xl border-2 border-slate-100 overflow-hidden relative">
      <div className={`absolute top-0 left-0 right-0 h-2 ${getBadgeColor()}`}></div>
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black text-slate-900">بطاقة التقييم الموحدة</h3>
        <div className={`${getBadgeColor()} text-white px-6 py-2 rounded-full font-black text-sm shadow-lg`}>
          {getRecText()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="text-4xl font-black text-slate-900 mb-1">{data.ats_score}%</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">محتوى السيرة (ATS)</div>
        </div>
        <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="text-4xl font-black text-emerald-600 mb-1">{data.interview_score}%</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">أداء المقابلة</div>
        </div>
        <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="text-4xl font-black text-blue-600 mb-1">{data.reliability_score}%</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">الموثوقية (الشهادات)</div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl">
        <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          خلاصة القرار الذكي:
        </h4>
        <p className="text-slate-300 leading-relaxed text-sm italic">"{data.summary_text}"</p>
      </div>
    </div>
  );
};
