import { NextRequest, NextResponse } from 'next/server';
import { utils, write } from 'xlsx';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const outputFormat = (formData.get('format') as string) || 'xlsx';

        if (!file) {
            return NextResponse.json({ error: 'File required' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const dataRows: string[][] = [];

        try {
            // Import pdfjs-dist legacy for Node environment compatibility
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

            const loadingTask = pdfjs.getDocument({
                data: new Uint8Array(buffer),
                useSystemFonts: true,
                disableFontFace: false,
                isEvalSupported: false
            });

            const pdf = await loadingTask.promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContentDict = await page.getTextContent();
                const items = textContentDict.items as any[];

                // Group items by Y coordinate with a small threshold for slightly misaligned text
                const rows: { [key: number]: any[] } = {};
                const threshold = 5; // Pixels

                items.forEach(item => {
                    const y = Math.round(item.transform[5]);
                    let foundKey = Object.keys(rows).find(key => Math.abs(Number(key) - y) < threshold);

                    if (!foundKey) {
                        rows[y] = [];
                        foundKey = y.toString();
                    }
                    rows[Number(foundKey)].push(item);
                });

                // Sort rows by Y (top down)
                const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a);

                sortedY.forEach(y => {
                    // Sort items in row by X (left to right)
                    const rowItems = rows[y].sort((a, b) => a.transform[4] - b.transform[4]);
                    dataRows.push(rowItems.map(item => item.str.trim()).filter(Boolean));
                });

                if (i < pdf.numPages) {
                    dataRows.push(['--- PAGE SEPARATOR ---']);
                }
            }
        } catch (pdfError: any) {
            console.error('PDF parsing failed:', pdfError);
            return NextResponse.json({ error: `Failed to parse PDF: ${pdfError.message}` }, { status: 500 });
        }

        // Create professional Excel Workbook
        const worksheet = utils.aoa_to_sheet(dataRows);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Extracted Data");

        const excelBuffer = write(workbook, { type: 'buffer', bookType: outputFormat as any });

        const contentTypes = {
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xls: 'application/vnd.ms-excel',
            csv: 'text/csv',
        };

        return new NextResponse(excelBuffer as any, {
            headers: {
                'Content-Type': contentTypes[outputFormat as keyof typeof contentTypes] || contentTypes.xlsx,
                'Content-Disposition': `attachment; filename="converted-${file.name.replace('.pdf', '')}.${outputFormat}"`,
            },
        });
    } catch (error: any) {
        console.error('PDF to Excel Error:', error);
        return NextResponse.json({ error: `Failed to convert to Excel: ${error.message}` }, { status: 500 });
    }
}
