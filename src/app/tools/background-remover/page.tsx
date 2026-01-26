'use client';

import React, { useState, useRef } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { removeBackground } from '@imgly/background-removal';

const BackgroundRemoverTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [inputImage, setInputImage] = useState<string | null>(null);
    const [outputImage, setOutputImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = async (files: File[]) => {
        const uploadedFile = files[0];
        if (!uploadedFile) return;

        setIsProcessing(true);
        setOutputImage(null);
        setFile(uploadedFile);

        try {
            // Convert file to URL for preview
            const imageUrl = URL.createObjectURL(uploadedFile);
            setInputImage(imageUrl);

            // Remove background using @imgly/background-removal
            const imageBlob = await removeBackground(uploadedFile);
            const outputUrl = URL.createObjectURL(imageBlob);
            
            setOutputImage(outputUrl);
        } catch (error) {
            console.error('Background removal failed:', error);
            alert('Failed to remove background. Please try another image.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadResult = () => {
        if (outputImage) {
            const link = document.createElement('a');
            link.download = `background-removed-${file?.name.split('.')[0] || 'image'}.png`;
            link.href = outputImage;
            link.click();
        }
    };

    const clearAll = () => {
        setFile(null);
        setInputImage(null);
        setOutputImage(null);
        
        if (inputImage) URL.revokeObjectURL(inputImage);
        if (outputImage) URL.revokeObjectURL(outputImage);
    };

    return (
        <ToolLayout
            title="Background Remover"
            description="AI-powered background removal tool. Remove unwanted backgrounds from your images instantly."
            toolId="background-remover"
            category="Image"
        >
            <div className="max-w-6xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={handleImageUpload}
                        accept="image/*"
                        label="Upload Image to Remove Background"
                        icon="✂️"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                        <span className="text-2xl">🖼️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg truncate max-w-48">{file.name}</h3>
                                        <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    Change Image
                                </button>
                            </div>
                        </div>

                        {/* Image Comparison */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Original */}
                                <div className="text-center">
                                    <h4 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Original</h4>
                                    <div className="relative group">
                                        <img
                                            src={inputImage || ''}
                                            alt="Original"
                                            className="max-h-80 w-full object-contain rounded-xl border-2 border-slate-200 dark:border-slate-700"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-all" />
                                    </div>
                                </div>

                                {/* Result */}
                                <div className="text-center">
                                    <h4 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">
                                        {isProcessing 
                                            ? 'Processing...' 
                                            : outputImage 
                                                ? 'Background Removed' 
                                                : 'Result Preview'
                                        }
                                    </h4>
                                    <div className="relative group">
                                        {isProcessing ? (
                                            <div className="h-80 w-full flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
                                                <div className="text-center">
                                                    <div className="text-4xl mb-2">⏳</div>
                                                    <p className="text-sm text-slate-500">Removing background...</p>
                                                </div>
                                            </div>
                                        ) : outputImage ? (
                                            <img
                                                src={outputImage}
                                                alt="Background Removed"
                                                className="max-h-80 w-full object-contain rounded-xl border-2 border-green-500/50 bg-grid-pattern"
                                                style={{
                                                    backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                                                    backgroundSize: '20px 20px',
                                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                                }}
                                            />
                                        ) : (
                                            <div className="h-80 w-full flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
                                                <div className="text-center">
                                                    <div className="text-4xl mb-2">🎨</div>
                                                    <p className="text-sm text-slate-500">Upload an image to remove background</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => handleImageUpload([file])}
                                    disabled={isProcessing}
                                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span>✂️</span>
                                            Remove Background Again
                                        </>
                                    )}
                                </button>
                                
                                {outputImage && (
                                    <button
                                        onClick={downloadResult}
                                        className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>💾</span>
                                        Download Result
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default BackgroundRemoverTool;