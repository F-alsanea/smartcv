
import React, { useState } from 'react';
import { SearchFilters, CandidateProfile, Language } from '../types';
import { generateMockCandidates } from '../services/geminiService';
import { TRANSLATIONS, PAYMENT_INFO } from '../constants';

interface TalentScoutProps {
  onViewCandidate: (c: CandidateProfile) => void;
  onShortlist: (c: CandidateProfile) => void;
  onUnlock: (c: CandidateProfile) => void;
  shortlist: CandidateProfile[];
  unlockedIds: string[];
  lang: Language;
}

export const TalentScout: React.FC<TalentScoutProps> = ({ onViewCandidate, onShortlist, onUnlock, shortlist, unlockedIds, lang }) => {
  const t = lang === Language.AR ? TRANSLATIONS.ar : TRANSLATIONS.en;
  const isRtl = lang === Language.AR;
  const [filters, setFilters] = useState<SearchFilters & { neighborhood?: string }>({ 
    city: '', 
    experience_years: '', 
    skills: '', 
    language: '', 
    expected_salary: '',
    neighborhood: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CandidateProfile[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await generateMockCandidates(filters);
      setResults(data);
    } catch (e) {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* Side Filters Sidebar */}
      <aside className="lg:w-80 space-y-6 no-print">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800 sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 dark:text-white">
            <i className="fa-solid fa-filter text-emerald-500"></i>
            {isRtl ? 'فلترة الرادار' : 'Radar Filters'}
          </h3>
          <div className="space-y-5">
            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-500 uppercase px-2">{t.employer_filters_city}</label>
               <input className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-3 rounded-2xl dark:text-white outline-none focus:border-emerald-500 text-sm" placeholder="..." value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-500 uppercase px-2">{isRtl ? t.employer_filters_neighborhood : 'Neighborhood:'}</label>
               <input className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-3 rounded-2xl dark:text-white outline-none focus:border-emerald-500 text-sm" placeholder="..." value={filters.neighborhood} onChange={e => setFilters({...filters, neighborhood: e.target.value})} />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-500 uppercase px-2">{isRtl ? t.employer_filters_experience : 'Experience:'}</label>
               <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-3 rounded-2xl dark:text-white outline-none focus:border-emerald-500 text-sm" placeholder="0" value={filters.experience_years} onChange={e => setFilters({...filters, experience_years: e.target.value})} />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-500 uppercase px-2">{t.employer_filters_salary}</label>
               <input className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-3 rounded-2xl dark:text-white outline-none focus:border-emerald-500 text-sm" placeholder="..." value={filters.expected_salary} onChange={e => setFilters({...filters, expected_salary: e.target.value})} />
            </div>
            <button onClick={handleSearch} disabled={loading} className="w-full py-4 mt-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl">
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-satellite-dish"></i>}
              {isRtl ? 'تحديث الرادار' : 'Update Radar'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Radar Results */}
      <div className="flex-1 space-y-8">
        <div className="bg-slate-900 dark:bg-black p-8 rounded-[40px] shadow-2xl border border-slate-800 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <i className="fa-solid fa-radar text-emerald-400"></i>
                {t.employer_search_title}
              </h3>
              <p className="text-slate-400 text-xs mt-1">{isRtl ? 'اكتشف أفضل الكفاءات المطابقة لمتطلباتك فوراً' : 'Discover the best talents matching your requirements instantly'}</p>
            </div>
            <div className="w-full md:w-96">
               <input className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-emerald-500 text-sm" placeholder={t.employer_filters_skills} value={filters.skills} onChange={e => setFilters({...filters, skills: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {results.map(candidate => {
            const isUnlocked = unlockedIds.includes(candidate.id);
            return (
              <div key={candidate.id} className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden group hover:border-emerald-500 transition-all relative">
                {/* Scorecard Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 border-b border-slate-100 dark:border-slate-800">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-xl">
                          {!isUnlocked ? (isRtl ? 'مرشح مجهول (Ghost)' : 'Ghost Candidate') : (candidate.personal_info?.full_name || '...')}
                        </h4>
                        <p className="text-emerald-600 font-bold text-sm">{candidate.personal_info?.target_job || (isRtl ? 'مسمى وظيفي' : 'Target Position')}</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black border border-emerald-100 dark:border-emerald-900 flex flex-col items-center">
                        <span className="text-lg">{candidate.ai_fit_score || 0}%</span>
                        <span className="text-[7px] uppercase tracking-widest">{t.candidate_card_fit}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                     <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">{candidate.personal_info?.location || '...'}</span>
                     {candidate.languages && candidate.languages.slice(0, 2).map((l, i) => (
                       <span key={i} className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">{l}</span>
                     ))}
                   </div>
                </div>
                
                <div className="p-8 space-y-6">
                  {/* AI Strengths */}
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <i className="fa-solid fa-sparkles text-emerald-500"></i>
                       {isRtl ? t.candidate_card_strengths : 'Top AI Insights:'}
                     </p>
                     <ul className="space-y-2">
                       {candidate.top_achievements?.slice(0, 3).map((ach, i) => (
                         <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <i className="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i>
                            {ach}
                         </li>
                       ))}
                     </ul>
                  </div>

                  <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{t.candidate_card_personality}</p>
                     <p className="text-xs text-indigo-700 dark:text-indigo-300 italic leading-relaxed">"{candidate.personality_eval || '...'}"</p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-2">
                     <span className="text-slate-400 uppercase tracking-tighter">{isRtl ? 'الراتب المتوقع:' : 'Expected Salary:'}</span>
                     <span className="text-slate-900 dark:text-white font-black">{candidate.expected_salary || '...'}</span>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4">
                    {isUnlocked ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                           <a href={`https://wa.me/${candidate.personal_info?.phone?.replace(/\+/g, '')}`} target="_blank" className="bg-emerald-600 text-white py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20">
                             <i className="fa-brands fa-whatsapp text-lg"></i> {isRtl ? t.employer_contact_whatsapp : 'WhatsApp'}
                           </a>
                           <a href={`tel:${candidate.personal_info?.phone}`} className="bg-blue-600 text-white py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
                             <i className="fa-solid fa-phone text-lg"></i> {isRtl ? t.employer_contact_call : 'Call'}
                           </a>
                        </div>
                        <button onClick={() => onViewCandidate(candidate)} className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-2xl text-xs font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                           <i className="fa-solid fa-file-pdf"></i>
                           {isRtl ? 'تحميل السيرة الكاملة (White Label)' : 'Download Full CV (White Label)'}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => onUnlock(candidate)} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-5 rounded-[24px] text-sm font-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-amber-500/20">
                        <i className="fa-solid fa-lock-open"></i>
                        {isRtl ? t.employer_unlock_btn : 'Unlock Contact Info (20 SAR)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {results.length === 0 && !loading && (
          <div className="py-32 text-center space-y-6">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[35px] flex items-center justify-center mx-auto text-slate-300 shadow-inner">
                <i className="fa-solid fa-satellite-dish text-4xl animate-pulse"></i>
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-bold text-xl">{isRtl ? 'ابدأ البحث على الرادار لاكتشاف أفضل الكفاءات' : 'Start radar search to discover the best talents'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
