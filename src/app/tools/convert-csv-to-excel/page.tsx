'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import * as XLSX from 'xlsx';
import { downloadFile } from '@/lib/utils/file-download';

const CsvToExcelTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a CSV file.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setConvertedBlob(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const lines = content.split('\n').filter(l => l.trim()).slice(0, 5);
        setPreviewData(lines.map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, ''))));
      };
      reader.readAsText(selectedFile);
    }
  };

  const convertCsvToExcel = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        // Use SheetJS (xlsx) for robust conversion
        const wb = XLSX.read(content, { type: 'string' });
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        setConvertedBlob(blob);
        setIsConverting(false);
      };
      reader.readAsText(file);
    } catch {
      setError('Conversion failed.');
      setIsConverting(false);
    }
  };

  return (
    <ToolLayout
      title="CSV to Excel"
      description="Convert simple comma-separated values into professional Excel spreadsheets"
      toolId="csv-to-excel"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {!file ? (
          <div className="border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer border-slate-300 hover:border-blue-500 transition-all bg-white dark:bg-slate-800 shadow-sm" onClick={() => fileInputRef.current?.click()}>
            <div className="text-4xl mb-4">📊</div>
            <p className="text-xl font-bold">Select CSV File</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl">
            <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <span className="font-bold truncate max-w-xs">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-red-500 text-xs font-black uppercase">Change</button>
            </div>

            {previewData.length > 0 && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900 uppercase text-[10px] font-black text-slate-400">
                    <tr>{previewData[0].map((_, i) => <th key={i} className="px-4 py-3">Col {i + 1}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {previewData.map((row, i) => (
                      <tr key={i} className="dark:bg-slate-800">
                        {row.map((cell, j) => <td key={j} className="px-4 py-3 truncate">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button onClick={convertCsvToExcel} disabled={isConverting} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg transition-all uppercase">{isConverting ? 'Generating Excel...' : 'Process & Convert'}</button>
          </div>
        )}

        {convertedBlob && (
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-10 text-white shadow-2xl animate-in zoom-in duration-500 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black px-1">Spreadsheet Ready!</h2>
              <p className="text-green-100 px-1">Your data has been formatted for Microsoft Excel.</p>
            </div>
            <button onClick={() => downloadFile(convertedBlob, file!.name.replace('.csv', '.xls'), 'application/vnd.ms-excel')} className="px-10 py-5 bg-white text-green-600 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all">Download .xls</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default CsvToExcelTool;
