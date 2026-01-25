import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const text = formData.get('text') as string;
        const size = parseInt(formData.get('size') as string) || 50;
        const opacity = parseFloat(formData.get('opacity') as string) || 0.5;
        // Assuming color passed as simple RGB object string or separate fields, keeping it simple grayscale for now or default
        // Or we can parse r,g,b from formData if UI sends it.

        if (!file || !text) {
            return NextResponse.json({ error: 'File and text required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        const { addWatermark } = await import('@/lib/engines/pdfEngine');
        const pdfWithWatermark = await addWatermark(buffer, text, { size, opacity });

        return new NextResponse(Buffer.from(pdfWithWatermark), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=watermarked.pdf',
            },
        });
    } catch (error) {
        console.error('Watermark PDF Error:', error);
        return NextResponse.json({ error: 'Failed to add watermark' }, { status: 500 });
    }
}
