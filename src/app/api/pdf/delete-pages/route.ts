import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const pagesJson = formData.get('pages') as string;

        if (!file || !pagesJson) {
            return NextResponse.json({ error: 'File and pages required' }, { status: 400 });
        }

        const pagesToRemove = JSON.parse(pagesJson); // Array of 0-based indices
        const buffer = await file.arrayBuffer();

        const { deletePDFPages } = await import('@/lib/engines/pdfEngine');
        const newPdf = await deletePDFPages(buffer, pagesToRemove);

        return new NextResponse(Buffer.from(newPdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=modified.pdf',
            },
        });
    } catch (error) {
        console.error('Delete Pages Error:', error);
        return NextResponse.json({ error: 'Failed to delete pages' }, { status: 500 });
    }
}
