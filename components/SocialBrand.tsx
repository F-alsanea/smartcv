
import React, { useState } from 'react';
import { SocialBrand as SocialBrandType } from '../types';

export const SocialBrand: React.FC<{ data: SocialBrandType }> = ({ data }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800 overflow-hidden font-ar">
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]"></div>
        <h3 className="text-2xl font-black flex items-center gap-3 relative z-10">
          <i className="fa-solid fa-share-nodes text-emerald-500"></i>
          صانع المحتوى المهني (Personal Brand Builder)
        </h3>
        <p className="text-slate-400 text-xs mt-2 font-bold opacity-80 relative z-10 uppercase tracking-widest">أعلن عن جاهزيتك للعمل واجذب خوارزميات التوظيف</p>
      </div>
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-3 text-lg">
              <i className="fa-brands fa-linkedin text-[#0077b5] text-2xl"></i> LinkedIn Post
            </h4>
            <button 
              onClick={() => copy(data?.linkedin_post || '', 'li')}
              className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all border-2 ${copied === 'li' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500'}`}
            >
              {copied === 'li' ? 'COPIED!' : 'COPY CONTENT'}
            </button>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed h-56 overflow-y-auto font-medium shadow-inner">
            {data?.linkedin_post}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-3 text-lg">
              <i className="fa-brands fa-x-twitter text-black dark:text-white text-2xl"></i> X (Twitter) Hook
            </h4>
            <button 
              onClick={() => copy(data?.x_post || '', 'x')}
              className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all border-2 ${copied === 'x' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500'}`}
            >
              {copied === 'x' ? 'COPIED!' : 'COPY CONTENT'}
            </button>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed h-56 overflow-y-auto font-medium shadow-inner">
            {data?.x_post}
          </div>
        </div>
      </div>
    </div>
  );
};
