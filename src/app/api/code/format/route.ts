import { NextRequest, NextResponse } from 'next/server';
import prettier from 'prettier';

export async function POST(req: NextRequest) {
    try {
        const { code, parser } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Code content required' }, { status: 400 });
        }

        const formattedCode = await prettier.format(code, {
            parser: parser || 'babel',
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            trailingComma: 'es5',
            printWidth: 80,
        });

        return NextResponse.json({ formatted: formattedCode });
    } catch (error) {
        console.error('Formatting Error:', error);
        return NextResponse.json({ error: 'Failed to format code. Please check for syntax errors.' }, { status: 500 });
    }
}
