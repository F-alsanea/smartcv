
import React from 'react';
import { CareerTimeline } from '../types';

export const CareerSimulator: React.FC<{ data: CareerTimeline }> = ({ data }) => {
  return (
    <div className="bg-slate-900 text-white rounded-[40px] shadow-4xl border border-slate-800 overflow-hidden font-ar">
      <div className="bg-gradient-to-l from-emerald-600 to-teal-900 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px]"></div>
        <h3 className="text-2xl font-black flex items-center gap-3 relative z-10">
          <i className="fa-solid fa-rocket text-emerald-300"></i>
          محاكي التطور الوظيفي (Career Path Simulator)
        </h3>
        <p className="text-emerald-100 text-xs font-bold mt-2 opacity-80 relative z-10 uppercase tracking-widest">توقع المسار المهني والمادي لـ 5 سنوات قادمة</p>
      </div>
      <div className="p-10">
        <div className="relative border-r-4 border-slate-800 pr-10 space-y-12">
          {data?.steps?.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -right-[46px] top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-900 group-hover:scale-125 transition-transform shadow-lg shadow-emerald-500/20"></div>
              <div className="bg-slate-800/30 p-8 rounded-[32px] border border-slate-700 hover:border-emerald-500/50 transition-all shadow-xl group-hover:bg-slate-800/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-emerald-400 font-black text-2xl tracking-tighter">{step.year}</span>
                  <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black border border-emerald-500/20">{step.salary}</span>
                </div>
                <h4 className="text-2xl font-black text-white mb-3 tracking-tight">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  المستهدف المهني: <span className="text-emerald-200 font-bold">{step.focus_skill}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 bg-emerald-500/5 rounded-3xl text-center text-[10px] text-emerald-400/60 border border-emerald-500/10 font-black uppercase tracking-widest">
          <i className="fa-solid fa-info-circle ml-2"></i>
          Sira-AI Sovereign Prediction Engine // Saudi Market 2026 Standards
        </div>
      </div>
    </div>
  );
};
