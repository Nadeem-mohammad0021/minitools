import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const position = (formData.get('position') as 'bottom-center' | 'bottom-right') || 'bottom-right';

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        const { addPageNumbers } = await import('@/lib/engines/pdfEngine');
        const pdfWithNumbers = await addPageNumbers(buffer, position);

        return new NextResponse(Buffer.from(pdfWithNumbers), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=numbered.pdf',
            },
        });
    } catch (error) {
        console.error('Page Numbers PDF Error:', error);
        return NextResponse.json({ error: 'Failed to add page numbers' }, { status: 500 });
    }
}
