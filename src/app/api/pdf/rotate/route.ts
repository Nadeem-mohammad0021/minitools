import { rotatePDF } from '@/lib/engines/pdfEngine';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const rotation = parseInt(formData.get('rotation') as string) || 0; // 90, 180, 270

        if (!file) return NextResponse.json({ error: 'File required' }, { status: 400 });

        const buffer = await file.arrayBuffer();

        // Import engine
        const { rotatePDF } = await import('@/lib/engines/pdfEngine');
        const rotatedPdf = await rotatePDF(buffer, rotation);

        return new NextResponse(Buffer.from(rotatedPdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=rotated.pdf',
            },
        });
    } catch (error) {
        console.error('Rotate PDF Error:', error);
        return NextResponse.json({ error: 'Failed to rotate PDF' }, { status: 500 });
    }
}
