import { mergePDF } from '@/lib/engines/pdfEngine';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
    const mergedPdf = await mergePDF(buffers);

    // Return as a downloadable file
    return new NextResponse(Buffer.from(mergedPdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=merged.pdf',
      },
    });
  } catch (error) {
    console.error('Merge PDF Error:', error);
    return NextResponse.json({ error: 'Failed to merge PDFs' }, { status: 500 });
  }
}