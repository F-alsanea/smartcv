
import React, { useState } from 'react';
import { CVData, JobMatchResult } from '../types';
import { analyzeJobMatch } from '../services/geminiService';

export const JobMatcher: React.FC<{ cv: CVData }> = ({ cv }) => {
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const handleMatch = async () => {
    if (!jobDesc.trim()) return;
    setLoading(true);
    try {
      const matchData = await analyzeJobMatch(cv, jobDesc);
      setResult(matchData);
    } catch (e) {
      alert('Error during neural matching');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden group">
      <div className="bg-slate-900 dark:bg-black p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
        <h3 className="text-2xl font-black flex items-center gap-3 relative z-10">
          <i className="fa-solid fa-magnifying-glass-chart text-emerald-400"></i>
          ميزة التوافق الوظيفي (Neural Matcher)
        </h3>
        <p className="text-slate-400 text-sm mt-2 relative z-10">قارن سيرتك مع وصف الوظيفة لرفع فرص القبول بمعايير 2026</p>
      </div>

      <div className="p-10 space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Job Description / Link Text</label>
          <textarea
            className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 outline-none h-40 text-sm dark:text-white transition-all shadow-inner"
            placeholder="Paste the job description or requirements here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          ></textarea>
          <button
            onClick={handleMatch}
            disabled={loading || !jobDesc.trim()}
            className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-2xl shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin text-xl"></i> : <i className="fa-solid fa-bolt-lightning"></i>}
            تحليل التطابق والمطابقة العصبية
          </button>
        </div>

        {result && (
          <div className="mt-12 space-y-8 animate-in slide-in-from-bottom duration-700">
            <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[40px] border-2 border-slate-100 dark:border-slate-700">
              <div className={`w-32 h-32 rounded-full border-[8px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-2xl ${
                result.match_score > 75 ? 'border-emerald-500 text-emerald-600' : 'border-amber-500 text-amber-600'
              }`}>
                <span className="text-3xl font-black">{result.match_score}%</span>
                <span className="text-[8px] uppercase font-black">Match Score</span>
              </div>
              <div className="flex-1 text-center md:text-start">
                <h4 className="font-black text-slate-900 dark:text-white text-xl mb-2">الرأي الاستشاري للذكاء الاصطناعي</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">"{result.recommendations}"</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-[40px] border-2 border-amber-200 dark:border-amber-900">
              <h4 className="text-amber-800 dark:text-amber-400 font-black mb-6 flex items-center gap-3 text-sm">
                <i className="fa-solid fa-triangle-exclamation"></i>
                الفجوات المكتشفة (للوصول لنسبة 100%):
              </h4>
              <div className="flex flex-wrap gap-3">
                {result.missing_keywords.map((kw, idx) => (
                  <span key={idx} className="bg-white dark:bg-slate-900 px-5 py-2 rounded-2xl border-2 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-black shadow-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
