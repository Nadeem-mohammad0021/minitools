import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        // Use pdfjs-dist for text extraction
        let textContent = '';
        try {
            // In Node.js environment (Next.js API route), we use the legacy build for better compatibility
            // and we don't necessarily need a worker if we load it this way.
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

            // Disable worker for simpler Node.js usage
            const loadingTask = pdfjs.getDocument({
                data: new Uint8Array(buffer),
                useWorkerFetch: false,
                isEvalSupported: false,
                useSystemFonts: true
            });

            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContentDict = await page.getTextContent();
                const pageText = textContentDict.items
                    .map((item: any) => item.str)
                    .join(' ');
                textContent += `Page ${i}\n${'-'.repeat(20)}\n${pageText}\n\n`;
            }
        } catch (pdfError) {
            console.error('PDF parsing failed:', pdfError);
            return NextResponse.json({ error: 'Failed to parse PDF content' }, { status: 500 });
        }

        // Create DOCX
        const paragraphs = textContent
            .split(/\n+/)
            .filter((line: string) => line.trim().length > 0)
            .map((line: string) => new Paragraph({
                children: [
                    new TextRun({
                        text: line.trim(),
                        size: 24, // 12pt
                    }),
                ],
                spacing: {
                    after: 200,
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
                'Content-Disposition': `attachment; filename="converted-${file.name.replace('.pdf', '')}.docx"`,
            },
        });
    } catch (error) {
        console.error('PDF to Word Error:', error);
        return NextResponse.json({ error: 'Failed to convert PDF to Word' }, { status: 500 });
    }
}
