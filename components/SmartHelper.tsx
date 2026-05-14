
import React, { useState } from 'react';
import { SmartHelperData } from '../types';

export const SmartHelper: React.FC<{ data: SmartHelperData }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'formal' | 'follow' | 'direct' | 'linkedin' | 'ref'>('formal');

  if (!data) return null;

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('تم نسخ النص إلى الحافظة بنجاح');
  };

  const tabs = [
    { id: 'formal', label: 'تقديم رسمي', content: data.emails?.formal || '', icon: 'fa-paper-plane' },
    { id: 'follow', label: 'متابعة الطلب', content: data.emails?.follow_up || '', icon: 'fa-clock-rotate-left' },
    { id: 'direct', label: 'تواصل مباشر', content: data.emails?.direct || '', icon: 'fa-user-tie' },
    { id: 'linkedin', label: 'رسالة LinkedIn', content: data.linkedin_message || '', icon: 'fa-brands fa-linkedin' },
    { id: 'ref', label: 'طلب توصية', content: data.reference_request_sample || '', icon: 'fa-handshake' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-700 font-ar">
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]"></div>
        <h3 className="text-2xl font-black flex items-center gap-3 relative z-10">
          <i className="fa-solid fa-wand-magic-sparkles text-emerald-500"></i>
          مساعد التقديم الذكي (Smart Application Helper)
        </h3>
        <p className="text-slate-400 text-xs mt-2 font-bold opacity-80 relative z-10 uppercase tracking-widest">نماذج احترافية مخصصة لسيرتك الذاتية</p>
      </div>

      <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-slate-50 dark:bg-slate-950 no-scrollbar p-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 px-6 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-2xl flex items-center justify-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-xl'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-emerald-400' : ''}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-10">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[35px] p-10 relative group border-2 border-slate-100 dark:border-slate-800 shadow-inner">
          <button 
            onClick={() => currentTab && copyToClipboard(currentTab.content)}
            className="absolute top-6 left-6 bg-white dark:bg-slate-900 shadow-xl p-4 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all hover:scale-110 active:scale-95"
            title="نسخ النص"
          >
            <i className="fa-solid fa-copy text-xl"></i>
          </button>
          <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-medium min-h-[150px] text-lg">
            {currentTab?.content || 'لا يوجد محتوى متاح لهذا القسم.'}
          </div>
        </div>
        <p className="mt-10 text-[10px] text-slate-400 text-center font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <i className="fa-solid fa-info-circle text-emerald-500"></i>
          Sira-AI Content Generator // Global 2026 Recruitment Standards
        </p>
      </div>
    </div>
  );
};
