import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const quality = parseInt(formData.get('quality') as string || '80');
        const format = formData.get('format') as string || 'webp';

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        let processor = sharp(buffer);

        // Map quality/format to sharp options
        if (format === 'jpeg' || format === 'jpg') {
            processor = processor.jpeg({ quality, mozjpeg: true });
        } else if (format === 'png') {
            // PNG is lossless but can be optimized
            processor = processor.png({ quality, compressionLevel: 9 });
        } else {
            // default to webp
            processor = processor.webp({ quality, effort: 6 });
        }

        const outputBuffer = await processor.toBuffer();

        const ext = format === 'jpeg' || format === 'jpg' ? 'jpg' : format;

        return new NextResponse(new Uint8Array(outputBuffer) as any, {
            headers: {
                'Content-Type': `image/${format}`,
                'Content-Disposition': `attachment; filename="compressed-${file.name.split('.')[0]}.${ext}"`,
            },
        });
    } catch (error) {
        console.error('Image Compression Error:', error);
        return NextResponse.json({ error: 'Failed to compress image' }, { status: 500 });
    }
}
