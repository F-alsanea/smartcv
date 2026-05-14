
import React from 'react';
import { CareerPathData } from '../types';

export const CareerPath: React.FC<{ data: CareerPathData }> = ({ data }) => {
  if (!data) return null;
  
  const suggestedJobs = data.suggested_jobs || [];
  const skillGap = data.skill_gap?.skills || [];
  const salaryIncrease = data.skill_gap?.potential_salary_increase || '...';

  return (
    <div className="bg-slate-900 text-white rounded-[40px] p-10 shadow-4xl border border-slate-800 animate-in fade-in duration-700 relative overflow-hidden font-ar">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      <div className="flex items-center gap-5 mb-12 relative z-10">
        <div className="p-5 bg-emerald-600 rounded-3xl shadow-xl rotate-3">
          <i className="fa-solid fa-map-location-dot text-3xl"></i>
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter">خارطة الطريق المهنية 2026</h2>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">تحليل ذكي بناءً على رؤية المملكة ومتطلبات السوق</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="space-y-10">
          <section>
            <h3 className="text-emerald-400 font-black mb-6 flex items-center gap-3 text-sm uppercase tracking-widest">
              <i className="fa-solid fa-briefcase"></i> الوظائف المقترحة
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {suggestedJobs.map((job, idx) => (
                <div key={idx} className="bg-slate-800/50 p-5 rounded-[24px] border-2 border-slate-700 flex justify-between items-center group hover:border-emerald-500 transition-all shadow-lg">
                  <span className="font-black text-lg">{job}</span>
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <i className="fa-solid fa-arrow-left text-sm"></i>
                  </div>
                </div>
              ))}
              {suggestedJobs.length === 0 && <p className="text-slate-500 text-xs italic font-bold">لا توجد بيانات متاحة حالياً</p>}
            </div>
          </section>

          <section className="bg-emerald-500/5 p-8 rounded-[35px] border-2 border-emerald-500/20 shadow-inner">
            <h3 className="text-emerald-400 font-black mb-6 flex items-center gap-3 text-sm uppercase tracking-widest">
              <i className="fa-solid fa-bullseye"></i> فجوة المهارات والشهادات
            </h3>
            <div className="grid grid-cols-1 gap-3 mb-8">
              {skillGap.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 font-bold bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <i className="fa-solid fa-circle-check text-emerald-500"></i>
                  <span>{skill}</span>
                </div>
              ))}
              {skillGap.length === 0 && <p className="text-slate-500 text-xs italic font-bold">سيتم عرض المهارات المفقودة هنا</p>}
            </div>
            <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-3 bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 shadow-lg">
              <i className="fa-solid fa-money-bill-trend-up"></i>
              زيادة متوقعة في الراتب: {salaryIncrease}
            </div>
          </section>
        </div>

        <div className="flex flex-col">
          <section className="flex-grow bg-slate-800/30 p-10 rounded-[40px] border-2 border-slate-700 relative group">
            <div className="absolute top-6 left-6 text-emerald-500/10 text-7xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-microphone-lines"></i>
            </div>
            <h3 className="text-emerald-400 font-black mb-8 flex items-center gap-3 text-sm uppercase tracking-widest relative z-10">
              رسالة الإقناع (Elevator Pitch)
            </h3>
            <div className="relative italic text-slate-200 leading-relaxed text-xl bg-slate-900/80 p-8 rounded-3xl border-2 border-slate-700 shadow-2xl z-10 font-medium">
              <i className="fa-solid fa-quote-right absolute -top-4 -right-4 text-5xl text-emerald-500/30"></i>
              "{data.elevator_pitch || '...'}"
              <p className="mt-8 text-[10px] text-slate-500 not-italic font-black uppercase tracking-[0.2em]">Sira-AI Pitch Builder // Professional Standard</p>
            </div>
            <p className="mt-8 text-slate-400 text-sm font-bold leading-relaxed px-2 italic opacity-60">استخدم هذا النص عند التعريف بنفسك في المقابلات أو عبر LinkedIn لجذب انتباه مدراء التوظيف فوراً.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
