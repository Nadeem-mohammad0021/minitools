import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        
        const { getPDFInfo } = await import('@/lib/engines/pdfEngine');
        const info = await getPDFInfo(buffer);

        return NextResponse.json({
            pageCount: info.pageCount,
            title: info.title,
            author: info.author,
            subject: info.subject,
            creator: info.creator,
            keywords: info.keywords,
            producer: info.producer,
            creationDate: info.creationDate,
            modificationDate: info.modificationDate,
        });
    } catch (error) {
        console.error('PDF Metadata Error:', error);
        return NextResponse.json({ error: 'Failed to get PDF metadata' }, { status: 500 });
    }
}