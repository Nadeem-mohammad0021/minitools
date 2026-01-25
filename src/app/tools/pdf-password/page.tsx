'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/file-download';

const PdfPasswordTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [mode, setMode] = useState<'protect' | 'unlock'>('protect');
  const [existingPassword, setExistingPassword] = useState<string>('');

  const onFileSelect = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      setResultBlob(null);
      setError(null);
    }
  };

  const processPdf = useCallback(async () => {
    if (!file) return;

    if (mode === 'protect') {
      if (!password) {
        setError('Please enter a password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if (!existingPassword) {
        setError('Please enter the current password to unlock.');
        return;
      }
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (mode === 'protect') {
        // Server-side protection using muhammara
        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', password);

        const res = await fetch('/api/pdf/lock', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Failed to protect PDF');
        }
        
        const blob = await res.blob();
        setResultBlob(blob);
      } else {
        // Client-side unlock using pdf-lib
        const fileBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer, {
          password: existingPassword,
          ignoreEncryption: false
        } as any);
  
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResultBlob(blob);
      }
      setError(null);
    } catch (err) {
      setError(mode === 'protect' ? 'Failed to protect PDF.' : 'Failed to unlock PDF. The password might be incorrect.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [file, mode, password, confirmPassword, existingPassword]);

  return (
    <ToolLayout title="PDF Password Tool" description="Easily add password protection to your PDF documents or remove it if you have the current password." toolId="pdf-password">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-center">
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex border border-slate-200 dark:border-slate-700 shadow-sm">
            {(['protect', 'unlock'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setFile(null); setResultBlob(null); setError(null); }}
                className={`px-10 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${mode === m ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {m} PDF
              </button>
            ))}
          </div>
        </div>

        {!file ? (
          <FileUpload
            onFileSelect={onFileSelect}
            accept=".pdf"
            label={`Upload PDF to ${mode}`}
            icon={mode === 'protect' ? '🔒' : '🔓'}
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-5 overflow-hidden w-full">
                <div className="w-14 h-14 bg-red-600 dark:bg-red-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shrink-0">PDF</div>
                <div className="truncate">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{file.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ready for processing</p>
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setResultBlob(null); setError(null); }}
                className="px-8 py-3 bg-white dark:bg-slate-700 text-slate-500 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100 dark:border-slate-600 shrink-0"
              >
                Change
              </button>
            </div>

            {!resultBlob && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mode === 'protect' ? (
                    <>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">New Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Set password..."
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password..."
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium transition-all shadow-inner"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 col-span-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Current Password</label>
                      <input
                        type="password"
                        value={existingPassword}
                        onChange={e => setExistingPassword(e.target.value)}
                        placeholder="Enter existing password..."
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium transition-all shadow-inner"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={processPdf}
                  disabled={isProcessing}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : mode === 'protect' ? 'Protect PDF' : 'Unlock PDF'}
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold text-center border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        {resultBlob && (
          <div className="bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl border border-white/5 animate-in zoom-in duration-500 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Success!</h2>
              <p className="text-indigo-300 text-sm font-medium">Your {mode === 'protect' ? 'protected' : 'unlocked'} PDF is ready for download.</p>
            </div>
            <button
              onClick={() => downloadFile(resultBlob, `${mode === 'protect' ? 'protected' : 'unlocked'}-${file?.name}`, 'application/pdf')}
              className="w-full md:w-auto px-12 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-95 relative z-10"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default PdfPasswordTool;
