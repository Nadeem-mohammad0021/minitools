import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        let textContent = '';
        try {
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
            const loadingTask = pdfjs.getDocument({
                data: new Uint8Array(buffer),
                useWorkerFetch: false,
                isEvalSupported: false,
                useSystemFonts: true
            });

            const pdf = await loadingTask.promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContentDict = await page.getTextContent();
                const pageText = textContentDict.items.map((item: any) => item.str).join(' ');
                textContent += pageText + '\n\n';
            }
        } catch (pdfError) {
            console.error('PDF parsing failed:', pdfError);
            return NextResponse.json({ error: 'Failed to parse PDF content' }, { status: 500 });
        }

        return NextResponse.json({ text: textContent });
    } catch (error) {
        console.error('PDF to TXT Error:', error);
        return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
    }
}
