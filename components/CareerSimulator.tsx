
import React from 'react';
import { CareerTimeline } from '../types';

export const CareerSimulator: React.FC<{ data: CareerTimeline }> = ({ data }) => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
      <div className="bg-gradient-to-l from-emerald-600 to-teal-800 p-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-rocket text-yellow-400"></i>
          محاكي التطور الوظيفي (Career Path Simulator)
        </h3>
        <p className="text-emerald-100 text-sm mt-1">توقع المسار المهني والمادي لـ 5 سنوات قادمة</p>
      </div>
      <div className="p-8">
        <div className="relative border-r-2 border-slate-700 pr-8 space-y-12">
          {data.steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -right-[37px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 group-hover:scale-125 transition-transform"></div>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-emerald-400 font-bold text-lg">{step.year}</span>
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">{step.salary}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-100 mb-2">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  التركيز المهني: <span className="text-slate-200 font-medium">{step.focus_skill}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-emerald-500/10 rounded-xl text-center text-xs text-emerald-400 border border-emerald-500/20">
          <i className="fa-solid fa-info-circle ml-2"></i>
          تعتمد هذه التوقعات على تحليل بيانات السوق السعودي 2026 والنمو المتوقع في قطاعك.
        </div>
      </div>
    </div>
  );
};
