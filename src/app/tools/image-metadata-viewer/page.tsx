'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import ExifReader from 'exifreader';

const ImageMetadataViewerTool = () => {
    const [info, setInfo] = useState<any>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const onFileSelect = async (files: File[]) => {
        if (files[0]) {
            const f = files[0];
            const tags = await ExifReader.load(f);
            
            // Basic Info
            const data: any = {
                'File Name': f.name,
                'File Type': f.type.toUpperCase().split('/')[1] || 'IMAGE',
                'File Size': (f.size / 1024).toFixed(2) + ' KB',
                'Last Modified': new Date(f.lastModified).toLocaleString(),
            };

            // Image Dimensions from Tags if available, else standard load
            if (tags['Image Width']) data['Resolution'] = `${tags['Image Width'].value} x ${tags['Image Height']?.value} px`;
            
            // Common EXIF Data
            if (tags['Make']) data['Camera Make'] = tags['Make'].description;
            if (tags['Model']) data['Camera Model'] = tags['Model'].description;
            if (tags['DateTimeOriginal']) data['Date Taken'] = tags['DateTimeOriginal'].description;
            if (tags['FNumber']) data['Aperture'] = tags['FNumber'].description;
            if (tags['ExposureTime']) data['Exposure Time'] = tags['ExposureTime'].description;
            if (tags['ISOSpeedRatings']) data['ISO'] = tags['ISOSpeedRatings'].description;
            if (tags['FocalLength']) data['Focal Length'] = tags['FocalLength'].description;
            if (tags['LensModel']) data['Lens'] = tags['LensModel'].description;
            if (tags['GPSLatitude']) data['GPS Latitude'] = tags['GPSLatitude'].description;
            if (tags['GPSLongitude']) data['GPS Longitude'] = tags['GPSLongitude'].description;

            // Load preview
            const url = URL.createObjectURL(f);
            setPreviewUrl(url);

            if (!data['Resolution']) {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    setInfo((prev: any) => ({
                        ...prev,
                        'Resolution': `${img.width} x ${img.height} px`,
                        'Aspect Ratio': (img.width / img.height).toFixed(2)
                    }));
                };
            }

            setInfo(data);
        }
    };

    return (
        <ToolLayout title="Image Metadata Viewer" description="View detailed technical information and metadata from your image files instantly." toolId="img-inspect">
            <div className="max-w-5xl mx-auto space-y-8">
                {!info ? (
                    <FileUpload
                        onFileSelect={onFileSelect}
                        accept="image/*"
                        label="Upload Image to View Metadata"
                        icon="🖼️"
                    />
                ) : (
                    <div className="animate-in zoom-in-95 duration-500">
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-10">
                            <div className="w-full lg:w-2/5 aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-4xl text-slate-300 font-bold uppercase tracking-tighter opacity-30">Preview</div>
                                )}
                            </div>

                            <div className="flex-1 space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 px-1">Image Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.entries(info).map(([key, val]) => (
                                            <div key={key} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all group">
                                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">{key}</p>
                                                <p className="font-bold text-slate-900 dark:text-white truncate transition-colors group-hover:text-indigo-600">{String(val)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setInfo(null); setPreviewUrl(null); }}
                                    className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Analyze Another Image
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default ImageMetadataViewerTool;
