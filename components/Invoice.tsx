
import React from 'react';
import { InvoiceData, Language } from '../types';
import { TRANSLATIONS, PAYMENT_INFO } from '../constants';

interface InvoiceProps {
  data: InvoiceData;
  lang: Language;
}

export const Invoice: React.FC<InvoiceProps> = ({ data, lang }) => {
  const t = lang === Language.AR ? TRANSLATIONS.ar : TRANSLATIONS.en;
  const isRtl = lang === Language.AR;

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[40px] p-10 shadow-3xl max-w-2xl mx-auto animate-in zoom-in duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg">
            <i className="fa-solid fa-file-invoice-dollar text-2xl text-white"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t.invoice_title}</h3>
            <p className="text-emerald-500 text-xs font-bold tracking-widest uppercase">{t.platform_name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t.invoice_ref}</p>
          <p className="text-slate-900 dark:text-white font-mono font-black">{data.id}</p>
        </div>
      </div>

      <div className="space-y-6 mb-12">
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-slate-500 font-bold">{t.invoice_date}</span>
          <span className="text-slate-900 dark:text-white font-black">{data.date}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-slate-500 font-bold">{isRtl ? 'العميل:' : 'Customer:'}</span>
          <span className="text-slate-900 dark:text-white font-black">{data.userName}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-slate-500 font-bold">{t.invoice_service}</span>
          <span className="text-slate-900 dark:text-white font-black">{data.service}</span>
        </div>
        <div className="flex justify-between pt-4">
          <span className="text-slate-500 font-black text-xl">{isRtl ? 'الإجمالي:' : 'Total:'}</span>
          <span className="text-emerald-600 dark:text-emerald-400 text-2xl font-black">{data.amount}</span>
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900 flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-emerald-500 text-xl"></i>
          <span className="text-emerald-800 dark:text-emerald-400 font-black uppercase tracking-widest">{t.invoice_status} {isRtl ? 'تم الدفع' : 'PAID'}</span>
        </div>
        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase">Gateway: Digital Fast Pay</span>
      </div>

      <div className="text-center border-t border-slate-100 dark:border-slate-800 pt-8 space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {isRtl ? 'بإشراف: فيصل السني' : 'By: Faisal Alsanea'}
        </p>
        <button 
          onClick={() => window.print()}
          className="w-full bg-slate-900 dark:bg-slate-700 hover:bg-black text-white py-4 rounded-3xl font-black text-xs shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-download"></i>
          {t.invoice_download}
        </button>
      </div>
    </div>
  );
};
