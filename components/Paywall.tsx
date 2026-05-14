
import React, { useState } from 'react';
import { PAYMENT_INFO, TRANSLATIONS } from '../constants';
import { UserRole, Language, InvoiceData } from '../types';

interface PaywallProps {
  role: UserRole;
  otp: string;
  userName: string;
  onActivate: (code: string, invoice?: InvoiceData) => void;
  lang: Language;
}

export const Paywall: React.FC<PaywallProps> = ({ role, otp, userName, onActivate, lang }) => {
  const [activeTab, setActiveTab] = useState<'digital' | 'bank'>('digital');
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  
  const t = lang === Language.AR ? TRANSLATIONS.ar : TRANSLATIONS.en;
  const isRtl = lang === Language.AR;
  
  const price = role === UserRole.SEEKER 
    ? (isRtl ? PAYMENT_INFO.seekerPrice.ar : PAYMENT_INFO.seekerPrice.en)
    : (isRtl ? PAYMENT_INFO.employerPrice.ar : PAYMENT_INFO.employerPrice.en);

  const handleDigitalPay = () => {
    if (!isAgreed) return;
    setIsProcessing(true);
    // Instant Digital Unlock Simulation
    setTimeout(() => {
      const invoice: InvoiceData = {
        id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString(isRtl ? 'ar-SA' : 'en-US'),
        amount: price,
        userName: userName || (isRtl ? 'عميل مقدر' : 'Valued Customer'),
        service: role === UserRole.SEEKER ? (isRtl ? 'تفعيل السيرة الذاتية - نسخة 2026' : 'CV Activation - 2026 Edition') : (isRtl ? 'باقة أصحاب الأعمال' : 'Employer Hub Access'),
        status: 'PAID'
      };
      setIsProcessing(false);
      onActivate("INSTANT_SUCCESS", invoice);
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-4xl overflow-hidden border border-slate-200/50 dark:border-slate-800 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
      <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/10 blur-[100px] pointer-events-none backdrop-blur-xl"></div>
        <div className="w-16 h-16 bg-emerald-500 text-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <i className="fa-solid fa-credit-card text-2xl"></i>
        </div>
        <h2 className="text-2xl font-black mb-1 tracking-tighter">{t.paywall_title}</h2>
        <p className="text-slate-400 text-xs opacity-70">{t.paywall_subtitle}</p>
        <div className="mt-4 inline-block bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
           <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">{t.paywall_otp} {otp}</span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8">
          <button onClick={() => setActiveTab('digital')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'digital' ? 'bg-white dark:bg-slate-700 shadow-xl text-emerald-600' : 'text-slate-500'}`}>
            <i className="fa-solid fa-bolt-lightning mr-2 ml-2"></i> {t.paywall_fast_pay}
          </button>
          <button onClick={() => setActiveTab('bank')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'bank' ? 'bg-white dark:bg-slate-700 shadow-xl text-emerald-600' : 'text-slate-500'}`}>
            <i className="fa-solid fa-building-columns mr-2 ml-2"></i> {t.paywall_bank_transfer}
          </button>
        </div>

        <div className="mb-6 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-emerald-500 cursor-pointer" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} />
            <span className={`text-xs font-bold leading-relaxed ${isAgreed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              {t.paywall_consent}
            </span>
          </label>
        </div>

        {activeTab === 'digital' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border flex flex-col items-center gap-1">
                <i className="fa-brands fa-apple text-2xl"></i>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Apple Pay</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border flex flex-col items-center gap-1">
                <i className="fa-solid fa-credit-card text-2xl text-blue-600"></i>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Mada / Visa</span>
              </div>
            </div>
            
            <button 
              onClick={handleDigitalPay}
              disabled={isProcessing || !isAgreed}
              className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-base ${isAgreed ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02] active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              {isProcessing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-lock-open"></i>}
              {t.paywall_instant_unlock} ({price})
            </button>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border-2 border-dashed">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold"><span className="text-slate-400">{t.paywall_bank}</span><span className="dark:text-white">{isRtl ? PAYMENT_INFO.bank.ar : PAYMENT_INFO.bank.en}</span></div>
                  <div className="flex justify-between font-bold"><span className="text-slate-400">{t.paywall_beneficiary}</span><span className="dark:text-white">{isRtl ? PAYMENT_INFO.owner.ar : PAYMENT_INFO.owner.en}</span></div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border mt-3 text-center font-mono font-black text-emerald-600 break-all select-all">{PAYMENT_INFO.iban}</div>
                </div>
             </div>
             <div className="space-y-2">
                <input type="text" placeholder={t.paywall_activation_code} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none focus:border-emerald-500 text-center font-black tracking-widest" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
                <button onClick={() => onActivate(code)} disabled={!isAgreed} className={`w-full font-black py-4 rounded-2xl transition-all ${isAgreed ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  {t.paywall_verify}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
