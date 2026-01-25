import { NextRequest, NextResponse } from 'next/server';
import { minify as terserMinify } from 'terser';
import { minify as cssoMinify } from 'csso';

export async function POST(req: NextRequest) {
    try {
        const { code, language } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Code content required' }, { status: 400 });
        }

        let minifiedCode = '';

        if (language === 'javascript' || language === 'js') {
            const result = await terserMinify(code, {
                compress: true,
                mangle: true,
                format: {
                    comments: false
                }
            });
            minifiedCode = result.code || '';
        } else if (language === 'css') {
            const result = cssoMinify(code);
            minifiedCode = result.css;
        } else {
            return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
        }

        return NextResponse.json({ minified: minifiedCode });
    } catch (error: any) {
        console.error('Minification Error:', error);
        return NextResponse.json({ error: 'Failed to minify code. Please check for syntax errors.' }, { status: 500 });
    }
}
