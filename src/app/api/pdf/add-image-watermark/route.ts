import { NextRequest, NextResponse } from 'next/server';
import { addImageWatermark } from '@/lib/engines/pdfEngine';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const watermark = formData.get('watermark') as File;
        const opacity = parseFloat(formData.get('opacity') as string || '0.5');
        const rotation = parseInt(formData.get('rotation') as string || '0');
        const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
        const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;

        if (!file || !watermark) {
            return NextResponse.json({ error: 'File and watermark image required' }, { status: 400 });
        }

        const fileBuffer = await file.arrayBuffer();
        const watermarkBuffer = await watermark.arrayBuffer();

        const result = await addImageWatermark(fileBuffer, watermarkBuffer, {
            opacity,
            rotation,
            width,
            height
        });

        return new NextResponse(Buffer.from(result), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="watermarked-${file.name}"`,
            },
        });
    } catch (error) {
        console.error('Image Watermark Error:', error);
        return NextResponse.json({ error: 'Failed to add image watermark' }, { status: 500 });
    }
}
