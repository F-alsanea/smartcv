
import React from 'react';
import { MarketInsights } from '../types';

export const CareerRadar: React.FC<{ data: MarketInsights }> = ({ data }) => {
  if (!data) return null;
  const trendingSkills = data.trending_skills || [];
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-700">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-radar text-emerald-300"></i>
          الرادار الوظيفي (Career Radar)
        </h3>
        <p className="text-blue-100 text-sm mt-1">رؤية السوق في منطقة {data.city || '... '}</p>
      </div>
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">الأكثر طلباً في منطقتك</h4>
            <div className="space-y-3">
              {trendingSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{skill}</span>
                  <i className="fa-solid fa-circle-nodes text-indigo-500"></i>
                </div>
              ))}
              {trendingSkills.length === 0 && <p className="text-slate-500 text-xs italic">لا توجد مهارات رائجة مكتشفة حالياً</p>}
            </div>
          </div>
          <div className="flex-1 bg-indigo-50 dark:bg-indigo-950/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-400 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-chart-line"></i>
              تحليل المنطقة الجغرافي
            </h4>
            <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed text-sm">{data.region_analysis || 'لا توجد بيانات تحليلية متاحة.'}</p>
            <div className="mt-4 p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg text-xs text-indigo-600 italic">
              * قمنا بتمييز المهارات المشتركة في سيرتك لزيادة فرص ظهورك لدى الشركات المحلية.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
