
import React, { useState } from 'react';
import { CVData, WizardStep, Language } from '../types';
import { suggestFieldContent } from '../services/geminiService';

interface EditorWizardProps {
  data: CVData;
  onChange: (data: Partial<CVData>) => void;
  step: WizardStep;
  onNext: () => void;
  onPrev: () => void;
  lang: Language;
}

export const EditorWizard: React.FC<EditorWizardProps> = ({ data, onChange, step, onNext, onPrev, lang }) => {
  const isRtl = lang === Language.AR;
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const handleAIWrite = async (field: string) => {
    setLoadingField(field);
    try {
      const suggestion = await suggestFieldContent(field, data, lang);
      if (field === 'summary') onChange({ summary: suggestion });
      else if (field.startsWith('exp_')) {
        const idx = parseInt(field.split('_')[1]);
        const newExp = [...(data.experience || [])];
        if (newExp[idx]) {
          newExp[idx].achievements = suggestion.split('\n').filter(s => s.trim() !== '');
          onChange({ experience: newExp });
        }
      }
    } catch (e) {
      alert("AI suggestion failed.");
    } finally {
      setLoadingField(null);
    }
  };

  const getProgress = () => {
    switch(step) {
      case WizardStep.PERSONAL: return 20;
      case WizardStep.EXPERIENCE: return 40;
      case WizardStep.EDUCATION: return 60;
      case WizardStep.SKILLS: return 80;
      case WizardStep.PREVIEW: return 100;
      default: return 0;
    }
  };

  const renderPersonal = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest px-2">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
          <input 
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white"
            value={data?.personal_info?.full_name || ''}
            placeholder={isRtl ? 'أدخل اسمك الكامل' : 'Enter your full name'}
            onChange={e => onChange({ personal_info: { ...data.personal_info, full_name: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest px-2">{isRtl ? 'المسمى الوظيفي المستهدف' : 'Target Job Title'}</label>
          <input 
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white"
            value={data?.personal_info?.target_job || ''}
            placeholder={isRtl ? 'مثال: مدير مشاريع' : 'e.g. Project Manager'}
            onChange={e => onChange({ personal_info: { ...data.personal_info, target_job: e.target.value } })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center px-2">
          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{isRtl ? 'الملخص المهني' : 'Professional Summary'}</label>
          <button 
            type="button"
            onClick={() => handleAIWrite('summary')}
            className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-sm border border-emerald-100 dark:border-emerald-900"
          >
            {loadingField === 'summary' ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
            {isRtl ? 'اكتب لي' : 'Write for me'}
          </button>
        </div>
        <textarea 
          className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 outline-none h-32 transition-all dark:text-white leading-relaxed"
          value={data?.summary || ''}
          placeholder={isRtl ? 'نبذة مختصرة عن إنجازاتك...' : 'A brief overview of your achievements...'}
          onChange={e => onChange({ summary: e.target.value })}
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      {(data?.experience || []).map((exp, idx) => (
        <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 space-y-6 relative group shadow-sm transition-all hover:border-emerald-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder={isRtl ? 'الشركة' : 'Company'}
              className="p-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 dark:text-white"
              value={exp.company}
              onChange={e => {
                const newExp = [...data.experience];
                newExp[idx].company = e.target.value;
                onChange({ experience: newExp });
              }}
            />
            <input 
              placeholder={isRtl ? 'المسمى الوظيفي' : 'Job Title'}
              className="p-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 dark:text-white"
              value={exp.position}
              onChange={e => {
                const newExp = [...data.experience];
                newExp[idx].position = e.target.value;
                onChange({ experience: newExp });
              }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isRtl ? 'الإنجازات المهنية' : 'Key Achievements'}</label>
              <button 
                type="button"
                onClick={() => handleAIWrite(`exp_${idx}`)}
                className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg flex items-center gap-1.5"
              >
                {loadingField === `exp_${idx}` ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
                {isRtl ? 'صياغة ذكية' : 'AI Draft'}
              </button>
            </div>
            <textarea 
              placeholder={isRtl ? 'واحد في كل سطر...' : 'One per line...'}
              className="w-full p-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 h-24 dark:text-white text-sm"
              value={exp.achievements?.join('\n') || ''}
              onChange={e => {
                const newExp = [...data.experience];
                newExp[idx].achievements = e.target.value.split('\n');
                onChange({ experience: newExp });
              }}
            />
          </div>
          <button 
            type="button"
            onClick={() => {
              const newExp = data.experience.filter((_, i) => i !== idx);
              onChange({ experience: newExp });
            }}
            className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-95"
          >
            <i className="fa-solid fa-trash-can text-sm"></i>
          </button>
        </div>
      ))}
      <button 
        type="button"
        onClick={() => onChange({ experience: [...(data.experience || []), { company: '', position: '', duration: '', achievements: [] }] })}
        className="w-full py-6 border-4 border-dashed border-emerald-100 dark:border-emerald-900 rounded-[32px] text-emerald-600 font-black hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all flex items-center justify-center gap-3 group"
      >
        <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
          <i className="fa-solid fa-plus"></i>
        </div>
        {isRtl ? 'إضافة خبرة عملية جديدة' : 'Add New Work Experience'}
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      {(data?.education || []).map((edu, idx) => (
        <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 space-y-4 relative group shadow-sm transition-all hover:border-emerald-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder={isRtl ? 'المؤسسة التعليمية' : 'Institution'}
              className="p-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 dark:text-white"
              value={edu.institution}
              onChange={e => {
                const newEdu = [...data.education];
                newEdu[idx].institution = e.target.value;
                onChange({ education: newEdu });
              }}
            />
            <input 
              placeholder={isRtl ? 'الدرجة العلمية' : 'Degree'}
              className="p-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 dark:text-white"
              value={edu.degree}
              onChange={e => {
                const newEdu = [...data.education];
                newEdu[idx].degree = e.target.value;
                onChange({ education: newEdu });
              }}
            />
          </div>
          <button 
            type="button"
            onClick={() => {
              const newEdu = data.education.filter((_, i) => i !== idx);
              onChange({ education: newEdu });
            }}
            className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
          >
            <i className="fa-solid fa-trash-can text-sm"></i>
          </button>
        </div>
      ))}
      <button 
        type="button"
        onClick={() => onChange({ education: [...(data.education || []), { institution: '', degree: '', year: '' }] })}
        className="w-full py-6 border-4 border-dashed border-emerald-100 dark:border-emerald-900 rounded-[32px] text-emerald-600 font-black hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all flex items-center justify-center gap-3 group"
      >
        <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
          <i className="fa-solid fa-plus"></i>
        </div>
        {isRtl ? 'إضافة مؤهل تعليمي' : 'Add Education Record'}
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="space-y-2">
        <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest px-2">{isRtl ? 'المهارات التقنية (افصل بفاصلة)' : 'Technical Skills (comma separated)'}</label>
        <input 
          className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 outline-none transition-all dark:text-white font-mono text-sm"
          value={data?.skills?.join(', ') || ''}
          placeholder="e.g. Project Management, Python, Strategic Planning"
          onChange={e => onChange({ skills: e.target.value.split(',').map(s => s.trim()) })}
        />
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900 flex items-center gap-4">
        <i className="fa-solid fa-lightbulb text-2xl text-emerald-500"></i>
        <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium leading-relaxed">
          {isRtl ? 'أضف مهارات ذات صلة برؤية 2026 مثل "الاستدامة" أو "الذكاء الاصطناعي" لرفع النسبة.' : 'Add skills relevant to Vision 2026 like "Sustainability" or "AI" to boost your score.'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all max-w-4xl mx-auto">
      {/* Dynamic Progress Header */}
      <div className="bg-slate-900 dark:bg-black p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 w-full md:w-auto">
          <h3 className="text-3xl font-black mb-1">
            {step === WizardStep.PERSONAL ? (isRtl ? 'المحطة الأولى: بياناتي' : 'Step 1: Personal') :
             step === WizardStep.EXPERIENCE ? (isRtl ? 'المحطة الثانية: خبراتي' : 'Step 2: Experience') :
             step === WizardStep.EDUCATION ? (isRtl ? 'المحطة الثالثة: تعليمي' : 'Step 3: Education') :
             (isRtl ? 'المحطة الأخيرة: مهاراتي' : 'Final Step: Skills')}
          </h3>
          <p className="text-slate-400 text-sm">{isRtl ? 'قم بتعبئة بياناتك بدقة لتحقيق المعيار الذهبي للـ ATS' : 'Fill your data accurately to reach the ATS Gold Standard'}</p>
        </div>
        
        {/* Live Quality Dial */}
        <div className="relative z-10 flex items-center gap-6 bg-white/5 p-4 rounded-3xl border border-white/10 w-full md:w-auto">
           <div className="text-center">
              <div className="text-4xl font-black text-emerald-400">{data?.ats_score || 0}%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRtl ? 'قوة السيرة' : 'CV Score'}</div>
           </div>
           <div className="h-12 w-px bg-white/10 hidden md:block"></div>
           <div className="flex flex-col justify-center flex-1 md:flex-none">
              <div className="h-2 w-full md:w-32 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${getProgress()}%` }}></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">{isRtl ? 'المسار المهني' : 'Career Progress'}</span>
           </div>
        </div>
      </div>

      <div className="p-10">
        <div className="min-h-[400px]">
          {step === WizardStep.PERSONAL && renderPersonal()}
          {step === WizardStep.EXPERIENCE && renderExperience()}
          {step === WizardStep.EDUCATION && renderEducation()}
          {step === WizardStep.SKILLS && renderSkills()}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 mt-10 border-t border-slate-100 dark:border-slate-800 gap-6">
          <button 
            type="button"
            onClick={onPrev}
            className="px-10 py-4 text-slate-500 dark:text-slate-400 font-black hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-3 group"
          >
            <i className={`fa-solid ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'} group-hover:px-2 transition-all`}></i>
            {isRtl ? 'الرجوع للمحطة السابقة' : 'Previous Step'}
          </button>
          
          <button 
            type="button"
            onClick={onNext}
            className="w-full md:w-auto bg-slate-900 dark:bg-emerald-600 text-white font-black px-16 py-5 rounded-[24px] shadow-2xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            {isRtl ? 'الانتقال للمحطة التالية' : 'Continue to Next Step'}
            <i className={`fa-solid ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'} group-hover:px-2 transition-all`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};
