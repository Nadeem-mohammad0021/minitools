import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const quality = formData.get('quality') as string || 'medium';

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        const { compressPDF } = await import('@/lib/engines/pdfEngine');
        const compressedPdf = await compressPDF(buffer, quality as any);

        return new NextResponse(Buffer.from(compressedPdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="compressed-${file.name}"`,
            },
        });
    } catch (error) {
        console.error('Compress PDF Error:', error);
        return NextResponse.json({ error: 'Failed to compress PDF' }, { status: 500 });
    }
}
