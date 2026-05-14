
import React from 'react';
import { PortfolioLayout } from '../types';

export const PortfolioBuilder: React.FC<{ data: PortfolioLayout }> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800 overflow-hidden font-ar">
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]"></div>
        <h3 className="text-2xl font-black flex items-center gap-3 relative z-10">
          <i className="fa-solid fa-briefcase text-emerald-500"></i>
          هيكلية محفظة الأعمال الذكية (AI Portfolio Structure)
        </h3>
        <p className="text-slate-400 text-xs mt-2 font-bold opacity-80 relative z-10 uppercase tracking-widest">بناء الهوية البصرية لمشاريعك أمام المستثمرين</p>
      </div>
      <div className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data?.structure?.map((section, idx) => (
            <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">{section.section_name}</h4>
                <span className="bg-slate-900 dark:bg-slate-700 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest">
                  {section.key_projects_count} {section.key_projects_count > 10 ? 'Items' : 'Projects'}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">{section.description}</p>
              <div className="flex flex-wrap gap-2">
                {section.recommended_tech?.map((tech, i) => (
                  <span key={i} className="text-[10px] bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 px-3 py-1 rounded-xl text-slate-600 dark:text-slate-400 font-black">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <button className="bg-slate-900 dark:bg-emerald-600 text-white font-black px-12 py-5 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <i className="fa-solid fa-file-export"></i>
            تصدير الهيكلية النهائية
          </button>
        </div>
      </div>
    </div>
  );
};
