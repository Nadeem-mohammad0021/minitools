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

        const { unlockPDF } = await import('@/lib/engines/pdfEngine');

        try {
            const unlockedPdf = await unlockPDF(buffer, password);
            return new NextResponse(Buffer.from(unlockedPdf), {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=unlocked-document.pdf',
                },
            });
        } catch (e) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }

    } catch (error) {
        console.error('Unlock PDF Error:', error);
        return NextResponse.json({ error: 'Failed to unlock PDF' }, { status: 500 });
    }
}
