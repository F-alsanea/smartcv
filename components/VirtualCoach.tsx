
import React, { useState } from 'react';
import { InterviewAnalysis } from '../types';
import { analyzeSelfIntro } from '../services/geminiService';

export const VirtualCoach: React.FC<{ targetJob: string }> = ({ targetJob }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeSelfIntro(text, targetJob);
      setResult(data);
    } catch (e) {
      alert('خطأ في تحليل النص');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800 overflow-hidden font-ar">
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]"></div>
        <h3 className="text-2xl font-black flex items-center gap-3 relative z-10">
          <i className="fa-solid fa-user-graduate text-emerald-500"></i>
          المدرب الافتراضي (Virtual Coach)
        </h3>
        <p className="text-slate-400 text-xs mt-2 font-bold opacity-80 relative z-10 uppercase tracking-widest">حلل نبرتك وذكاءك العاطفي قبل المقابلة</p>
      </div>
      <div className="p-10 space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest block px-2">اكتب أو سجل نص تعريفك بنفسك (Self-Intro):</label>
          <textarea
            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl focus:border-emerald-500 outline-none h-40 text-sm leading-relaxed dark:text-white"
            placeholder="مثال: أنا مبرمج بخبرة 5 سنوات في تطوير تطبيقات الويب..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl hover:bg-emerald-700 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
            بناء تحليل عصبى فوراً
          </button>
        </div>

        {result && (
          <div className="mt-8 space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'الثقة', score: result.confidence_score, color: 'bg-emerald-500' },
                { label: 'الكلمات المفتاحية', score: result.keywords_score, color: 'bg-blue-500' },
                { label: 'الذكاء العاطفي', score: result.eq_score, color: 'bg-purple-500' },
              ].map((m, i) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase">{m.label}</div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color}`} style={{ width: `${m.score}%` }}></div>
                  </div>
                  <div className="text-sm font-black mt-1">{m.score}%</div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2">تقرير المدرب:</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{result.feedback}</p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
              <h4 className="text-emerald-800 font-bold mb-4 flex items-center gap-2 text-sm">
                <i className="fa-solid fa-lightbulb"></i>
                استخدم هذه الجمل البديلة لتحسين الانطباع:
              </h4>
              <div className="space-y-3">
                {result.suggested_phrases.map((phrase, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-200 text-xs text-slate-700 italic">
                    "{phrase}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
