'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/file-download';
import {
    Type,
    Image as ImageIcon,
    Square,
    Trash2,
    Download,
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
    MousePointer2,
    Layers,
    Settings2,
    Search,
    Maximize2,
    TextCursor
} from 'lucide-react';

const PDFJS_VERSION = '3.11.174';

type AnnotationType = 'text' | 'image' | 'shape';
type ShapeType = 'rect' | 'circle';

interface Annotation {
    id: string;
    type: AnnotationType;
    page: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
    content?: string;
    color?: string;
    fontSize?: number;
    shapeType?: ShapeType;
    bgEnabled?: boolean;
    bgColor?: string;
}

interface DetectedText {
    str: string;
    x: number;
    y: number;
    w: number;
    h: number;
    fontSize: number;
}

const PDF_EDITOR_COLORS = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
    '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7'
];

export default function EditPdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [pdfInstance, setPdfInstance] = useState<any>(null);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(1.25);
    const [activeTool, setActiveTool] = useState<'select' | 'smart-edit' | AnnotationType>('select');
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [detectedText, setDetectedText] = useState<DetectedText[]>([]);
    const [libLoaded, setLibLoaded] = useState(false);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // 1. Load PDF.js from CDN
    useEffect(() => {
        if (typeof window === 'undefined' || libLoaded) return;

        const script = document.createElement('script');
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
        script.onload = () => {
            const lib = (window as any)['pdfjs-dist/build/pdf'];
            if (lib) {
                lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
                setPdfjsLib(lib);
                setLibLoaded(true);
            }
        };
        document.head.appendChild(script);
    }, [libLoaded]);

    // 2. Load PDF File
    useEffect(() => {
        if (!file || !pdfjsLib) return;

        const loadStream = async () => {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                setPdfInstance(pdf);
                setTotalPages(pdf.numPages);
                setCurrentPage(1);

                const thumbs: string[] = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 0.15 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d')!;
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context, viewport }).promise;
                    thumbs.push(canvas.toDataURL());
                }
                setPreviewImages(thumbs);
            } catch (err) {
                console.error('PDF error:', err);
            }
        };
        loadStream();
    }, [file, pdfjsLib]);

    // 3. Smart Detection Engine
    useEffect(() => {
        if (!pdfInstance || !currentPage) return;

        const detect = async () => {
            const page = await pdfInstance.getPage(currentPage);
            const textContent = await page.getTextContent();
            const viewport = page.getViewport({ scale: 1.0 });

            const detected: DetectedText[] = textContent.items.map((item: any) => {
                const transform = item.transform; // [scaleX, skewY, skewX, scaleY, translateX, translateY]
                // PDF.js coordinates are from bottom-left
                return {
                    str: item.str,
                    x: transform[4],
                    y: viewport.height - transform[5] - transform[3], // Approximate Y mapping
                    w: item.width || (item.str.length * transform[0] * 0.6),
                    h: transform[3],
                    fontSize: transform[0]
                };
            });
            setDetectedText(detected);
        };
        detect();
    }, [pdfInstance, currentPage]);

    // 4. Render Canvas
    useEffect(() => {
        if (!pdfInstance || !canvasRef.current) return;

        const renderPage = async () => {
            const page = await pdfInstance.getPage(currentPage);
            const viewport = page.getViewport({ scale: zoom * 1.5 });
            const canvas = canvasRef.current!;
            const context = canvas.getContext('2d')!;

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;

            // Draw smart-edit highlights if active
            if (activeTool === 'smart-edit') {
                context.save();
                context.strokeStyle = 'rgba(99, 102, 241, 0.3)';
                context.fillStyle = 'rgba(99, 102, 241, 0.05)';
                detectedText.forEach(t => {
                    const vx = t.x * (viewport.scale);
                    const vy = t.y * (viewport.scale);
                    const vw = t.w * (viewport.scale);
                    const vh = t.h * (viewport.scale);
                    context.fillRect(vx, vy, vw, vh);
                    context.strokeRect(vx, vy, vw, vh);
                });
                context.restore();
            }

            // Draw annotations
            for (const ann of annotations.filter(a => a.page === currentPage)) {
                const isSelected = ann.id === selectedId;
                context.save();

                const finalX = ann.x * (zoom * 1.5);
                const finalY = ann.y * (zoom * 1.5);
                const finalW = (ann.width || 100) * (zoom * 1.5);
                const finalH = (ann.height || 20) * (zoom * 1.5);

                // Background mask (Approach 2)
                if (ann.bgEnabled) {
                    context.fillStyle = ann.bgColor || '#ffffff';
                    context.fillRect(finalX, finalY, finalW, finalH);
                }

                if (ann.type === 'text' && ann.content) {
                    context.fillStyle = ann.color || '#000000';
                    context.font = `bold ${(ann.fontSize || 16) * (zoom * 1.5)}px Arial`;
                    context.textBaseline = 'top';
                    context.fillText(ann.content, finalX, finalY);
                } else if (ann.type === 'shape') {
                    context.strokeStyle = ann.color || '#ef4444';
                    context.lineWidth = 2 * (zoom * 1.5);
                    if (ann.shapeType === 'rect') {
                        context.strokeRect(finalX, finalY, finalW, finalH);
                    }
                } else if (ann.type === 'image' && ann.content) {
                    const img = new Image();
                    img.src = ann.content;
                    context.drawImage(img, finalX, finalY, finalW, finalH);
                }

                if (isSelected) {
                    context.strokeStyle = '#6366f1';
                    context.lineWidth = 2;
                    context.setLineDash([5, 5]);
                    context.strokeRect(finalX - 4, finalY - 4, finalW + 8, finalH + 8);
                }
                context.restore();
            }
        };
        renderPage();
    }, [pdfInstance, currentPage, zoom, annotations, selectedId, activeTool, detectedText]);

    const handleCanvasClick = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        // Calculate correctly based on the displayed size vs original canvas size
        const scaleX = canvasRef.current!.width / rect.width;
        const scaleY = canvasRef.current!.height / rect.height;

        const clickX = (e.clientX - rect.left) * scaleX / (zoom * 1.5);
        const clickY = (e.clientY - rect.top) * scaleY / (zoom * 1.5);

        if (activeTool === 'smart-edit') {
            // Find text that contains the click point
            const found = detectedText.find(t =>
                clickX >= t.x && clickX <= t.x + t.w &&
                clickY >= t.y && clickY <= t.y + t.h
            );

            if (found) {
                const newAnn: Annotation = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'text',
                    page: currentPage,
                    x: found.x,
                    y: found.y,
                    width: found.w,
                    height: found.h,
                    content: found.str,
                    color: '#000000',
                    fontSize: found.fontSize,
                    bgEnabled: true,
                    bgColor: '#ffffff'
                };
                setAnnotations([...annotations, newAnn]);
                setSelectedId(newAnn.id);
                setActiveTool('select');
                return;
            }
        }

        if (activeTool === 'select') {
            const found = [...annotations].reverse().find(a =>
                a.page === currentPage &&
                clickX >= a.x && clickX <= a.x + (a.width || 100) &&
                clickY >= a.y && clickY <= a.y + (a.height || 20)
            );
            setSelectedId(found ? found.id : null);
            return;
        }

        if (activeTool === 'image') {
            imageInputRef.current?.click();
            // We'll set the position in handleImageUpload or just place it at clickX, clickY
            // Let's store the click position temporarily
            (window as any).lastClickX = clickX;
            (window as any).lastClickY = clickY;
            return;
        }

        if (activeTool === 'text' || activeTool === 'shape') {
            const newAnn: Annotation = {
                id: Math.random().toString(36).substr(2, 9),
                type: activeTool as AnnotationType,
                page: currentPage,
                x: clickX,
                y: clickY,
                content: activeTool === 'text' ? 'New Annotation' : undefined,
                color: activeTool === 'text' ? '#000000' : '#ef4444',
                fontSize: 16,
                shapeType: 'rect',
                width: activeTool === 'shape' ? 100 : 150,
                height: activeTool === 'shape' ? 100 : 20,
                bgEnabled: false,
                bgColor: '#ffffff'
            };

            setAnnotations([...annotations, newAnn]);
            setSelectedId(newAnn.id);
            setActiveTool('select');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target?.result as string;
            const newAnn: Annotation = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'image',
                page: currentPage,
                x: (window as any).lastClickX || 50,
                y: (window as any).lastClickY || 50,
                width: 200,
                height: 200,
                content: imageData
            };
            setAnnotations([...annotations, newAnn]);
            setSelectedId(newAnn.id);
            setActiveTool('select');
            // Clean up
            delete (window as any).lastClickX;
            delete (window as any).lastClickY;
        };
        reader.readAsDataURL(file);
    };

    const saveEditedPdf = async () => {
        if (!file || !pdfInstance) return;
        setIsSaving(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            for (const ann of annotations) {
                const page = pdfDoc.getPages()[ann.page - 1];
                const { width: pW, height: pH } = page.getSize();

                const pdfPage = await pdfInstance.getPage(ann.page);
                const viewport = pdfPage.getViewport({ scale: 1 });

                // Maps from Editor Canvas space (zoom*1.5) to PDF coordinate system (bottom-left)
                const ratioX = pW / viewport.width;
                const ratioY = pH / viewport.height;

                const pdfX = ann.x * ratioX;
                // PDF.js Y is top-down in viewport, but PDF coordinate system is bottom-up
                const pdfY = pH - (ann.y * ratioY);

                if (ann.bgEnabled) {
                    const hex = (ann.bgColor || '#ffffff').replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16) / 255;
                    const g = parseInt(hex.substr(2, 2), 16) / 255;
                    const b = parseInt(hex.substr(4, 2), 16) / 255;

                    page.drawRectangle({
                        x: pdfX,
                        y: pdfY - ((ann.height || 20) * ratioY),
                        width: (ann.width || 100) * ratioX,
                        height: (ann.height || 20) * ratioY,
                        color: rgb(r, g, b),
                    });
                }

                if (ann.type === 'text' && ann.content) {
                    const hex = (ann.color || '#000000').replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16) / 255;
                    const g = parseInt(hex.substr(2, 2), 16) / 255;
                    const b = parseInt(hex.substr(4, 2), 16) / 255;

                    page.drawText(ann.content, {
                        x: pdfX,
                        y: pdfY - (ann.fontSize || 16) * ratioY,
                        size: (ann.fontSize || 16) * ratioY,
                        font: font,
                        color: rgb(r, g, b),
                    });
                } else if (ann.type === 'image' && ann.content) {
                    const imageBytes = ann.content.split(',')[1];
                    const format = ann.content.split(';')[0].split('/')[1];
                    const imageBuffer = Buffer.from(imageBytes, 'base64');
                    const pdfImage = format.includes('png') ? await pdfDoc.embedPng(imageBuffer) : await pdfDoc.embedJpg(imageBuffer);

                    page.drawImage(pdfImage, {
                        x: pdfX,
                        y: pdfY - ((ann.height || 200) * ratioY),
                        width: (ann.width || 200) * ratioX,
                        height: (ann.height || 200) * ratioY,
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            downloadFile(new Blob([pdfBytes as any]), `edited-${file.name}`, 'application/pdf');
        } catch (err) {
            console.error(err);
            alert('Export failed.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ToolLayout
            title="Industrial PDF Editor"
            description="High-immersion workspace with smart content rewriting capabilities."
            toolId="edit-pdf"
            fullWidth={true}
        >
            <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-900 overflow-hidden border-t border-slate-800 shadow-2xl">
                {!file ? (
                    <div className="flex-1 flex items-center justify-center p-12 bg-slate-950/50 backdrop-blur-3xl">
                        <FileUpload
                            onFileSelect={(files) => setFile(files[0])}
                            accept=".pdf"
                            label="Immersion Mode: Drop PDF to start"
                            icon="🌌"
                        />
                    </div>
                ) : (
                    <>
                        {/* Top Dashboard: Photopea Style */}
                        <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 z-30">
                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-900 rounded-xl p-1 gap-1 border border-slate-800">
                                    <ToolbarButton
                                        icon={<MousePointer2 size={16} />}
                                        active={activeTool === 'select'}
                                        onClick={() => setActiveTool('select')}
                                        title="Selection (V)"
                                    />
                                    <ToolbarButton
                                        icon={<TextCursor size={16} />}
                                        active={activeTool === 'smart-edit'}
                                        onClick={() => setActiveTool('smart-edit')}
                                        title="Smart Rewrite (E)"
                                    />
                                    <ToolbarButton
                                        icon={<Type size={16} />}
                                        active={activeTool === 'text'}
                                        onClick={() => setActiveTool('text')}
                                        title="Text Layer (T)"
                                    />
                                    <ToolbarButton
                                        icon={<Square size={16} />}
                                        active={activeTool === 'shape'}
                                        onClick={() => setActiveTool('shape')}
                                        title="Shape (U)"
                                    />
                                    <ToolbarButton
                                        icon={<ImageIcon size={16} />}
                                        active={activeTool === 'image'}
                                        onClick={() => setActiveTool('image')}
                                        title="Place Image (I)"
                                    />
                                </div>
                                <div className="h-6 w-px bg-slate-800 mx-2" />
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
                                    <button
                                        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                                        className={`p-2 rounded-lg transition-colors ${leftSidebarOpen ? 'text-indigo-400 bg-indigo-500/10' : 'hover:bg-slate-900'}`}
                                    >
                                        <Layers size={14} />
                                    </button>
                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                    <button
                                        onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                                        className={`p-2 rounded-lg transition-colors ${rightSidebarOpen ? 'text-indigo-400 bg-indigo-500/10' : 'hover:bg-slate-900'}`}
                                    >
                                        <Settings2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800">
                                    <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"><ZoomOut size={14} /></button>
                                    <span className="text-[10px] font-black w-10 text-center text-slate-300">{Math.round(zoom * 100)}%</span>
                                    <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"><ZoomIn size={14} /></button>
                                </div>
                                <button
                                    onClick={saveEditedPdf}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    <Download size={14} />
                                    {isSaving ? 'EXPORTING...' : 'EXPORT PDF'}
                                </button>
                            </div>
                        </div>

                        {/* Main Interaction Area */}
                        <div className="flex-1 flex overflow-hidden relative">
                            {/* Left Panel: Navigation */}
                            {leftSidebarOpen && (
                                <div className="w-56 bg-slate-950 border-r border-slate-800 flex flex-col p-4 gap-4 animate-in slide-in-from-left duration-300">
                                    <h4 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Document Pages</h4>
                                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                                        {previewImages.map((src, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`relative w-full rounded-xl overflow-hidden border-2 transition-all ${currentPage === i + 1 ? 'border-indigo-500 bg-slate-900 scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            >
                                                <img src={src} className="w-full h-auto grayscale-[0.5] hover:grayscale-0" alt={`Page ${i + 1}`} />
                                                <div className="absolute bottom-1 right-2 text-[8px] font-black text-white bg-black/60 px-1.5 rounded-md">{i + 1}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Center Workspace: Expansive Canvas */}
                            <div className="flex-1 bg-[#1a1a1a] relative overflow-auto scrollbar-thin scrollbar-thumb-slate-800 flex justify-center items-start p-20">
                                <div className="relative shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]">
                                    {activeTool === 'smart-edit' && (
                                        <div className="absolute -top-12 left-0 right-0 text-center animate-bounce">
                                            <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl ring-2 ring-indigo-400">CLICK ANY TEXT TO REWRITE</span>
                                        </div>
                                    )}
                                    <div className="bg-white relative">
                                        <canvas
                                            ref={canvasRef}
                                            onClick={handleCanvasClick}
                                            className={`max-w-none transition-transform duration-200 ${activeTool !== 'select' ? 'cursor-crosshair' : 'cursor-default'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Properties */}
                            {rightSidebarOpen && (
                                <div className="w-72 bg-slate-950 border-l border-slate-800 p-6 space-y-8 animate-in slide-in-from-right duration-300">
                                    {selectedId ? (
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Layer Inspector</h3>
                                                <button onClick={() => { setAnnotations(annotations.filter(a => a.id !== selectedId)); setSelectedId(null); }} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 active:scale-95 transition-all"><Trash2 size={14} /></button>
                                            </div>

                                            {annotations.find(a => a.id === selectedId)?.type === 'text' && (
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Content</label>
                                                        <textarea
                                                            value={annotations.find(a => a.id === selectedId)?.content}
                                                            onChange={(e) => setAnnotations(annotations.map(a => a.id === selectedId ? { ...a, content: e.target.value } : a))}
                                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 resize-none h-32 focus:ring-1 focus:ring-indigo-500 outline-none"
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                                                        <span className="text-[9px] font-black text-slate-500 uppercase">Hide Original</span>
                                                        <button
                                                            onClick={() => setAnnotations(annotations.map(a => a.id === selectedId ? { ...a, bgEnabled: !a.bgEnabled } : a))}
                                                            className={`w-10 h-5 rounded-full transition-all flex items-center p-1 ${annotations.find(a => a.id === selectedId)?.bgEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'}`}
                                                        >
                                                            <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Size: {annotations.find(a => a.id === selectedId)?.fontSize}px</label>
                                                        <input
                                                            type="range" min="6" max="120"
                                                            value={annotations.find(a => a.id === selectedId)?.fontSize}
                                                            onChange={(e) => setAnnotations(annotations.map(a => a.id === selectedId ? { ...a, fontSize: parseInt(e.target.value) } : a))}
                                                            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                                        />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Layer Color</label>
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {PDF_EDITOR_COLORS.map(c => (
                                                                <button
                                                                    key={c}
                                                                    onClick={() => setAnnotations(annotations.map(a => a.id === selectedId ? { ...a, color: c } : a))}
                                                                    className={`aspect-square rounded-lg border-2 transition-all ${annotations.find(a => a.id === selectedId)?.color === c ? 'border-white bg-indigo-500' : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'}`}
                                                                    style={{ backgroundColor: c }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <button onClick={() => setSelectedId(null)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black border border-slate-800 transition-all uppercase tracking-widest">Deselect Layer</button>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                            <Maximize2 size={32} className="mb-4 text-slate-700" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Viewport Standby</h4>
                                            <p className="text-[10px] mt-2 text-slate-500 leading-relaxed uppercase">Select an element or use <br /><b>Smart Rewrite</b> to modify text</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Status Bar */}
                        <div className="h-8 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Mode: {activeTool.replace('-', ' ')}</span>
                                <span className="text-[8px] font-black text-indigo-500/60 uppercase tracking-widest">Smart Detect Active</span>
                            </div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                        </div>
                    </>
                )}
            </div>
        </ToolLayout >
    );
}

function ToolbarButton({ icon, active, onClick, title }: any) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2.5 rounded-lg transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-xl scale-105 ring-1 ring-indigo-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}
        >
            {icon}
        </button>
    );
}
