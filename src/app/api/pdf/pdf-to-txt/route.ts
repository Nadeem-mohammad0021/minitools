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
            // Import pdfjs-dist legacy for Node environment compatibility
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

            const typedArray = new Uint8Array(buffer);
            const loadingTask = pdfjs.getDocument({
                data: typedArray,
                useSystemFonts: true,
                disableFontFace: false,
                isEvalSupported: false
            });

            const pdf = await loadingTask.promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textDict = await page.getTextContent();
                const items = textDict.items as any[];

                // Group by Y to find rows, then sort by X to preserve layout
                const rows: { [key: number]: any[] } = {};
                items.forEach(item => {
                    const y = Math.round(item.transform[5]);
                    if (!rows[y]) rows[y] = [];
                    rows[y].push(item);
                });

                const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a);
                let pageText = "";

                sortedY.forEach(y => {
                    const rowItems = rows[y].sort((a, b) => a.transform[4] - b.transform[4]);
                    pageText += rowItems.map(item => item.str).join(' ') + "\n";
                });

                textContent += `--- Page ${i} ---\n${pageText}\n\n`;
            }
        } catch (pdfError: any) {
            console.error('PDF parsing failed:', pdfError);
            return NextResponse.json({ error: `Failed to extract text: ${pdfError.message}` }, { status: 500 });
        }

        return NextResponse.json({ text: textContent });
    } catch (error: any) {
        console.error('PDF to TXT Error:', error);
        return NextResponse.json({ error: `Failed to process PDF: ${error.message}` }, { status: 500 });
    }
}
