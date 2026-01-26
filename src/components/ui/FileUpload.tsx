'use client';

import React, { useCallback, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    label?: string;
    icon?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    accept,
    multiple = false,
    label = 'Click or drag files to upload',
    icon = '📁'
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFileSelect(multiple ? files : [files[0]]);
        }
    }, [multiple, onFileSelect]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onFileSelect(Array.from(e.target.files));
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative group cursor-pointer transition-all duration-300 rounded-[32px] border-2 border-dashed p-12 text-center
        ${isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.02]'
                    : 'border-slate-200 hover:border-indigo-400 bg-white dark:bg-slate-900 dark:border-slate-800'
                }`}
        >
            <input
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-4 p-2">
                <div className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <div className="max-w-xs mx-auto">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">{label}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">Supports {accept?.replace(/\./g, '').toUpperCase() || 'any format'}</p>
                </div>
                <button className="px-6 py-2 sm:px-8 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-200 dark:shadow-none transition-all min-h-[44px]">
                    Select Files
                </button>
            </div>
        </div>
    );
};
