
import React, { useState } from 'react';
import { InterviewQuestion, InterviewReport } from '../types';
import { analyzeInterviewAnswers } from '../services/geminiService';

interface AIScreeningProps {
  questions: InterviewQuestion[];
  onComplete: (report: InterviewReport) => void;
  isEmployer?: boolean;
  report?: InterviewReport;
}

export const AIScreening: React.FC<AIScreeningProps> = ({ questions, onComplete, isEmployer, report }) => {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await analyzeInterviewAnswers(questions, answers);
      onComplete(res);
    } catch (e) {
      alert("خطأ في تحليل الإجابات");
    } finally {
      setLoading(false);
    }
  };

  if (isEmployer && report) {
    return (
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <i className="fa-solid fa-chart-pie text-emerald-400"></i>
          تقرير الذكاء للمقابلة (Intelligence Report)
        </h3>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-400">{report.honesty}%</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">الصدق</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-blue-400">{report.technical_depth}%</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">العمق التقني</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-purple-400">{report.tact}%</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">اللباقة</div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <p className="text-sm leading-relaxed italic">"{report.summary}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <i className="fa-solid fa-robot text-emerald-600"></i>
        المقابلة النصية الفورية (AI Screening)
      </h3>
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-2">
            <label className="text-sm font-bold text-slate-700">{idx + 1}. {q.question}</label>
            <textarea
              className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-24 text-sm"
              placeholder="اكتب إجابتك التقنية هنا..."
              value={answers[idx]}
              onChange={e => {
                const newAnswers = [...answers];
                newAnswers[idx] = e.target.value;
                setAnswers(newAnswers);
              }}
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={loading || answers.some(a => !a.trim())}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
          إرسال الإجابات للتحليل
        </button>
      </div>
    </div>
  );
};
