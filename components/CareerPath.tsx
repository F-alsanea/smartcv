
import React from 'react';
import { CareerPathData } from '../types';

export const CareerPath: React.FC<{ data: CareerPathData }> = ({ data }) => {
  if (!data) return null;
  
  const suggestedJobs = data.suggested_jobs || [];
  const skillGap = data.skill_gap?.skills || [];
  const salaryIncrease = data.skill_gap?.potential_salary_increase || '...';

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl border-b-8 border-emerald-500 animate-in fade-in duration-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-500 rounded-lg">
          <i className="fa-solid fa-map-location-dot text-2xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">خارطة الطريق المهنية 2026</h2>
          <p className="text-emerald-400 text-sm">تحليل ذكي بناءً على رؤية المملكة ومتطلبات السوق</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section>
            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-briefcase"></i> الوظائف المقترحة
            </h3>
            <div className="space-y-3">
              {suggestedJobs.map((job, idx) => (
                <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-emerald-500 transition-all">
                  <span className="font-bold">{job}</span>
                  <i className="fa-solid fa-arrow-left text-emerald-500 opacity-0 group-hover:opacity-100 transition-all"></i>
                </div>
              ))}
              {suggestedJobs.length === 0 && <p className="text-slate-500 text-xs italic">لا توجد بيانات متاحة حالياً</p>}
            </div>
          </section>

          <section className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/30">
            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bullseye"></i> فجوة المهارات والشهادات
            </h3>
            <div className="space-y-2 mb-4">
              {skillGap.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                  <i className="fa-solid fa-circle-check text-emerald-500"></i>
                  <span>{skill}</span>
                </div>
              ))}
              {skillGap.length === 0 && <p className="text-slate-500 text-xs italic">سيتم عرض المهارات المفقودة هنا</p>}
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-4 bg-emerald-500/20 p-3 rounded text-center">
              زيادة متوقعة في الراتب: {salaryIncrease}
            </div>
          </section>
        </div>

        <div className="flex flex-col">
          <section className="flex-grow bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <h3 className="text-emerald-400 font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-microphone-lines"></i> رسالة الإقناع (Elevator Pitch)
            </h3>
            <div className="relative italic text-slate-300 leading-relaxed text-lg bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
              <i className="fa-solid fa-quote-right absolute -top-3 -right-3 text-4xl text-emerald-500/20"></i>
              "{data.elevator_pitch || '...'}"
              <p className="mt-6 text-xs text-slate-500 not-italic font-medium">استخدم هذا النص عند التعريف بنفسك في المقابلات أو عبر LinkedIn</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
