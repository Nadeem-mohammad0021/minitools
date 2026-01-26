'use client';

import { useState, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';

const QrCodeGeneratorTool = () => {
  const [text, setText] = useState<string>('https://kynex.dev');
  const [size, setSize] = useState<number>(512);
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(80);
  const [removeBg, setRemoveBg] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleLogoUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
  };

  const downloadQrCode = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  }, []);

  return (
    <ToolLayout title="QR Code Generator" description="Generate high-quality, customizable QR codes for your URLs, text, and documents." toolId="qr-gen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Configuration Section */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Text or URL</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-lg transition-all shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">QR Color</label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-transparent shadow-inner">
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer border-0 p-0" />
                  <span className="font-mono text-xs font-bold uppercase">{fgColor}</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Background</label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-transparent shadow-inner">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer border-0 p-0" />
                  <span className="font-mono text-xs font-bold uppercase">{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Size: {size}px</label>
              </div>
              <input type="range" min="128" max="1024" step="32" value={size} onChange={e => setSize(parseInt(e.target.value))} className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" />
            </div>

            {/* Logo Upload Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Logo Image</label>
                {logo && (
                  <button
                    onClick={removeLogo}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {!logo ? (
                <FileUpload
                  onFileSelect={handleLogoUpload}
                  accept="image/*"
                  label="Upload Logo"
                  icon="🖼️"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div className="relative">
                    <img 
                      src={logoPreview!} 
                      alt="Logo preview" 
                      className="max-h-24 rounded-lg border-2 border-slate-200 dark:border-slate-700"
                    />
                    {removeBg && (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border-2 border-green-500/50 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded">BG Removed</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium truncate max-w-32">{logo.name}</p>
                    <p className="text-xs text-slate-500">{(logo.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}

              {logo && (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Logo Size: {logoSize}%</label>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="50" 
                      value={logoSize} 
                      onChange={e => setLogoSize(parseInt(e.target.value))} 
                      className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="remove-bg" 
                      checked={removeBg} 
                      onChange={(e) => setRemoveBg(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="remove-bg" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Remove background from logo
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => { 
              setText(''); 
              setFgColor('#000000'); 
              setBgColor('#ffffff'); 
              setLogo(null);
              setLogoPreview(null);
              setLogoSize(80);
              setRemoveBg(false);
            }}
            className="py-4 text-slate-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest transition-colors"
          >
            Clear Settings
          </button>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-10">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[40px] p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center aspect-square w-full max-w-[500px] shadow-inner relative group">
            <div className="relative z-10 p-6 bg-white rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105 border border-slate-100">
              <div className="relative">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={text || 'KYNEX'}
                  size={size > 400 ? 400 : size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={true}
                />
                
                {/* Logo overlay */}
                {logoPreview && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      backgroundImage: removeBg ? `url(${logoPreview})` : 'none',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!removeBg && (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain rounded"
                        style={{
                          width: `${logoSize}%`,
                          height: `${logoSize}%`,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={downloadQrCode}
            className="w-full max-w-[500px] py-6 bg-indigo-600 text-white rounded-[24px] font-bold text-xl uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:bg-indigo-700 active:scale-95"
          >
            Download QR Code
          </button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default QrCodeGeneratorTool;
