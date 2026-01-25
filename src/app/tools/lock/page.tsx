'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function LockPdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleLock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !password) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('password', password);

            const res = await fetch('/api/pdf/lock', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to lock PDF');

            const blob = await res.blob();
            downloadFile(blob, `protected-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to lock PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Lock PDF"
            description="Secure your PDF with a password. Protect sensitive information (AES-128 encryption)."
            toolId="lock-pdf"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Protect"
                        icon="🔒"
                    />
                ) : (
                    <form onSubmit={handleLock} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                                <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto" type="button">Change</Button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Set Password</label>
                            <Input
                                type="password"
                                placeholder="Enter strong password..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={4}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Encrypt PDF'}
                        </Button>
                    </form>
                )}
            </div>
        </ToolLayout>
    );
}
