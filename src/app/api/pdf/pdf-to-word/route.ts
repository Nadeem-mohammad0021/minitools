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
            const pdfjs = await import('pdfjs-dist');
            
            // Set up the worker for server environments
            const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
            pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
            
            const typedArray = new Uint8Array(buffer);
            const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
            const numPages = pdf.numPages;
            
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContentDict = await page.getTextContent();
                const pageText = textContentDict.items.map((item: any) => item.str).join(' ');
                textContent += `Page ${i}
${'-'.repeat(20)}
${pageText}

`;
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
