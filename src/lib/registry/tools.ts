export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  tags?: string[];
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  component: string;
  path: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  order: number;
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  'pdf-tools': {
    id: 'pdf-tools',
    name: 'PDF Tools',
    icon: '📄',
    description: 'Merge, compress, split, and edit PDFs with ease.',
    color: 'red',
    order: 1
  },
  'image-tools': {
    id: 'image-tools',
    name: 'Image Tools',
    icon: '🖼️',
    description: 'Optimize, convert, and edit your images.',
    color: 'green',
    order: 2
  },
  'text-tools': {
    id: 'text-tools',
    name: 'Text Tools',
    icon: '✍️',
    description: 'Essential utilities for counting, formatting, and generating text.',
    color: 'blue',
    order: 3
  },
  'developer-tools': {
    id: 'developer-tools',
    name: 'Developer Tools',
    icon: '🧑‍💻',
    description: 'Handy tools for encoding, formatting, and hashing.',
    color: 'purple',
    order: 4
  },
  'seo-tools': {
    id: 'seo-tools',
    name: 'SEO Tools',
    icon: '🌐',
    description: 'Boost your search engine rankings with these utilities.',
    color: 'orange',
    order: 5
  },
  'file-converters': {
    id: 'file-converters',
    name: 'File & Converters',
    icon: '📁',
    description: 'Compress and convert various file formats.',
    color: 'yellow',
    order: 6
  },
  'web-misc-utilities': {
    id: 'web-misc-utilities',
    name: 'Web & Misc Utilities',
    icon: '📱',
    description: 'A collection of useful web tools and calculators.',
    color: 'cyan',
    order: 7
  }
};

