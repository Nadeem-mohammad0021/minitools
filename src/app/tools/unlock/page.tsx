'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Unlock } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function UnlockPdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !password) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('password', password);

            const res = await fetch('/api/pdf/unlock', {
                method: 'POST',
                body: fd
            });

            if (res.status === 401) {
                alert("Incorrect password!");
                setIsProcessing(false);
                return;
            }

            if (!res.ok) throw new Error('Failed to unlock PDF');

            const blob = await res.blob();
            downloadFile(blob, `unlocked-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to unlock PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Unlock PDF"
            description="Remove passwords and restrictions from PDF files instantly."
            toolId="unlock-pdf"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Unlock"
                        icon="🔓"
                    />
                ) : (
                    <form onSubmit={handleUnlock} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                <Unlock className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto" type="button">Change</Button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Current Password</label>
                            <Input
                                type="password"
                                placeholder="Enter file password to unlock..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Unlock PDF'}
                        </Button>
                    </form>
                )}
            </div>
        </ToolLayout>
    );
}
