import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const password = formData.get('password') as string;

        if (!file || !password) {
            return NextResponse.json({ error: 'File and password required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        const { lockPDF } = await import('@/lib/engines/pdfEngine');
        const lockedPdf = await lockPDF(buffer, password);

        return new NextResponse(Buffer.from(lockedPdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=protected-document.pdf',
            },
        });
    } catch (error) {
        console.error('Lock PDF Error:', error);
        return NextResponse.json({ error: 'Failed to lock PDF' }, { status: 500 });
    }
}
