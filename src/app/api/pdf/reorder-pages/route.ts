import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const orderJson = formData.get('order') as string;

        if (!file || !orderJson) {
            return NextResponse.json({ error: 'File and order required' }, { status: 400 });
        }

        const newOrder = JSON.parse(orderJson); // Array of 0-based indices
        const buffer = await file.arrayBuffer();

        const { reorderPDFPages } = await import('@/lib/engines/pdfEngine');
        const newPdf = await reorderPDFPages(buffer, newOrder);

        return new NextResponse(Buffer.from(newPdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=reordered.pdf',
            },
        });
    } catch (error) {
        console.error('Reorder Pages Error:', error);
        return NextResponse.json({ error: 'Failed to reorder pages' }, { status: 500 });
    }
}