export const TOOLS: ToolConfig[] = [
  // 1. PDF TOOLS
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document instantly. AI-optimized for perfect order.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'merge', 'combine', 'AI PDF', 'no upload', 'secure PDF'],
    popular: true,
    component: 'MergePdfTool',
    path: '/tools/merge'
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size without losing quality. High-ratio compression for 2026.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'compress', 'optimize', 'high compression', 'lossless PDF', 'small PDF'],
    popular: true,
    component: 'CompressPdfTool',
    path: '/tools/compress'
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract pages from a PDF file.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'split', 'extract'],
    component: 'SplitPdfTool',
    path: '/tools/split'
  },
  {
    id: 'lock',
    name: 'Lock PDF',
    description: 'Protect your PDF with a password.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'lock', 'protect', 'security'],
    component: 'LockPdfTool',
    path: '/tools/lock'
  },
  {
    id: 'unlock',
    name: 'Unlock PDF',
    description: 'Remove password protection from a PDF.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'unlock', 'security'],
    component: 'UnlockPdfTool',
    path: '/tools/unlock'
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to the correct orientation.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'rotate'],
    component: 'RotatePdfTool',
    path: '/tools/rotate'
  },
  {
    id: 'watermark',
    name: 'Add Watermark',
    description: 'Add text or images as watermarks to your PDF.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'watermark', 'protect'],
    component: 'AddWatermarkTool',
    path: '/tools/watermark'
  },
  {
    id: 'page-numbers',
    name: 'Add Page Numbers',
    description: 'Insert page numbers into your PDF document.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'page-numbers', 'organize'],
    component: 'AddPageNumbersTool',
    path: '/tools/page-numbers'
  },
  {
    id: 'delete-pages',
    name: 'Delete PDF Pages',
    description: 'Remove specific pages from your PDF file.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'delete', 'remove'],
    component: 'DeletePdfPagesTool',
    path: '/tools/delete-pages'
  },
  {
    id: 'reorder-pages',
    name: 'Reorder PDF Pages',
    description: 'Rearrange the order of pages in your PDF.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'reorder', 'organize'],
    component: 'ReorderPdfPagesTool',
    path: '/tools/reorder-pages'
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description: 'AI-powered PDF editor to modify text, images, and layout directly in your browser.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'edit', 'editor', 'AI editor', 'browser PDF editor', 'secure edit'],
    new: true,
    component: 'EditPdfTool',
    path: '/tools/edit-pdf'
  },
  {
    id: 'pdf-password',
    name: 'PDF Password Tool',
    description: 'Manage PDF password and security settings.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'password', 'security'],
    component: 'PdfPasswordTool',
    path: '/tools/pdf-password'
  },
  {
    id: 'pdf-metadata-viewer',
    name: 'PDF Metadata Viewer',
    description: 'View hidden metadata within PDF files.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'metadata', 'info'],
    component: 'PdfMetadataViewerTool',
    path: '/tools/pdf-metadata-viewer'
  },
  {
    id: 'pdf-thumbnail-generator',
    name: 'PDF Thumbnail Generator',
    description: 'Create high-quality preview images for PDF pages.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'thumbnail', 'preview'],
    component: 'PdfThumbnailGeneratorTool',
    path: '/tools/pdf-thumbnail-generator'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF to editable Word docx using AI OCR for highest accuracy.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'word', 'convert', 'AI OCR', 'PDF to DOCX', 'editable Word'],
    popular: true,
    component: 'PdfToWordTool',
    path: '/tools/pdf-to-word'
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Export PDF pages as JPG or PNG images.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'image', 'convert'],
    component: 'PdfToImageTool',
    path: '/tools/pdf-to-image'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images into a single PDF document.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['image', 'pdf', 'convert'],
    component: 'ImageToPdfTool',
    path: '/tools/image-to-pdf'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract tables from PDF to Excel spreadsheets.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'excel', 'convert'],
    component: 'PdfToExcelTool',
    path: '/tools/pdf-to-excel'
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    description: 'Convert PDF documents to PowerPoint slides.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'powerpoint', 'convert'],
    component: 'PdfToPowerpointTool',
    path: '/tools/pdf-to-powerpoint'
  },
  {
    id: 'pdf-to-txt',
    name: 'PDF to Text',
    description: 'Extract raw text from PDF files.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'text', 'convert'],
    component: 'PdfToTxtTool',
    path: '/tools/pdf-to-txt'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Microsoft Word files to PDF.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['word', 'pdf', 'convert'],
    component: 'WordToPdfTool',
    path: '/tools/word-to-pdf'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['excel', 'pdf', 'convert'],
    component: 'ExcelToPdfTool',
    path: '/tools/excel-to-pdf'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PowerPoint to PDF',
    description: 'Convert PowerPoint files to PDF.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['powerpoint', 'pdf', 'convert'],
    component: 'PptToPdfTool',
    path: '/tools/ppt-to-pdf'
  },
  {
    id: 'remove-pdf-restrictions',
    name: 'Remove PDF Restrictions',
    description: 'Unblock PDF files with permissions or restrictions.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'unlock', 'restrictions'],
    component: 'RemovePdfRestrictionsTool',
    path: '/tools/remove-pdf-restrictions'
  },
  {
    id: 'add-header-footer',
    name: 'Add Header & Footer',
    description: 'Add custom headers or footers to your PDF pages.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'header', 'footer'],
    component: 'AddHeaderFooterTool',
    path: '/tools/add-header-footer'
  },
  {
    id: 'add-image-watermark',
    name: 'Add Image Watermark',
    description: 'Add your logo or any image as a watermark to every page of your PDF.',
    category: 'pdf-tools',
    icon: '📄',
    tags: ['pdf', 'watermark', 'image', 'brand'],
    popular: true,
    component: 'AddImageWatermarkTool',
    path: '/tools/add-image-watermark'
  },

  // 2. IMAGE TOOLS
  {
    id: 'resize',
    name: 'Resize Image',
    description: 'Change the dimensions of your images.',
    category: 'image-tools',
    icon: '🖼️',
    tags: ['image', 'resize', 'scale'],
    component: 'ImageResizerTool',
    path: '/tools/resize'
  },
  {
    id: 'crop',
    name: 'Crop Image',
    description: 'Crop images to select a specific area.',
    category: 'image-tools',
    icon: '🖼️',
    tags: ['image', 'crop', 'trim'],
    component: 'CropImageTool',
    path: '/tools/crop'
  },
  {
    id: 'flip',
    name: 'Flip Image',
    description: 'Flip images horizontally or vertically.',
    category: 'image-tools',
    icon: '🖼️',
    tags: ['image', 'flip', 'mirror'],
    component: 'FlipImageTool',
    path: '/tools/flip'
  },
  {
    id: 'convert',
    name: 'Convert Image',
    description: 'Convert between different image formats.',
    category: 'image-tools',
    icon: '🖼️',
    tags: ['image', 'convert', 'format'],
    component: 'ConvertImageTool',
    path: '/tools/convert'
  },
  {
    id: 'image-metadata-viewer',
    name: 'Image Metadata Viewer',
    description: 'View EXIF and other image metadata.',
    category: 'image-tools',
    icon: '🖼️',
    tags: ['image', 'metadata', 'exif'],
    component: 'ImageMetadataViewerTool',
    path: '/tools/image-metadata-viewer'
  },
  {
    id: 'image-compress',
    name: 'Compress Image',
    description: 'Ultra-fast image optimization using Sharp. Supports WebP and AVIF 2026 formats.',
    category: 'image-tools',
    icon: '🖼️',
    tags: ['image', 'compress', 'optimize', 'WebP', 'AVIF', 'lossless compression'],
    popular: true,
    component: 'ImageCompressorTool',
    path: '/tools/image-compress'
  },
  {
    id: 'base64-to-image',
    name: 'Base64 to Image',
    description: 'Convert Base64 encoded strings to images.',
    category: 'image-tools',
    icon: '🖼️',
    tags: ['image', 'base64', 'convert'],
    component: 'Base64ToImageTool',
    path: '/tools/base64-to-image'
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'AI-powered background removal tool. Remove unwanted backgrounds from your images instantly.',
    category: 'image-tools',
    icon: '🖼️',
    tags: ['image', 'background', 'remove', 'AI background remover', 'transparent background', 'photo editing'],
    new: true,
    component: 'BackgroundRemoverTool',
    path: '/tools/background-remover'
  },

  // 3. TEXT TOOLS
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words and characters in your text.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'count', 'words'],
    popular: true,
    component: 'WordCounterTool',
    path: '/tools/word-counter'
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    description: 'Count the number of characters in your text.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'count', 'characters'],
    component: 'CharacterCounterTool',
    path: '/tools/character-counter'
  },
  {
    id: 'paragraph-counter',
    name: 'Paragraph Counter',
    description: 'Count the number of paragraphs in your text.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'count', 'paragraphs'],
    component: 'ParagraphCounterTool',
    path: '/tools/paragraph-counter'
  },
  {
    id: 'sentence-counter',
    name: 'Sentence Counter',
    description: 'Count the number of sentences in your text.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'count', 'sentences'],
    component: 'SentenceCounterTool',
    path: '/tools/sentence-counter'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to uppercase, lowercase, etc.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'case', 'format'],
    component: 'CaseConverterTool',
    path: '/tools/case-converter'
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    description: 'Generate placeholder text.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'generator', 'lorem-ipsum'],
    component: 'LoremIpsumGeneratorTool',
    path: '/tools/lorem-ipsum'
  },
  {
    id: 'remove-duplicates',
    name: 'Remove Duplicates',
    description: 'Remove duplicate lines from text.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'cleanup', 'duplicates'],
    component: 'RemoveDuplicatesTool',
    path: '/tools/remove-duplicates'
  },
  {
    id: 'remove-line-breaks',
    name: 'Remove Line Breaks',
    description: 'Remove line breaks from your text.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'cleanup', 'line-breaks'],
    component: 'RemoveLineBreaksTool',
    path: '/tools/remove-line-breaks'
  },
  {
    id: 'sort-lines',
    name: 'Sort Lines',
    description: 'Sort text lines alphabetically or numerically.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'sort'],
    component: 'TextSorterTool',
    path: '/tools/sort-lines'
  },
  {
    id: 'find-and-replace-text',
    name: 'Find & Replace',
    description: 'Fast find and replace text in your content.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'find', 'replace'],
    component: 'FindAndReplaceTextTool',
    path: '/tools/find-and-replace-text'
  },
  {
    id: 'random-text-generator',
    name: 'Random Text Generator',
    description: 'Generate random strings of text.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'random', 'generator'],
    component: 'RandomTextGeneratorTool',
    path: '/tools/random-text-generator'
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, random passwords.',
    category: 'text-tools',
    icon: '✍️',
    tags: ['text', 'password', 'random', 'security'],
    component: 'PasswordGeneratorTool',
    path: '/tools/password-generator'
  },

  // 4. DEVELOPER TOOLS
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Prettify and validate JSON data.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['json', 'formatter', 'dev'],
    popular: true,
    component: 'JsonFormatterValidatorTool',
    path: '/tools/json-formatter'
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Prettify and validate XML data.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['xml', 'formatter', 'dev'],
    component: 'XmlFormatterTool',
    path: '/tools/xml-formatter'
  },
  {
    id: 'base64',
    name: 'Base64 Tool',
    description: 'Encode or decode data in Base64 format.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['base64', 'dev'],
    component: 'Base64EncodeDecodeTool',
    path: '/tools/base64'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Secure WASM-powered MD5, SHA-1, SHA-256 generator. Privacy-focused hashing.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['hash', 'security', 'dev', 'WASM hash', 'SHA-256 online', 'secure hash'],
    component: 'HashGeneratorTool',
    path: '/tools/hash-generator'
  },
  {
    id: 'md5-generator',
    name: 'MD5 Generator',
    description: 'Generate MD5 cryptographic hashes.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['md5', 'hash', 'security'],
    component: 'Md5GeneratorTool',
    path: '/tools/md5-generator'
  },
  {
    id: 'sha1-generator',
    name: 'SHA1 Generator',
    description: 'Generate SHA1 hashes.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['sha1', 'hash', 'security'],
    component: 'Sha1GeneratorTool',
    path: '/tools/sha1-generator'
  },
  {
    id: 'sha256-generator',
    name: 'SHA256 Generator',
    description: 'Generate secure SHA256 hashes.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['sha256', 'hash', 'security'],
    component: 'Sha256GeneratorTool',
    path: '/tools/sha256-generator'
  },
  {
    id: 'file-hash-generator',
    name: 'File Hash Generator',
    description: 'Calculate cryptographic hashes for files.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['file', 'hash', 'security'],
    component: 'FileHashGeneratorTool',
    path: '/tools/file-hash-generator'
  },
  {
    id: 'url-encode-decode',
    name: 'URL Tool',
    description: 'Encode or decode URL strings.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['url', 'dev'],
    component: 'UrlEncodeDecodeTool',
    path: '/tools/url-encode-decode'
  },
  {
    id: 'html-encode-decode',
    name: 'HTML Tool',
    description: 'Encode or decode HTML entities.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['html', 'dev'],
    component: 'HtmlEncodeDecodeTool',
    path: '/tools/html-encode-decode'
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Compress CSS for smaller file sizes.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['css', 'minify', 'dev'],
    component: 'CssMinifierTool',
    path: '/tools/css-minifier'
  },
  {
    id: 'js-minifier',
    name: 'JS Minifier',
    description: 'Compress JavaScript for faster loading.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['js', 'minify', 'dev'],
    component: 'JsMinifierTool',
    path: '/tools/js-minifier'
  },
  {
    id: 'json-to-xml',
    name: 'JSON to XML',
    description: 'Convert JSON data to XML format.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['json', 'xml', 'convert'],
    component: 'JsonToXmlTool',
    path: '/tools/json-to-xml'
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON',
    description: 'Convert XML data to JSON format.',
    category: 'developer-tools',
    icon: '🧑‍💻',
    tags: ['xml', 'json', 'convert'],
    component: 'XmlToJsonTool',
    path: '/tools/xml-to-json'
  },

  // 5. SEO TOOLS
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    description: 'Create short, branded links with analytics. Branded link shortener 2026.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'url', 'links', 'branded shortener', 'free URL shortener'],
    component: 'UrlShortenerTool',
    path: '/tools/url-shortener'
  },
  {
    id: 'meta-tags-generator',
    name: 'Meta Tags',
    description: 'Generate SEO meta tags for your site.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'meta-tags'],
    component: 'MetaTagsGeneratorTool',
    path: '/tools/meta-tags-generator'
  },
  {
    id: 'url-slug-generator',
    name: 'URL Slug Generator',
    description: 'Create SEO-friendly URL slugs.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'slug'],
    component: 'UrlSlugGeneratorTool',
    path: '/tools/url-slug-generator'
  },
  {
    id: 'keyword-density-checker',
    name: 'Keyword Density',
    description: 'Analyze keyword frequency in your content.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'keyword'],
    component: 'KeywordDensityCheckerTool',
    path: '/tools/keyword-density-checker'
  },
  {
    id: 'serp-preview-tool',
    name: 'SERP Preview',
    description: 'Preview how your site appears in search results.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'serp', 'google'],
    component: 'SerpPreviewTool',
    path: '/tools/serp-preview-tool'
  },
  {
    id: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    description: 'Create robots.txt files for your website.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'robots'],
    component: 'RobotsTxtGeneratorTool',
    path: '/tools/robots-txt-generator'
  },
  {
    id: 'robots-txt-tester',
    name: 'Robots.txt Tester',
    description: 'Test and validate your robots.txt file.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'robots'],
    component: 'RobotsTxtTesterTool',
    path: '/tools/robots-txt-tester'
  },
  {
    id: 'xml-sitemap-generator',
    name: 'Sitemap Generator',
    description: 'Generate XML sitemaps for search engines.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'sitemap', 'xml'],
    component: 'XmlSitemapGeneratorTool',
    path: '/tools/xml-sitemap-generator'
  },
  {
    id: 'sitemap-validator',
    name: 'Sitemap Validator',
    description: 'Validate your XML sitemap for correctness.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'sitemap', 'validator'],
    component: 'SitemapValidatorTool',
    path: '/tools/sitemap-validator'
  },
  {
    id: 'heading-extractor',
    name: 'Heading Extractor',
    description: 'Extract H1, H2, H3 headings from any URL.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'headings', 'extractor'],
    component: 'HeadingExtractorTool',
    path: '/tools/heading-extractor'
  },
  {
    id: 'seo-page-analyzer-lite',
    name: 'SEO Analyzer',
    description: 'Core Web Vitals and GEO optimization check. Detailed on-page SEO assessment.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'analyzer', 'Core Web Vitals', 'GEO optimization', 'lighthouse audit'],
    component: 'SeoPageAnalyzerLiteTool',
    path: '/tools/seo-page-analyzer-lite'
  },
  {
    id: 'schema-markup',
    name: 'Schema Generator',
    description: 'JSON-LD structured data generator for Organizations, Websites, and Articles.',
    category: 'seo-tools',
    icon: '🌐',
    tags: ['seo', 'schema', 'json-ld', 'structured data', 'metadata'],
    new: true,
    component: 'SchemaMarkupGeneratorTool',
    path: '/tools/schema-markup'
  },

  // 6. FILE & CONVERTERS
  {
    id: 'zip-file-creator',
    name: 'ZIP Creator',
    description: 'Create ZIP archives from your files.',
    category: 'file-converters',
    icon: '📁',
    tags: ['file', 'zip', 'compress'],
    component: 'ZipFileCreatorTool',
    path: '/tools/zip-file-creator'
  },
  {
    id: 'unzip-files',
    name: 'Unzip Tool',
    description: 'Extract files from ZIP archives.',
    category: 'file-converters',
    icon: '📁',
    tags: ['file', 'unzip', 'zip'],
    component: 'UnzipFilesTool',
    path: '/tools/unzip-files'
  },
  {
    id: 'convert-csv-to-excel',
    name: 'CSV to Excel',
    description: 'Convert CSV data to Excel spreadsheets.',
    category: 'file-converters',
    icon: '📁',
    tags: ['file', 'convert', 'csv', 'excel'],
    component: 'CsvToExcelTool',
    path: '/tools/convert-csv-to-excel'
  },
  {
    id: 'excel-to-csv',
    name: 'Excel to CSV',
    description: 'Convert Excel files to CSV format.',
    category: 'file-converters',
    icon: '📁',
    tags: ['file', 'convert', 'excel', 'csv'],
    component: 'ExcelToCsvTool',
    path: '/tools/excel-to-csv'
  },
  {
    id: 'txt-to-pdf',
    name: 'Text to PDF',
    description: 'Convert plain text files to PDF.',
    category: 'file-converters',
    icon: '📁',
    tags: ['file', 'convert', 'text', 'pdf'],
    component: 'TxtToPdfTool',
    path: '/tools/txt-to-pdf'
  },

  // 7. WEB & MISC UTILITIES
  {
    id: 'generate-qr-code',
    name: 'QR Code Tool',
    description: 'Generate custom QR codes.',
    category: 'web-misc-utilities',
    icon: '📱',
    tags: ['qr-code', 'generator'],
    component: 'QrCodeGeneratorTool',
    path: '/tools/generate-qr-code'
  },
  {
    id: 'http-status-checker',
    name: 'HTTP Status',
    description: 'Check status codes for any URL.',
    category: 'web-misc-utilities',
    icon: '📱',
    tags: ['web', 'http', 'status'],
    component: 'HttpStatusCheckerTool',
    path: '/tools/http-status-checker'
  },
  {
    id: 'url-checker',
    name: 'URL Checker',
    description: 'Quickly check if a website is up or down.',
    category: 'web-misc-utilities',
    icon: '📱',
    tags: ['web', 'url', 'status'],
    component: 'UrlCheckerTool',
    path: '/tools/url-checker'
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calc',
    description: 'Calculate percentages easily.',
    category: 'web-misc-utilities',
    icon: '📱',
    tags: ['math', 'calculator'],
    component: 'PercentageCalculatorTool',
    path: '/tools/percentage-calculator'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate age accurately.',
    category: 'web-misc-utilities',
    icon: '📱',
    tags: ['misc', 'calculator'],
    component: 'AgeCalculatorTool',
    path: '/tools/age-calculator'
  },
  {
    id: 'date-difference-calculator',
    name: 'Date Difference',
    description: 'Calculate time between two dates.',
    category: 'web-misc-utilities',
    icon: '📱',
    tags: ['misc', 'calculator', 'date'],
    component: 'DateDifferenceCalculatorTool',
    path: '/tools/date-difference-calculator'
  },
];

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, ToolConfig>;
  private categories: Map<string, CategoryConfig>;

  private constructor() {
    this.tools = new Map();
    this.categories = new Map();

    // Initialize tools
    TOOLS.forEach(tool => {
      this.tools.set(tool.id, tool);
    });

    // Initialize categories
    Object.values(CATEGORIES).forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  public getTool(id: string): ToolConfig | undefined {
    return this.tools.get(id);
  }

  public getAllTools(): ToolConfig[] {
    return Array.from(this.tools.values());
  }

  public getToolsByCategory(categoryId: string): ToolConfig[] {
    return this.getAllTools().filter(tool => tool.category === categoryId);
  }

  public getCategory(id: string): CategoryConfig | undefined {
    return this.categories.get(id);
  }

  public getAllCategories(): CategoryConfig[] {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  public searchTools(query: string): ToolConfig[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTools().filter(tool =>
      tool.name.toLowerCase().includes(lowercaseQuery) ||
      tool.description.toLowerCase().includes(lowercaseQuery) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      this.getCategory(tool.category)?.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  public getPopularTools(): ToolConfig[] {
    return this.getAllTools().filter(tool => tool.popular);
  }

  public getFeaturedTools(): ToolConfig[] {
    return this.getAllTools().filter(tool => tool.featured);
  }

  public getNewTools(): ToolConfig[] {
    return this.getAllTools().filter(tool => tool.new);
  }

  public getToolsByTag(tag: string): ToolConfig[] {
    return this.getAllTools().filter(tool =>
      tool.tags?.includes(tag)
    );
  }

  public getAllTags(): string[] {
    const tags = new Set<string>();
    this.getAllTools().forEach(tool => {
      tool.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }
}

export const toolRegistry = ToolRegistry.getInstance();
