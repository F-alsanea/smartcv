
import React, { useState } from 'react';
import { SmartHelperData } from '../types';

export const SmartHelper: React.FC<{ data: SmartHelperData }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'formal' | 'follow' | 'direct' | 'linkedin' | 'ref'>('formal');

  if (!data) return null;

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('تم نسخ النص إلى الحافظة');
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
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-700">
      <div className="bg-slate-900 dark:bg-black p-6 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles text-emerald-400"></i>
          مساعد التقديم الذكي (Smart Application Helper)
        </h3>
        <p className="text-slate-400 text-sm mt-1">نماذج احترافية مخصصة لسيرتك الذاتية</p>
      </div>

      <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-slate-50 dark:bg-slate-950 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 px-6 text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === tab.id 
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 relative group border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => currentTab && copyToClipboard(currentTab.content)}
            className="absolute top-4 left-4 bg-white dark:bg-slate-900 shadow-md p-2 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
            title="نسخ النص"
          >
            <i className="fa-solid fa-copy"></i>
          </button>
          <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-medium min-h-[100px]">
            {currentTab?.content || 'لا يوجد محتوى متاح لهذا القسم.'}
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-400 text-center flex items-center justify-center gap-2">
          <i className="fa-solid fa-info-circle"></i>
          هذه النماذج مصاغة بعناية لتناسب المسمى الوظيفي المستهدف ومهاراتك الحالية.
        </p>
      </div>
    </div>
  );
};
