
import React from 'react';
import { EnhancementReport, SuggestedAchievement } from '../types';

interface CVComparisonProps {
  originalText: string;
  report: EnhancementReport;
  onConfirmAchievement: (positionIdx: number, ach: string) => void;
  suggested: SuggestedAchievement[];
}

export const CVComparison: React.FC<CVComparisonProps> = ({ originalText, report, onConfirmAchievement, suggested }) => {
  const improvement = report.new_score - report.old_score;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-black">تقرير التحسين الفوري (AI Report)</h3>
            <p className="text-slate-400">تحليل "التنقيب العميق" لسيرتك السابقة</p>
          </div>
          <div className="flex items-center gap-12">
            <div className="text-center">
              <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-widest">قبل التحسين</div>
              <div className="text-4xl font-black text-slate-600">{report.old_score}%</div>
            </div>
            <div className="flex flex-col items-center">
               <i className="fa-solid fa-chevron-left text-emerald-500 text-2xl animate-pulse"></i>
               <span className="text-[10px] font-bold text-emerald-500 mt-2">+{improvement}%</span>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-emerald-400 mb-1 uppercase tracking-widest">بعد التحسين</div>
              <div className="text-5xl font-black text-emerald-500 shadow-emerald-500/20 drop-shadow-lg">{report.new_score}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <i className="fa-solid fa-file-lines text-slate-400"></i>
            <span className="font-bold text-slate-600">المحتوى الأصلي (Raw Input)</span>
          </div>
          <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">
            {originalText}
          </div>
        </div>
        <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl flex flex-col relative">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-emerald-600"></i>
              <span className="font-bold text-emerald-900">المعالجة الذكية (Smart Output)</span>
            </div>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black">ATS GOLDEN</span>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="space-y-2">
               <h4 className="text-xs font-black text-slate-400 uppercase">تحديث المسميات الوظيفية:</h4>
               <div className="flex flex-wrap gap-2">
                 {report.modernized_titles.map((t, i) => (
                   <div key={i} className="flex items-center gap-2 bg-slate-50 border px-3 py-1.5 rounded-xl text-xs">
                     <span className="text-slate-400 line-through">{t.old}</span>
                     <i className="fa-solid fa-arrow-left text-[10px] text-emerald-500"></i>
                     <span className="font-black text-slate-900">{t.new}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-black text-slate-400 uppercase">إثراء المحتوى (الإنجازات المقترحة):</h4>
               <p className="text-[10px] text-slate-500 italic">لقد قمنا بتوليد إنجازات ذكية لمناصبك، اختر ما قمت به فعلياً ليتم إضافته للمسودة النهائية:</p>
               {suggested.map((s, idx) => (
                 <div key={idx} className="space-y-2 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                    <div className="text-[10px] font-bold text-emerald-700">المنصب #{s.position_idx + 1}</div>
                    <div className="space-y-2">
                      {s.achievements.map((ach, i) => (
                        <button 
                          key={i} 
                          onClick={() => onConfirmAchievement(s.position_idx, ach)}
                          className="w-full text-right p-3 bg-white border border-emerald-100 rounded-xl text-xs text-slate-700 hover:border-emerald-500 transition-all flex items-center justify-between group"
                        >
                          <span>{ach}</span>
                          <i className="fa-solid fa-plus text-emerald-400 group-hover:scale-125 transition-transform"></i>
                        </button>
                      ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start gap-4">
        <i className="fa-solid fa-circle-exclamation text-amber-500 text-2xl mt-1"></i>
        <div>
          <h4 className="font-black text-amber-900">تنبيه فجوات زمنية (Time Gaps Detected):</h4>
          <ul className="mt-2 space-y-1">
            {report.detected_gaps.map((gap, i) => (
              <li key={i} className="text-sm text-amber-800 flex items-center gap-2">
                <i className="fa-solid fa-clock text-[10px]"></i>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
