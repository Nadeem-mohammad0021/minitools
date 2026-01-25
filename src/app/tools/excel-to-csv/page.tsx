'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { downloadFile } from '@/lib/utils/file-download';
import * as XLSX from 'xlsx';

const ExcelToCsvTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [csvBlob, setCsvBlob] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const convertToCsv = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            
            setCsvBlob(new Blob([csv], { type: 'text/csv' }));
        } catch {
            alert('Failed to convert Excel file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Excel to CSV"
            description="Convert Microsoft Excel spreadsheets (.xlsx, .xls) to a portable CSV format"
            toolId="excel-to-csv"
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {!file ? (
                    <div className="border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-all bg-white dark:bg-slate-800 shadow-sm" onClick={() => fileInputRef.current?.click()}>
                        <p className="text-xl font-bold">Select Excel Doc to Convert</p>
                        <input type="file" ref={fileInputRef} onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} accept=".xls,.xlsx" className="hidden" />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <span className="font-bold truncate">{file.name}</span>
                        <button onClick={convertToCsv} disabled={isProcessing} className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg uppercase">{isProcessing ? 'Converting...' : 'Convert to CSV'}</button>
                    </div>
                )}

                {csvBlob && (
                    <div className="bg-gradient-to-br from-green-600 to-indigo-700 p-10 rounded-3xl text-white shadow-2xl animate-in zoom-in duration-500 flex flex-col md:flex-row items-center justify-between gap-6">
                        <h2 className="text-2xl font-black px-1">Conversion Successful!</h2>
                        <button onClick={() => downloadFile(csvBlob, file?.name.replace(/\.[^/.]+$/, "") + ".csv", "text/csv")} className="px-12 py-5 bg-white text-green-600 rounded-2xl font-black shadow-xl">Download .csv</button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default ExcelToCsvTool;
