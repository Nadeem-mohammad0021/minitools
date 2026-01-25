import { splitPDF } from '@/lib/engines/pdfEngine';
import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const rangesJson = formData.get('ranges') as string;

        if (!file || !rangesJson) {
            return NextResponse.json({ error: 'File and ranges required' }, { status: 400 });
        }

        const ranges = JSON.parse(rangesJson); // e.g., [[1, 2], [3, 5]]
        const buffer = await file.arrayBuffer();

        // Import the function dynamically or ensure it's exported
        const { splitPDF } = await import('@/lib/engines/pdfEngine');
        const pdfParts = await splitPDF(buffer, ranges);

        // If result is just one PDF, return it directly
        if (pdfParts.length === 1) {
            return new NextResponse(Buffer.from(pdfParts[0]), {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=split-document.pdf',
                },
            });
        }

        // If multiple, zip them
        const zip = new JSZip();
        pdfParts.forEach((part, index) => {
            zip.file(`split-${index + 1}.pdf`, part);
        });

        const zipContent = await zip.generateAsync({ type: 'blob' });

        return new NextResponse(zipContent, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename=split-documents.zip',
            },
        });
    } catch (error) {
        console.error('Split PDF Error:', error);
        return NextResponse.json({ error: 'Failed to split PDF' }, { status: 500 });
    }
}
