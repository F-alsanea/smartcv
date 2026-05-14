
import React, { useState, useMemo } from 'react';
import { CVData, TemplateType, ThemeConfig, Language, RewriteAlternatives } from '../types';
import { rewriteContent } from '../services/geminiService';

interface CVPreviewProps {
  data: CVData;
  template: TemplateType;
  theme: ThemeConfig;
  lang: Language;
  activated: boolean;
  onUpdate?: (updatedData: CVData) => void;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data, template, theme, lang, activated, onUpdate }) => {
  const [eyeComfort, setEyeComfort] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rewritingField, setRewritingField] = useState<string | null>(null);
  const [rewriteOptions, setRewriteOptions] = useState<RewriteAlternatives | null>(null);
  const [loadingRewrite, setLoadingRewrite] = useState(false);

  const isRtl = lang === Language.AR;
  const directionClass = isRtl ? 'rtl' : 'ltr';
  const textAlignClass = isRtl ? 'text-right' : 'text-left';

  const autoFontSize = useMemo(() => {
    const totalLength = (data.summary?.length || 0) + (data.experience?.length * 200 || 0);
    if (totalLength > 1500) return 'text-[9px]';
    return theme.fontSize === 'sm' ? 'text-[10px]' : theme.fontSize === 'lg' ? 'text-sm' : 'text-xs';
  }, [data, theme.fontSize]);

  const handleRewrite = async (text: string, context: string, fieldId: string) => {
    if (!text.trim()) return;
    setRewritingField(fieldId);
    setLoadingRewrite(true);
    setRewriteOptions(null);
    try {
      const result = await rewriteContent(text, context, lang);
      setRewriteOptions(result);
    } catch (e) {
      alert("AI Rewrite failed");
    } finally {
      setLoadingRewrite(false);
    }
  };

  const applyRewrite = (newText: string, fieldId: string) => {
    if (!onUpdate) return;
    const updated = JSON.parse(JSON.stringify(data)); // Deep copy
    if (fieldId === 'summary') updated.summary = newText;
    else if (fieldId.startsWith('exp_')) {
      const parts = fieldId.split('_');
      const expIdx = parseInt(parts[1]);
      const achIdx = parseInt(parts[2]);
      updated.experience[expIdx].achievements[achIdx] = newText;
    }
    onUpdate(updated);
    setRewriteOptions(null);
    setRewritingField(null);
  };

  const updatePersonalInfo = (key: string, value: string) => {
    if (!onUpdate) return;
    onUpdate({
      ...data,
      personal_info: { ...data.personal_info, [key]: value }
    });
  };

  const renderSection = (type: string, overrideHeader?: string) => {
    const textColor = eyeComfort ? 'text-slate-300' : 'text-slate-700';
    const headingColor = theme.primaryColor;

    switch (type) {
      case 'summary':
        return (
          <section key="summary" className="mb-4 group/section relative">
            <div className="flex justify-between items-center border-b border-current pb-1 mb-2">
              <h3 style={{ color: headingColor }} className="text-sm font-black uppercase tracking-wider">
                {overrideHeader || (isRtl ? 'الملخص المهني' : 'Professional Summary')}
              </h3>
              {isEditing && (
                <button 
                  onClick={() => handleRewrite(data.summary, 'professional summary', 'summary')}
                  className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded opacity-0 group-hover/section:opacity-100 transition-opacity flex items-center gap-1 hover:bg-emerald-600 no-print"
                >
                  <i className={`fa-solid ${loadingRewrite && rewritingField === 'summary' ? 'fa-spinner fa-spin' : 'fa-sparkles'}`}></i>
                  {isRtl ? 'تحسين ذكي' : 'Smart Improve'}
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea 
                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded ${autoFontSize} leading-relaxed no-print`}
                value={data.summary}
                onChange={(e) => onUpdate?.({ ...data, summary: e.target.value })}
                rows={4}
              />
            ) : (
              <p className={`${autoFontSize} leading-relaxed ${textColor} text-justify whitespace-pre-wrap`}>{data.summary}</p>
            )}
            {rewritingField === 'summary' && rewriteOptions && (
              <div className="mt-2 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900 no-print animate-in slide-in-from-top duration-300 z-50 shadow-lg">
                <div className="flex justify-between mb-2">
                   <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase">{isRtl ? 'خيارات الصياغة البديلة:' : 'Professional Alternatives:'}</p>
                   <button onClick={() => setRewritingField(null)}><i className="fa-solid fa-xmark text-slate-400"></i></button>
                </div>
                <div className="space-y-2">
                  {rewriteOptions.alternatives.map((alt, idx) => (
                    <button key={idx} onClick={() => applyRewrite(alt, 'summary')} className="w-full text-right p-3 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800 rounded-lg text-[10px] hover:border-emerald-500 transition-all font-medium text-slate-700 dark:text-slate-300">
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      case 'experience':
        return (
          <section key="experience" className="mb-4">
            <h3 style={{ color: headingColor }} className="text-sm font-black border-b border-current pb-1 mb-3 uppercase tracking-wider">
              {overrideHeader || (isRtl ? 'الخبرات العملية' : 'Work Experience')}
            </h3>
            <div className="space-y-3">
              {data.experience?.map((exp, expIdx) => (
                <div key={expIdx} className="relative group/exp">
                  <div className="flex justify-between items-baseline mb-1">
                    {isEditing ? (
                      <input className="font-black text-xs bg-slate-50 dark:bg-slate-900 border p-1 rounded no-print w-2/3" value={exp.position} onChange={e => {
                        const newExp = [...data.experience];
                        newExp[expIdx].position = e.target.value;
                        onUpdate?.({ ...data, experience: newExp });
                      }} />
                    ) : (
                      <h4 className={`font-black ${eyeComfort ? 'text-white' : 'text-slate-900'} text-xs`}>{exp.position}</h4>
                    )}
                    <span className="text-[9px] text-slate-500 font-bold">{exp.duration}</span>
                  </div>
                  <p className="text-[10px] italic mb-1" style={{ color: headingColor }}>{exp.company}</p>
                  <ul className={`list-disc list-inside space-y-1 ${textColor} ${autoFontSize}`}>
                    {exp.achievements?.map((item, achIdx) => item.trim() && (
                      <li key={achIdx} className="group/ach relative pr-6">
                        {isEditing ? (
                          <div className="flex flex-col gap-1 w-full mt-1 mb-2">
                            <textarea 
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded text-[10px] no-print"
                              value={item}
                              onChange={e => {
                                const newExp = JSON.parse(JSON.stringify(data.experience));
                                newExp[expIdx].achievements[achIdx] = e.target.value;
                                onUpdate?.({ ...data, experience: newExp });
                              }}
                              rows={2}
                            />
                            <div className="flex justify-between items-center">
                              <button 
                                onClick={() => handleRewrite(item, 'work achievement', `exp_${expIdx}_${achIdx}`)}
                                className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded opacity-0 group-hover/ach:opacity-100 transition-opacity flex items-center gap-1 hover:bg-emerald-600 no-print"
                              >
                                <i className={`fa-solid ${loadingRewrite && rewritingField === `exp_${expIdx}_${achIdx}` ? 'fa-spinner fa-spin' : 'fa-sparkles'}`}></i>
                                {isRtl ? 'تحسين ذكي' : 'Improve'}
                              </button>
                              <button 
                                onClick={() => {
                                  const newExp = JSON.parse(JSON.stringify(data.experience));
                                  newExp[expIdx].achievements = newExp[expIdx].achievements.filter((_:any, i:number) => i !== achIdx);
                                  onUpdate?.({ ...data, experience: newExp });
                                }}
                                className="text-[8px] text-red-400 hover:text-red-500 opacity-0 group-hover/ach:opacity-100 transition-opacity no-print"
                              >
                                {isRtl ? 'حذف' : 'Delete'}
                              </button>
                            </div>
                            {rewritingField === `exp_${expIdx}_${achIdx}` && rewriteOptions && (
                              <div className="mt-1 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900 no-print z-50 shadow-md">
                                {rewriteOptions.alternatives.map((alt, idx) => (
                                  <button key={idx} onClick={() => applyRewrite(alt, `exp_${expIdx}_${achIdx}`)} className="w-full text-right p-2 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800 rounded text-[9px] mb-1 hover:border-emerald-500 transition-all font-medium">
                                    {alt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="leading-relaxed">{item}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return (
          <section key="education" className="mb-4">
            <h3 style={{ color: headingColor }} className="text-sm font-black border-b border-current pb-1 mb-2 uppercase tracking-wider">
              {overrideHeader || (isRtl ? 'التعليم' : 'Education')}
            </h3>
            <div className="space-y-2">
              {data.education?.map((edu, idx) => (
                <div key={idx}>
                  <h4 className={`font-black ${eyeComfort ? 'text-white' : 'text-slate-900'} text-[11px]`}>{edu.degree}</h4>
                  <p className={`text-[9px] ${eyeComfort ? 'text-slate-400' : 'text-slate-600'}`}>{edu.institution} | {edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return (
          <section key="skills" className="mb-4">
            <h3 style={{ color: headingColor }} className="text-sm font-black border-b border-current pb-1 mb-2 uppercase tracking-wider">
              {overrideHeader || (isRtl ? 'المهارات' : 'Skills')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.skills?.map((skill, idx) => skill.trim() && (
                <span key={idx} className={`px-2 py-0.5 ${eyeComfort ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'} rounded text-[9px] font-bold border border-slate-200`}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        );
      default: return null;
    }
  };

  const BrandingFooter = () => (
    <div className="mt-auto pt-8 border-t border-slate-100 text-[9px] text-slate-400 flex justify-between items-center no-print print:hidden">
      <span>{isRtl ? 'المحرك السيادي Sira-AI' : 'Sovereign Hub: Sira-AI'}</span>
      <span className="font-bold opacity-30">{isRtl ? 'بإشراف: فيصل السني' : 'By: Faisal Alsanea'}</span>
    </div>
  );

  const SmartQR = () => (
    <div className={`mt-4 border p-2 rounded-lg inline-flex flex-col items-center gap-1 ${eyeComfort ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
       <div className="w-14 h-14 bg-slate-200 flex items-center justify-center text-slate-400 text-xl rounded">
          <i className="fa-solid fa-qrcode"></i>
       </div>
       <span className="text-[5px] font-black uppercase text-slate-400 tracking-tighter">Verified Sira-AI Profile</span>
    </div>
  );

  const templates = {
    [TemplateType.CLASSICAL]: () => (
      <div className={`p-6 md:p-10 min-h-[1123px] flex flex-col ${textAlignClass} bg-white print:p-4 print:m-0`}>
        <div className={`border-b-4 border-slate-900 pb-4 mb-6 text-center`}>
          {isEditing ? (
            <input 
              className="text-3xl font-black text-slate-900 mb-1 uppercase tracking-tighter w-full text-center border-b border-dashed no-print bg-slate-50 rounded"
              value={data.personal_info.full_name}
              onChange={e => updatePersonalInfo('full_name', e.target.value)}
            />
          ) : (
            <h2 className={`text-3xl font-black text-slate-900 mb-1 uppercase tracking-tighter`}>{data.personal_info?.full_name || '...'}</h2>
          )}
          <div className={`flex justify-center gap-4 text-[9px] text-slate-600 font-bold`}>
            <span>{data.personal_info?.email}</span>
            <span>•</span>
            <span>{data.personal_info?.phone}</span>
            <span>•</span>
            <span>{data.personal_info?.location}</span>
          </div>
        </div>
        <div className="flex-grow">
          {theme.sectionOrder.map(s => renderSection(s))}
        </div>
        {theme.showQR && <SmartQR />}
        <BrandingFooter />
      </div>
    ),
    [TemplateType.MODERN]: () => (
      <div className={`flex flex-col md:flex-row min-h-[1123px] ${directionClass} bg-white print:m-0`}>
        <div className="w-full md:w-[30%] bg-slate-900 text-white p-6 flex flex-col space-y-6 print:bg-slate-900 print:text-white">
          <div className="text-center">
             <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4 border-2 border-slate-700 flex items-center justify-center">
                <i className="fa-solid fa-user text-2xl"></i>
             </div>
             <h2 className="text-lg font-black">{data.personal_info?.full_name || '...'}</h2>
             <p className="text-[8px] font-bold tracking-widest text-emerald-400 uppercase">{data.personal_info?.target_job}</p>
          </div>
          <div className="flex-grow space-y-6">
             {theme.sectionOrder.filter(s => s === 'skills' || s === 'education').map(s => renderSection(s))}
             {theme.showQR && <SmartQR />}
          </div>
        </div>
        <div className={`flex-1 p-6 md:p-10 flex flex-col ${eyeComfort ? 'bg-slate-950' : 'bg-white'} ${textAlignClass} print:bg-white print:p-8`}>
          <div className="flex-grow">
            {theme.sectionOrder.filter(s => s === 'summary' || s === 'experience').map(s => renderSection(s))}
          </div>
          <BrandingFooter />
        </div>
      </div>
    ),
    [TemplateType.TECH]: () => (
      <div className={`p-6 md:p-10 min-h-[1123px] flex flex-col ${textAlignClass} bg-slate-950 text-emerald-400 font-mono relative overflow-hidden print:bg-white print:text-slate-900 print:p-8`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none print:hidden"></div>
        <div className="border-l-4 border-emerald-500 pl-6 mb-10 print:border-emerald-600">
          <h2 className="text-4xl font-black text-white print:text-slate-900">{data.personal_info?.full_name || '...'}</h2>
          <p className="text-emerald-500 uppercase tracking-widest text-sm print:text-emerald-700">{data.personal_info?.target_job}</p>
          <div className="text-[9px] text-slate-500 mt-2 print:text-slate-500 font-bold">
            {data.personal_info?.email} // {data.personal_info?.phone} // {data.personal_info?.location}
          </div>
        </div>
        <div className="flex-grow grid grid-cols-1 gap-8">
          {theme.sectionOrder.map(s => renderSection(s))}
        </div>
        {theme.showQR && <SmartQR />}
        <BrandingFooter />
      </div>
    ),
    [TemplateType.EXECUTIVE]: () => (
      <div className={`p-6 md:p-12 min-h-[1123px] flex flex-col ${textAlignClass} font-serif bg-white border-4 md:border-[12px] border-slate-50 print:border-none print:p-8 print:m-0`}>
        <div className="text-center mb-10 border-b border-slate-300 pb-6">
          <h2 className="text-3xl font-black text-slate-900 mb-1 uppercase tracking-widest">{data.personal_info?.full_name || '...'}</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">{data.personal_info?.target_job}</p>
          <div className="flex justify-center gap-6 text-[9px] text-slate-400 font-bold italic">
            <span>{data.personal_info?.email}</span>
            <span>•</span>
            <span>{data.personal_info?.phone}</span>
            <span>•</span>
            <span>{data.personal_info?.location}</span>
          </div>
        </div>
        <div className="flex-grow">
          {theme.sectionOrder.map(s => renderSection(s))}
        </div>
        {theme.showQR && <div className="text-center"><SmartQR /></div>}
        <BrandingFooter />
      </div>
    ),
    [TemplateType.NEOM]: () => (
      <div className={`p-6 md:p-10 min-h-[1123px] flex flex-col ${eyeComfort ? 'bg-slate-950' : 'bg-slate-50'} ${textAlignClass} print:bg-white print:p-4 print:m-0`}>
        <div className={`${eyeComfort ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} rounded-[24px] md:rounded-[32px] shadow-xl p-6 md:p-8 border mb-8 relative overflow-hidden print:shadow-none print:border-slate-200 print:rounded-none`}>
          <div className="absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full opacity-10 print:hidden" style={{ backgroundColor: theme.primaryColor }}></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
             <div>
               <h2 className={`text-2xl md:text-4xl font-black mb-1 ${eyeComfort ? 'text-white' : 'text-slate-900'} print:text-slate-900 tracking-tighter`}>{data.personal_info?.full_name || '...'}</h2>
               <div className="flex flex-wrap gap-2">
                <span className="text-[9px] font-black px-3 py-1 bg-slate-900 text-white rounded-full uppercase tracking-widest print:bg-slate-800 print:text-white">{data.personal_info?.target_job}</span>
                <span className="text-[10px] font-bold text-slate-400 self-center">{data.personal_info?.location}</span>
               </div>
             </div>
             <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-[10px] font-black shadow-inner print:hidden shrink-0">ATS SCORE: {data.ats_score}%</div>
          </div>
        </div>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
          {theme.sectionOrder.map(s => renderSection(s))}
        </div>
        {theme.showQR && <SmartQR />}
        <BrandingFooter />
      </div>
    )
  };

  return (
    <div className={`group relative mx-auto max-w-[800px] w-full animate-in fade-in duration-300`}>
      <div className="flex justify-between items-center mb-4 px-2 no-print flex-wrap gap-2">
        <div className="flex gap-2">
          <button 
            onClick={() => setEyeComfort(!eyeComfort)}
            className="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-slate-700 transition-all flex items-center gap-2 shadow-xl border border-white/5"
          >
            <i className={`fa-solid ${eyeComfort ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            {eyeComfort ? (isRtl ? 'وضع الطباعة' : 'Print Mode') : (isRtl ? 'رؤية في الظلام' : 'View in Dark')}
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 shadow-xl border border-white/5 ${isEditing ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            {isEditing ? (isRtl ? 'إنهاء التعديل' : 'Finish Edit') : (isRtl ? 'تعديل السيرة الذاتية' : 'Edit Resume')}
          </button>
        </div>
        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[8px] font-black border border-white/10 uppercase tracking-widest shadow-lg">
           Sira-AI Smart Protocol Enabled
        </div>
      </div>

      <div className={`${eyeComfort ? 'bg-slate-950 text-slate-300' : 'bg-white text-slate-900'} shadow-2xl overflow-hidden min-h-[1123px] relative border border-slate-200 dark:border-slate-800 ${directionClass} transition-all duration-300 print:shadow-none print:border-none print:m-0 print:p-0`}>
        {!activated && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex flex-col justify-center gap-32 backdrop-blur-[1px] print:hidden">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="text-slate-200/30 text-6xl font-black -rotate-45 whitespace-nowrap select-none w-full text-center uppercase tracking-[0.5em]">
                {isRtl ? 'نسخة معاينة - غير مفعلة' : 'DRAFT - NOT ACTIVATED'}
              </div>
            ))}
          </div>
        )}
        <div className={!activated ? 'blur-[0.5px] opacity-95 select-none print:opacity-100 print:blur-none' : ''}>
          {templates[template]()}
        </div>
      </div>
    </div>
  );
};
