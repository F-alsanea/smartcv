
import React, { useEffect, useState } from 'react';
import { Language, ThemeMode } from '../types';
import { TRANSLATIONS, PAYMENT_INFO } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  onLangToggle: () => void;
  themeMode: ThemeMode;
  onThemeToggle: () => void;
  onNavClick?: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, lang, onLangToggle, themeMode, onThemeToggle, onNavClick }) => {
  const t = lang === Language.AR ? TRANSLATIONS.ar : TRANSLATIONS.en;
  const isRtl = lang === Language.AR;
  const isDark = themeMode === ThemeMode.DARK;
  
  const [showSupport, setShowSupport] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', name: '', phone: '', email: '', message: '' });

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === Language.AR ? 'ar' : 'en';
  }, [lang, isRtl]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending to falsanea@aol.com:", supportForm);
    setSupportSuccess(true);
    setTimeout(() => {
      setSupportSuccess(false);
      setShowSupport(false);
      setSupportForm({ subject: '', name: '', phone: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-ar">
      <header className="bg-slate-900/95 dark:bg-black/95 text-white shadow-xl py-4 lg:py-6 transition-all no-print sticky top-0 z-[100] backdrop-blur-xl">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavClick?.('home')}>
            <div className="bg-emerald-500 p-3 rounded-[18px] rotate-3 shadow-2xl shadow-emerald-500/20">
              <i className="fa-solid fa-bolt-lightning text-2xl"></i>
            </div>
            <div>
              <h1 className={`text-2xl font-black tracking-tighter ${!isRtl ? 'font-en' : ''}`}>
                {isRtl ? 'سيرتي الذكية' : 'Sira-AI'}
              </h1>
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                {t.tagline}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <nav className="hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <button onClick={() => onNavClick?.('about')} className="hover:text-emerald-400 transition-colors">{t.nav_about}</button>
              <button onClick={() => onNavClick?.('archive')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <i className="fa-solid fa-crown text-amber-500"></i> {t.nav_archive}
              </button>
              <button onClick={() => onNavClick?.('payment')} className="hover:text-emerald-400 transition-colors">{t.nav_payment}</button>
              <button onClick={() => onNavClick?.('general')} className="hover:text-emerald-400 transition-colors">{t.nav_terms}</button>
              <button onClick={() => setShowSupport(true)} className="hover:text-emerald-400 transition-colors">{t.nav_contact}</button>
            </nav>
            <div className="flex items-center gap-2">
              <button 
                onClick={onThemeToggle}
                className="bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 p-2 rounded-full text-white border border-slate-700 transition-all flex items-center justify-center w-10 h-10 shadow-inner"
              >
                {isDark ? <i className="fa-solid fa-sun text-yellow-400"></i> : <i className="fa-solid fa-moon text-slate-300"></i>}
              </button>
              <button 
                onClick={onLangToggle}
                className="bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 px-5 py-2.5 rounded-full text-[10px] font-black border border-slate-700 transition-all flex items-center gap-2 shadow-xl"
              >
                <i className="fa-solid fa-globe text-emerald-500"></i>
                {isRtl ? 'English' : 'العربية'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 dark:bg-black text-slate-400 py-16 text-center text-sm border-t border-slate-800 no-print">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex justify-center gap-10 text-slate-500">
            <a href={PAYMENT_INFO.linkedin} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin text-2xl hover:text-emerald-500 cursor-pointer transition-colors"></i></a>
            <i className="fa-brands fa-x-twitter text-2xl hover:text-emerald-500 cursor-pointer transition-colors"></i>
            <a href={`https://wa.me/${PAYMENT_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp text-2xl hover:text-emerald-500 cursor-pointer transition-colors"></i></a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <button onClick={() => onNavClick?.('terms')} className="hover:text-emerald-400 transition-colors">{t.legal_terms_title}</button>
            <button onClick={() => onNavClick?.('privacy')} className="hover:text-emerald-400 transition-colors">{t.legal_privacy_title}</button>
            <button onClick={() => onNavClick?.('liability')} className="hover:text-emerald-400 transition-colors">{t.legal_liability_title}</button>
          </div>

          <div className="space-y-2">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
               {isRtl ? "المحرك السيادي لتمكين الكفاءات" : "Sovereign Engine for Talent Empowerment"}
             </p>
             <p className="opacity-50">© {new Date().getFullYear()} {isRtl ? 'جميع الحقوق محفوظة - منصة سيرتي' : 'All Rights Reserved - Sira-AI'}</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <a 
              href={PAYMENT_INFO.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-3 bg-slate-800 hover:bg-emerald-600 px-8 py-4 rounded-3xl text-white transition-all shadow-3xl border border-slate-700 hover:border-emerald-500"
            >
              <i className="fa-brands fa-linkedin text-2xl"></i>
              <span className="font-black text-base flex items-center gap-1">
                {isRtl ? 'بإشراف: ' : 'By: '}
                <span className="underline decoration-emerald-400 underline-offset-8 group-hover:decoration-white transition-all">
                  {isRtl ? PAYMENT_INFO.owner.ar : PAYMENT_INFO.owner.en}
                </span>
              </span>
            </a>
          </div>
        </div>
      </footer>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-4xl w-full max-w-lg p-8 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowSupport(false)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <i className="fa-solid fa-headset text-emerald-500"></i>
              {t.nav_contact}
            </h3>
            
            {supportSuccess ? (
              <div className="py-12 text-center space-y-4">
                <i className="fa-solid fa-circle-check text-6xl text-emerald-500 animate-bounce"></i>
                <p className="text-lg font-black text-slate-900 dark:text-white">{t.support_form_success}</p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <input 
                  required
                  placeholder={t.support_form_subject} 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  value={supportForm.subject}
                  onChange={e => setSupportForm({...supportForm, subject: e.target.value})}
                />
                <input 
                  required
                  placeholder={t.support_form_name} 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  value={supportForm.name}
                  onChange={e => setSupportForm({...supportForm, name: e.target.value})}
                />
                <input 
                  required
                  placeholder={t.support_form_phone} 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  value={supportForm.phone}
                  onChange={e => setSupportForm({...supportForm, phone: e.target.value})}
                />
                <input 
                  required
                  type="email"
                  placeholder={t.support_form_email} 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  value={supportForm.email}
                  onChange={e => setSupportForm({...supportForm, email: e.target.value})}
                />
                <textarea 
                  required
                  placeholder={t.support_form_message} 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 h-32 text-slate-900 dark:text-white"
                  value={supportForm.message}
                  onChange={e => setSupportForm({...supportForm, message: e.target.value})}
                />
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all">
                  {t.support_form_submit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
