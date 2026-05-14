
import React from 'react';
import { PortfolioLayout } from '../types';

export const PortfolioBuilder: React.FC<{ data: PortfolioLayout }> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-briefcase text-emerald-400"></i>
          صانع محفظة الأعمال الذكية (AI Portfolio Builder)
        </h3>
        <p className="text-slate-400 text-sm mt-1">هيكلية احترافية لعرض مشاريعك أمام المستثمرين</p>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.structure.map((section, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-black text-slate-800 text-lg">{section.section_name}</h4>
                <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold">
                  {section.key_projects_count} مشاريع مقترحة
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">{section.description}</p>
              <div className="flex flex-wrap gap-2">
                {section.recommended_tech.map((tech, i) => (
                  <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-500 font-bold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
            <i className="fa-solid fa-file-export"></i>
            تصدير هيكلية المحفظة
          </button>
        </div>
      </div>
    </div>
  );
};
