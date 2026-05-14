
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
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-share-nodes text-emerald-400"></i>
          صانع المحتوى المهني (Personal Brand Builder)
        </h3>
        <p className="text-slate-400 text-sm mt-1">أعلن عن جاهزيتك للعمل واجذب خوارزميات التوظيف</p>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-brands fa-linkedin text-blue-700"></i> LinkedIn Template
            </h4>
            <button 
              onClick={() => copy(data.linkedin_post, 'li')}
              className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-600 px-3 py-1 rounded-lg font-bold transition-all"
            >
              {copied === 'li' ? 'تم النسخ!' : 'نسخ النص'}
            </button>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 whitespace-pre-wrap leading-relaxed h-48 overflow-y-auto">
            {data.linkedin_post}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-brands fa-x-twitter text-black"></i> X (Twitter) Template
            </h4>
            <button 
              onClick={() => copy(data.x_post, 'x')}
              className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-600 px-3 py-1 rounded-lg font-bold transition-all"
            >
              {copied === 'x' ? 'تم النسخ!' : 'نسخ النص'}
            </button>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 whitespace-pre-wrap leading-relaxed h-48 overflow-y-auto">
            {data.x_post}
          </div>
        </div>
      </div>
    </div>
  );
};
