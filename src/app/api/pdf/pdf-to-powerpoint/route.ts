import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const layout = (formData.get('layout') as string) || 'LAYOUT_WIDE';

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        try {
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
            const loadingTask = pdfjs.getDocument({
                data: new Uint8Array(buffer),
                useWorkerFetch: false,
                isEvalSupported: false,
                useSystemFonts: true
            });

            const pdf = await loadingTask.promise;
            
            // Extract content from each page
            const slides = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContentDict = await page.getTextContent();
                const pageText = textContentDict.items.map((item: any) => item.str).join(' ');
                
                // Simple heuristic to identify titles (first line if it's short)
                const lines = pageText.split(/[.!?]\s+/).filter(line => line.trim());
                let title = '';
                if (lines.length > 0 && lines[0].length < 100) {
                    title = lines[0];
                } else {
                    title = `Slide ${i}`;
                }
                
                // Create slide content
                const content = lines.slice(title !== `Slide ${i}` ? 1 : 0).join('. ').substring(0, 1000);
                
                slides.push({
                    title,
                    content,
                });
            }
            
            // For now, return JSON representation of slides
            // In a real implementation, we would use pptxgenjs to create actual PPTX
            return NextResponse.json({
                slides,
                metadata: {
                    fileName: file.name,
                    totalPages: pdf.numPages,
                    layout: layout,
                    note: 'In a full implementation, this would return an actual PPTX file using pptxgenjs'
                }
            });
        } catch (pdfError) {
            console.error('PDF parsing failed:', pdfError);
            return NextResponse.json({ error: 'Failed to parse PDF content' }, { status: 500 });
        }
    } catch (error) {
        console.error('PDF to PPT Error:', error);
        return NextResponse.json({ error: 'Failed to convert PDF to PPT' }, { status: 500 });
    }
}
