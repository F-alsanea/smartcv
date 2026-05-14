
import React, { useState } from 'react';
import { CVData, VerificationResult } from '../types';
import { verifyCertificate } from '../services/geminiService';

interface Props {
  cvData: CVData;
  onVerified: (res: VerificationResult) => void;
}

export const CredentialVerifier: React.FC<Props> = ({ cvData, onVerified }) => {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVerifying(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await verifyCertificate(base64, cvData);
        onVerified(result);
        setVerifying(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("فشل التحقق من الشهادة");
      setVerifying(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-stamp text-emerald-400"></i>
          التوثيق الذكي للشهادات (Credential Verifier)
        </h3>
        <p className="text-slate-400 text-sm mt-1">ارفع شهادتك للحصول على شارة التوثيق ورفع ثقة الشركات</p>
      </div>
      <div className="p-8">
        <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-3xl h-48 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
          {verifying ? (
            <div className="text-center">
              <i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600 mb-2"></i>
              <p className="font-bold text-emerald-900">جاري استخراج البيانات والمطابقة...</p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <i className="fa-solid fa-cloud-arrow-up text-4xl text-slate-300"></i>
              <p className="font-bold text-slate-700">اضغط لرفع صورة الشهادة</p>
              <p className="text-xs text-slate-400">JPG, PNG - سيتم توثيق البيانات فوراً</p>
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={verifying} />
        </label>
        {error && <p className="mt-4 text-red-500 text-center text-sm font-bold">{error}</p>}
      </div>
    </div>
  );
};
