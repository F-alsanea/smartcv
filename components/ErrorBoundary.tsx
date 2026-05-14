
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-red-200 dark:border-red-900/30 m-4">
          <div className="space-y-6 max-w-md">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-3xl flex items-center justify-center mx-auto text-3xl">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              عذراً، حدث خطأ تقني غير متوقع
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              نظام Sira-AI واجه صعوبة في معالجة هذه الجزئية. يرجى إعادة المحاولة أو تحديث الصفحة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.children;
  }
}
