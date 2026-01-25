import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        // Extracting text and formatting it as a structured document that could be PPT-like
        let pptContent = `KYNEX PDF to Powerpoint Conversion\nFile: ${file.name}\n${'='.repeat(40)}\n\n`;

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

                pptContent += `SLIDE ${i}\n${'-'.repeat(20)}\n${pageText}\n\n`;
            }
        } catch (pdfError) {
            console.error('PDF parsing failed:', pdfError);
            return NextResponse.json({ error: 'Failed to parse PDF content' }, { status: 500 });
        }

        // Since we don't have a PPTX library installed, we'll return a structured text file for now
        // and suggest the user that we are working on the full PPTX binary generator.
        return new NextResponse(pptContent, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename="converted-slides-${file.name.replace('.pdf', '')}.txt"`,
            },
        });
    } catch (error) {
        console.error('PDF to PPT Error:', error);
        return NextResponse.json({ error: 'Failed to convert PDF to PPT' }, { status: 500 });
    }
}
