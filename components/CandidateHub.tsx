
import React, { useState } from 'react';
import { magicExtractCV } from '../services/geminiService';
import { Language, CVData } from '../types';

interface CandidateHubProps {
  onStartFresh: () => void;
  onStartChat: () => void;
  onExtracted: (data: CVData) => void;
  lang: Language;
}

export const CandidateHub: React.FC<CandidateHubProps> = ({ onStartFresh, onStartChat, onExtracted, lang }) => {
  const [loading, setLoading] = useState(false);
  const isRtl = lang === Language.AR;

  const handleMagicExtract = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = reader.result as string;
            const extracted = await magicExtractCV(base64, lang);
            onExtracted(extracted);
          };
          reader.readAsDataURL(file);
        } catch (e) {
          alert("Smart Reconstruction failed. Try manual input.");
        } finally {
          setLoading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in zoom-in duration-700">
      <div className="text-center space-y-6">
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
          {isRtl ? 'كيف ترغب في بناء مستقبلك؟' : 'Ready to Build Your Future?'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-2xl max-w-3xl mx-auto">
          {isRtl ? 'اختر الطريقة الأكثر ذكاءً للوصول للمعايير العالمية 2026' : 'Select the smartest path to global 2026 standards'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Magic Extract */}
        <button 
          onClick={handleMagicExtract}
          disabled={loading}
          className="group relative p-12 bg-emerald-600 rounded-[60px] shadow-3xl hover:bg-emerald-700 transition-all text-start overflow-hidden border-4 border-transparent hover:border-emerald-400 active:scale-95"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px]"></div>
          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-white text-4xl group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-xl">
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            </div>
            <div className="text-white">
              <h3 className="text-3xl font-black mb-3">{isRtl ? 'التنقيب الذكي' : 'Smart Reconstruct'}</h3>
              <p className="text-emerald-50 text-base leading-relaxed opacity-90">
                {isRtl ? 'ارفع سيرتك القديمة وسنقوم بإعادة هندستها رقمياً فوراً.' : 'Upload your old CV and we\'ll digitally re-engineer it instantly.'}
              </p>
            </div>
          </div>
        </button>

        {/* Build with Chat */}
        <button 
          onClick={onStartChat}
          className="group relative p-12 bg-indigo-600 rounded-[60px] shadow-3xl hover:bg-indigo-700 transition-all text-start overflow-hidden border-4 border-transparent hover:border-indigo-400 active:scale-95"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px]"></div>
          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-white text-4xl group-hover:scale-110 group-hover:-rotate-12 transition-transform shadow-xl">
              <i className="fa-solid fa-comments"></i>
            </div>
            <div className="text-white">
              <h3 className="text-3xl font-black mb-3">{isRtl ? 'البناء بالدردشة' : 'Build with Chat'}</h3>
              <p className="text-indigo-50 text-base leading-relaxed opacity-90">
                {isRtl ? 'أجب على أسئلة ذكية وسنقوم بصياغة مسارك المهني ببراعة.' : 'Answer smart questions and we\'ll expertly draft your career path.'}
              </p>
            </div>
          </div>
        </button>

        {/* Build Fresh */}
        <button 
          onClick={onStartFresh}
          className="group relative p-12 bg-white dark:bg-slate-900 rounded-[60px] shadow-3xl hover:border-emerald-500 border-4 border-slate-100 dark:border-slate-800 transition-all text-start overflow-hidden active:scale-95"
        >
          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-lg border border-slate-100 dark:border-slate-700">
              <i className="fa-solid fa-pen-nib"></i>
            </div>
            <div className="dark:text-white">
              <h3 className="text-3xl font-black mb-3 text-slate-900 dark:text-white">{isRtl ? 'بناء يدوي' : 'Manual Entry'}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                {isRtl ? 'تحكم كامل في كل تفصيل وبناء سيرتك خطوة بخطوة.' : 'Full control over every detail, building your CV step by step.'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 p-16 rounded-[60px] shadow-3xl text-center space-y-8 max-w-lg border-4 border-emerald-500">
            <div className="w-24 h-24 border-[10px] border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto shadow-2xl"></div>
            <div className="space-y-4">
              <h4 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Neural Mining...</h4>
              <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                {isRtl ? 'جاري التنقيب في بياناتك وإعادة هندستها رقمياً بمعايير 2026 السيادية...' : 'Mining your data and re-engineering it to 2026 Sovereign standards...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
