import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const format = (formData.get('format') as string) || 'docx';

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        // Use pdfjs-dist for high-quality text extraction
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
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textDict = await page.getTextContent();

                // Advanced sorting to preserve layout
                const items = textDict.items as any[];

                // Group by Y to find rows, then sort by X
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

                textContent += pageText + "\n\n";
            }
        } catch (pdfError: any) {
            console.error('PDF parsing failed:', pdfError);
            return NextResponse.json({ error: `Failed to extract text: ${pdfError.message}` }, { status: 500 });
        }

        // Create professional DOCX structure
        const paragraphs = textContent
            .split(/\n+/)
            .filter(line => line.trim().length > 0)
            .map((line: string) => new Paragraph({
                children: [
                    new TextRun({
                        text: line.trim(),
                        size: 24, // 12pt
                    }),
                ],
                spacing: {
                    after: 120,
                    line: 360, // 1.5 line spacing
                }
            }));

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs,
            }],
        });

        const docxBuffer = await Packer.toBuffer(doc);

        return new NextResponse(docxBuffer as any, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="converted-${file.name.replace('.pdf', '')}.${format}"`,
            },
        });
    } catch (error: any) {
        console.error('PDF to Word Error:', error);
        return NextResponse.json({ error: `Failed to convert PDF: ${error.message}` }, { status: 500 });
    }
}
