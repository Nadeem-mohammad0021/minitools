import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Files required' }, { status: 400 });
        }

        const buffers = await Promise.all(files.map(f => f.arrayBuffer()));
        const types = files.map(f => f.type);

        const { imagesToPDF } = await import('@/lib/engines/pdfEngine');
        const pdfBytes = await imagesToPDF(buffers, types);

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=images-converted.pdf',
            },
        });
    } catch (error) {
        console.error('Images to PDF Error:', error);
        return NextResponse.json({ error: 'Failed to convert images to PDF' }, { status: 500 });
    }
}
