
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Paywall } from './components/Paywall';
import { CVPreview } from './components/CVPreview';
import { CareerPath } from './components/CareerPath';
import { SmartHelper } from './components/SmartHelper';
import { JobMatcher } from './components/JobMatcher';
import { CareerRadar } from './components/CareerRadar';
import { Invoice } from './components/Invoice';
import { CandidateHub } from './components/CandidateHub';
import { EditorWizard } from './components/EditorWizard';
import { TalentScout } from './components/TalentScout';
import { processCVInput, translateCV, generateCoverLetter } from './services/geminiService';
import { UserRole, ApiResponse, CVData, CandidateProfile, TemplateType, ThemeConfig, Language, ThemeMode, WizardStep, InvoiceData, ArchiveItem } from './types';
import { TRANSLATIONS, PAYMENT_INFO } from './constants';

const initialCV: CVData = {
  personal_info: { full_name: '', email: '', phone: '', location: '', target_job: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  ats_score: 15
};

const LegalModal: React.FC<{ 
  show: boolean; 
  title: string; 
  body: string; 
  onClose: () => void;
  lang: Language;
}> = ({ show, title, body, onClose, lang }) => {
  if (!show) return null;
  const isRtl = lang === Language.AR;
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-4xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b border-slate-800">
          <h3 className="text-2xl font-black tracking-tighter">{title}</h3>
          <button onClick={onClose} className="hover:scale-110 transition-transform">
            <i className="fa-solid fa-circle-xmark text-2xl text-slate-500 hover:text-white"></i>
          </button>
        </div>
        <div className="p-10 max-h-[60vh] overflow-y-auto">
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
            {body}
          </p>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
          <button 
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-3xl font-black shadow-xl transition-all"
          >
            {isRtl ? 'موافق' : 'I Agree / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [cvData, setCVData] = useState<CVData>(initialCV);
  const [wizardStep, setWizardStep] = useState<WizardStep>(WizardStep.HUB);
  const [shortlist, setShortlist] = useState<CandidateProfile[]>([]);
  const [unlockedCandidateIds, setUnlockedCandidateIds] = useState<string[]>([]);
  const [pendingCandidateToUnlock, setPendingCandidateToUnlock] = useState<CandidateProfile | null>(null);
  const [activeInfoPage, setActiveInfoPage] = useState<string>('home');
  const [autoDownloadFired, setAutoDownloadFired] = useState(false);
  const [showManualDownload, setShowManualDownload] = useState(false);
  
  const [legalModal, setLegalModal] = useState<{ show: boolean, title: string, body: string }>({
    show: false,
    title: '',
    body: ''
  });

  const [archive, setArchive] = useState<ArchiveItem[]>(() => {
    const saved = localStorage.getItem('sira_archive');
    return saved ? JSON.parse(saved) : [];
  });

  const [uiLang, setUiLang] = useState<Language>(Language.AR);
  const [themeMode, setThemeMode] = useState<ThemeMode>(ThemeMode.LIGHT);
  const [template, setTemplate] = useState<TemplateType>(TemplateType.NEOM);
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: '#10b981',
    sectionOrder: ['summary', 'experience', 'education', 'skills'],
    fontSize: 'base',
    showQR: false
  });

  const t = uiLang === Language.AR ? TRANSLATIONS.ar : TRANSLATIONS.en;
  const isRtl = uiLang === Language.AR;

  useEffect(() => {
    const saved = localStorage.getItem('sirati_theme') as ThemeMode;
    if (saved) setThemeMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('sirati_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('sira_archive', JSON.stringify(archive));
  }, [archive]);

  const handlePrint = useCallback((targetCV?: CVData) => {
    const activeCV = targetCV || result?.cv;
    if (!activeCV) return;
    
    const name = activeCV.personal_info.full_name || 'Candidate';
    const job = activeCV.personal_info.target_job || 'CV';
    
    const sanitize = (str: string) => str.trim()
      .replace(/[^\w\s\u0600-\u06FF]/g, '')
      .replace(/\s+/g, '_');
    
    const fileName = `${sanitize(name)}_${sanitize(job)}`;
    const originalTitle = document.title;
    document.title = fileName;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  }, [result]);

  useEffect(() => {
    if (activated && result && !autoDownloadFired && role === UserRole.SEEKER) {
      setAutoDownloadFired(true);
      const timer = setTimeout(() => {
        handlePrint();
        setTimeout(() => setShowManualDownload(true), 3000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activated, result, autoDownloadFired, handlePrint, role]);

  const toggleTheme = () => setThemeMode(prev => prev === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT);

  const generateOtp = (r: UserRole) => {
    const prefix = r === UserRole.SEEKER ? 'TX-' : 'EX-';
    return `${prefix}${Math.floor(10000 + Math.random() * 89999)}`;
  };

  const handleProcessFinal = async () => {
    setLoading(true);
    try {
      setOtp(generateOtp(UserRole.SEEKER));
      const apiResult = await processCVInput(JSON.stringify(cvData), cvData.personal_info.target_job, uiLang);
      const coverLetter = await generateCoverLetter(cvData, uiLang);
      apiResult.cv.cover_letter = coverLetter;
      setResult(apiResult);
      setWizardStep(WizardStep.PREVIEW);
    } catch (error) {
      alert(isRtl ? "فشل المحرك السيادي في المعالجة" : "Engine processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateToggle = async () => {
    if (!result) {
      setUiLang(prev => prev === Language.AR ? Language.EN : Language.AR);
      return;
    }
    setLoading(true);
    const targetLang = uiLang === Language.AR ? Language.EN : Language.AR;
    try {
      const translatedCV = await translateCV(result.cv, targetLang);
      setResult({ ...result, cv: translatedCV });
      setUiLang(targetLang);
    } catch (e) {
      alert("Neural translation failed");
    } finally {
      setLoading(false);
    }
  };

  const updateArchive = useCallback((updatedCV: CVData) => {
    if (!result) return;
    setResult(prev => prev ? { ...prev, cv: updatedCV } : null);
    
    const newItem: ArchiveItem = {
      id: invoice?.id || `ARC-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      cv: updatedCV,
      otp: otp || 'PRO',
      job: updatedCV.personal_info.target_job
    };
    setArchive(prev => {
      const filtered = prev.filter(a => a.id !== newItem.id);
      return [newItem, ...filtered].slice(0, 10);
    });
  }, [result, invoice, otp]);

  const handleActivate = (code: string, invoiceData?: InvoiceData) => {
    if (code === "INSTANT_SUCCESS" || code.length >= 4) {
      if (role === UserRole.EMPLOYER && pendingCandidateToUnlock) {
         setUnlockedCandidateIds(prev => [...prev, pendingCandidateToUnlock.id]);
         setPendingCandidateToUnlock(null);
         alert(isRtl ? "تم فتح بيانات المرشح بنجاح!" : "Candidate data unlocked successfully!");
         return;
      }

      setActivated(true);
      if (invoiceData) setInvoice(invoiceData);
      
      if (result) {
        updateArchive(result.cv);
      }

      if (code === "INSTANT_SUCCESS") {
         alert(isRtl ? "تم التفعيل بنجاح! جاري تحويل الملف للتحميل التلقائي فوراً..." : "Activation successful! Processing file for immediate download...");
      }
    } else {
      alert(isRtl ? "كود التفعيل غير صالح" : "Invalid activation code");
    }
  };

  const openLegal = (type: string) => {
    let title = '';
    let body = '';
    switch(type) {
      case 'terms': title = t.legal_terms_title; body = t.legal_terms_body; break;
      case 'privacy': title = t.legal_privacy_title; body = t.legal_privacy_body; break;
      case 'liability': title = t.legal_liability_title; body = t.legal_liability_body; break;
      case 'general': title = t.legal_general_title; body = t.legal_general_body; break;
    }
    setLegalModal({ show: true, title, body });
  };

  const handleNavClick = (page: string) => {
    if (['terms', 'privacy', 'liability', 'general'].includes(page)) {
      openLegal(page);
      return;
    }
    setActiveInfoPage(page);
    if (page === 'home') {
      setRole(null);
      setResult(null);
      setWizardStep(WizardStep.HUB);
      setAutoDownloadFired(false);
      setShowManualDownload(false);
      setPendingCandidateToUnlock(null);
    }
  };

  const startUnlockCandidate = (c: CandidateProfile) => {
    setPendingCandidateToUnlock(c);
    setOtp(generateOtp(UserRole.EMPLOYER));
    const el = document.getElementById('unlock-paywall');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout lang={uiLang} onLangToggle={handleTranslateToggle} themeMode={themeMode} onThemeToggle={toggleTheme} onNavClick={handleNavClick}>
      <div className="container mx-auto px-4 py-8">
        
        {activeInfoPage === 'about' && (
          <div className="max-w-4xl mx-auto py-12 animate-in fade-in zoom-in duration-300">
            <h2 className="text-5xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white">{t.about_title}</h2>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800">
               <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400 mb-8">{t.about_body}</p>
               <button onClick={() => setActiveInfoPage('home')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black">{isRtl ? 'عودة' : 'Back'}</button>
            </div>
          </div>
        )}

        {activeInfoPage === 'payment' && (
          <div className="max-w-5xl mx-auto py-12 animate-in fade-in zoom-in duration-300">
            <h2 className="text-5xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white text-center">{t.payment_benefits_title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-3xl border-t-8 border-emerald-500">
                <h3 className="text-2xl font-black mb-6">{t.seeker_benefits_title} ({PAYMENT_INFO.seekerPrice[uiLang === Language.AR ? 'ar' : 'en']})</h3>
                <ul className="space-y-3">
                  {(t as any).seeker_benefits_list.map((b: string, i: number) => <li key={i} className="text-sm font-bold flex gap-2"><i className="fa-solid fa-check text-emerald-500"></i>{b}</li>)}
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-3xl border-t-8 border-blue-500">
                <h3 className="text-2xl font-black mb-6">{t.employer_benefits_title} ({PAYMENT_INFO.employerPrice[uiLang === Language.AR ? 'ar' : 'en']})</h3>
                <ul className="space-y-3">
                  {(t as any).employer_benefits_list.map((b: string, i: number) => <li key={i} className="text-sm font-bold flex gap-2"><i className="fa-solid fa-check text-blue-500"></i>{b}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-12 text-center">
              <button onClick={() => setActiveInfoPage('home')} className="bg-slate-900 text-white px-12 py-4 rounded-3xl font-black">
                {isRtl ? 'ابدأ الاستفادة الآن' : 'Start Now'}
              </button>
            </div>
          </div>
        )}

        {!role && activeInfoPage === 'home' && (
          <div className="flex flex-col items-center py-20 animate-in fade-in zoom-in duration-300">
            <h2 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
              {t.hero_title}<span className="text-emerald-500">{t.hero_title_accent}</span>
            </h2>
            <p className="text-slate-500 text-2xl mb-16 text-center max-w-2xl font-medium leading-relaxed">{t.hero_desc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <button onClick={() => setRole(UserRole.SEEKER)} className="p-12 bg-white dark:bg-slate-900 border-2 rounded-[50px] shadow-3xl hover:border-emerald-500 transition-all text-start group">
                <i className="fa-solid fa-user-graduate text-4xl text-emerald-500 mb-6"></i>
                <h3 className="text-3xl font-black mb-2 dark:text-white">{t.role_seeker}</h3>
                <p className="text-slate-500 text-sm">{t.role_seeker_desc}</p>
              </button>
              <button onClick={() => setRole(UserRole.EMPLOYER)} className="p-12 bg-slate-900 text-white rounded-[50px] shadow-3xl hover:border-emerald-500 transition-all text-start group">
                <i className="fa-solid fa-bolt text-4xl text-emerald-400 mb-6"></i>
                <h3 className="text-3xl font-black mb-2">{t.role_employer}</h3>
                <p className="text-slate-400 text-sm">{t.role_employer_desc}</p>
              </button>
            </div>
          </div>
        )}

        {role === UserRole.EMPLOYER && activeInfoPage === 'home' && (
          <div className="space-y-12">
            <TalentScout 
              onViewCandidate={(c) => handlePrint(c)} 
              onShortlist={() => {}} 
              onUnlock={startUnlockCandidate}
              shortlist={shortlist} 
              unlockedIds={unlockedCandidateIds}
              lang={uiLang} 
            />
            {pendingCandidateToUnlock && (
              <div id="unlock-paywall" className="pt-10 scroll-mt-24">
                <Paywall role={role} otp={otp || '0000'} userName={pendingCandidateToUnlock.personal_info?.full_name || '...'} onActivate={handleActivate} lang={uiLang} />
              </div>
            )}
          </div>
        )}

        {role === UserRole.SEEKER && activeInfoPage === 'home' && (
          <>
            {wizardStep === WizardStep.HUB && <CandidateHub onStartFresh={() => setWizardStep(WizardStep.PERSONAL)} onStartChat={() => setWizardStep(WizardStep.CHAT)} onExtracted={(d) => { setCVData(d); setWizardStep(WizardStep.PERSONAL); }} lang={uiLang} />}
            {wizardStep !== WizardStep.HUB && wizardStep !== WizardStep.PREVIEW && <EditorWizard data={cvData} onChange={(d) => setCVData(prev => ({...prev, ...d}))} step={wizardStep} lang={uiLang} onNext={() => {
              if (wizardStep === WizardStep.PERSONAL) setWizardStep(WizardStep.EXPERIENCE);
              else if (wizardStep === WizardStep.EXPERIENCE) setWizardStep(WizardStep.EDUCATION);
              else if (wizardStep === WizardStep.EDUCATION) setWizardStep(WizardStep.SKILLS);
              else handleProcessFinal();
            }} onPrev={() => setWizardStep(prev => prev === WizardStep.PERSONAL ? WizardStep.HUB : WizardStep.PERSONAL)} />}
            {result && wizardStep === WizardStep.PREVIEW && (
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                <aside className="lg:w-[380px] space-y-8 no-print">
                   <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800 sticky top-24">
                      <h3 className="text-xl font-black mb-6 dark:text-white">{t.design_customize}</h3>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {Object.values(TemplateType).map(v => <button key={v} onClick={() => setTemplate(v)} className={`p-3 rounded-2xl border-2 text-[10px] font-black ${template === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}>{v}</button>)}
                      </div>
                      <button onClick={handleTranslateToggle} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2">
                        <i className="fa-solid fa-language"></i> {t.translate_btn}
                      </button>
                   </div>
                </aside>
                <div className="flex-1 space-y-12">
                   <CVPreview data={result.cv} template={template} theme={theme} lang={uiLang} activated={activated} onUpdate={updateArchive} />
                   {!activated && <Paywall role={role} otp={otp || '0000'} userName={cvData.personal_info.full_name} onActivate={handleActivate} lang={uiLang} />}
                   {activated && (
                     <div className="space-y-12">
                        <div className="bg-emerald-600 text-white p-10 rounded-[50px] shadow-4xl flex flex-col md:flex-row items-center justify-between no-print">
                           <div>
                             <h4 className="text-3xl font-black mb-1">{t.verified_badge}</h4>
                             <p className="opacity-80 font-bold">{t.verified_desc}</p>
                           </div>
                           <button onClick={() => handlePrint()} className="bg-white text-emerald-600 px-12 py-5 rounded-3xl font-black shadow-xl">
                             <i className="fa-solid fa-file-pdf"></i> {isRtl ? 'تحميل النسخة النهائية' : 'Download Now'}
                           </button>
                        </div>
                        {invoice && <Invoice data={invoice} lang={uiLang} />}
                        <JobMatcher cv={result.cv} />
                        <CareerPath data={result.career_path} />
                        <SmartHelper data={result.smart_helper} />
                     </div>
                   )}
                </div>
              </div>
            )}
          </>
        )}

        {activeInfoPage === 'archive' && (
          <div className="max-w-4xl mx-auto py-20 animate-in fade-in duration-300">
             <h2 className="text-5xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white">{t.archive_title}</h2>
             <p className="text-slate-500 mb-10">{t.archive_desc}</p>
             <div className="grid gap-4">
                {archive.length > 0 ? archive.map(item => (
                  <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 flex justify-between items-center group hover:border-emerald-500 transition-all">
                    <div>
                      <h4 className="font-black text-xl dark:text-white">{item.cv.personal_info.full_name}</h4>
                      <p className="text-xs text-slate-400 font-bold">{item.job} | {item.date}</p>
                    </div>
                    <button onClick={() => { setRole(UserRole.SEEKER); setActivated(true); setResult({cv: item.cv, career_path: {} as any, smart_helper: {} as any, market_insights: {} as any}); setWizardStep(WizardStep.PREVIEW); setActiveInfoPage('home'); }} className="bg-slate-900 dark:bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-black">تحميل</button>
                  </div>
                )) : <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed font-bold text-slate-400">{t.archive_empty}</div>}
             </div>
          </div>
        )}
      </div>

      <LegalModal 
        show={legalModal.show} 
        title={legalModal.title} 
        body={legalModal.body} 
        onClose={() => setLegalModal({ ...legalModal, show: false })} 
        lang={uiLang}
      />
      
      {loading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-3xl z-[600] flex items-center justify-center p-8 no-print">
          <div className="text-center space-y-8 max-w-lg animate-pulse">
            <div className="w-32 h-32 border-[12px] border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto shadow-4xl shadow-emerald-500/20"></div>
            <h4 className="text-4xl font-black text-white tracking-tighter">Turbo Neural Sync...</h4>
            <p className="text-slate-400 font-bold text-lg">{isRtl ? 'جاري معالجة المحرك السيادي بسرعة الضوء...' : 'Sovereign Engine processing...'}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
