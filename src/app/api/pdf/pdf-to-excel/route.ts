import { NextRequest, NextResponse } from 'next/server';
import { utils, write } from 'xlsx';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        const dataRows: string[][] = [];
        try {
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
            const loadingTask = pdfjs.getDocument({
                data: new Uint8Array(buffer),
                useWorkerFetch: false,
                isEvalSupported: false,
                useSystemFonts: true
            });

            const pdf = await loadingTask.promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContentDict = await page.getTextContent();

                // Group items by their Y coordinate to form rows
                const items = textContentDict.items as any[];
                const rows: { [key: number]: any[] } = {};

                items.forEach(item => {
                    const y = Math.round(item.transform[5]);
                    if (!rows[y]) rows[y] = [];
                    rows[y].push(item);
                });

                // Sort rows by Y (top down) and items by X (left to right)
                const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a);
                sortedY.forEach(y => {
                    const sortedRow = rows[y].sort((a, b) => a.transform[4] - b.transform[4]);
                    dataRows.push(sortedRow.map(item => item.str));
                });
                dataRows.push(['--- PAGE SEPARATOR ---']);
            }
        } catch (pdfError) {
            console.error('PDF parsing failed:', pdfError);
            return NextResponse.json({ error: 'Failed to parse PDF content' }, { status: 500 });
        }

        // Create Excel Workbook
        const worksheet = utils.aoa_to_sheet(dataRows);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Extracted Data");

        const excelBuffer = write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return new NextResponse(excelBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename = "converted-${file.name.replace('.pdf', '')}.xlsx"`,
            },
        });
    } catch (error) {
        console.error('PDF to Excel Error:', error);
        return NextResponse.json({ error: 'Failed to convert PDF to Excel' }, { status: 500 });
    }
}
