'use client';

import React, { lazy, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Loader2 } from 'lucide-react';

interface DynamicToolPageProps {
  toolId: string;
}

// Mapping of tool IDs to their respective components
const toolComponents: Record<string, React.ComponentType<any>> = {
  'pdf-to-word': lazy(() => import('@/app/tools/pdf-to-word/page')),
  'pdf-to-excel': lazy(() => import('@/app/tools/pdf-to-excel/page')),
  'pdf-to-powerpoint': lazy(() => import('@/app/tools/pdf-to-powerpoint/page')),
  'pdf-to-txt': lazy(() => import('@/app/tools/pdf-to-txt/page')),
  'pdf-to-image': lazy(() => import('@/app/tools/pdf-to-image/page')),
  'merge': lazy(() => import('@/app/tools/merge/page')),
  'compress': lazy(() => import('@/app/tools/compress/page')),
  'split': lazy(() => import('@/app/tools/split/page')),
  'lock': lazy(() => import('@/app/tools/lock/page')),
  'unlock': lazy(() => import('@/app/tools/unlock/page')),
  'rotate': lazy(() => import('@/app/tools/rotate/page')),
  'watermark': lazy(() => import('@/app/tools/watermark/page')),
  'page-numbers': lazy(() => import('@/app/tools/page-numbers/page')),
  'delete-pages': lazy(() => import('@/app/tools/delete-pages/page')),
  'reorder-pages': lazy(() => import('@/app/tools/reorder-pages/page')),
  'edit-pdf': lazy(() => import('@/app/tools/edit-pdf/page')),
  'pdf-password': lazy(() => import('@/app/tools/pdf-password/page')),
  'pdf-metadata-viewer': lazy(() => import('@/app/tools/pdf-metadata-viewer/page')),
  'pdf-thumbnail-generator': lazy(() => import('@/app/tools/pdf-thumbnail-generator/page')),
  'word-to-pdf': lazy(() => import('@/app/tools/word-to-pdf/page')),
  'excel-to-pdf': lazy(() => import('@/app/tools/excel-to-pdf/page')),
  'ppt-to-pdf': lazy(() => import('@/app/tools/ppt-to-pdf/page')),
  'remove-pdf-restrictions': lazy(() => import('@/app/tools/remove-pdf-restrictions/page')),
  'add-header-footer': lazy(() => import('@/app/tools/add-header-footer/page')),
  'add-image-watermark': lazy(() => import('@/app/tools/add-image-watermark/page')),
  'resize': lazy(() => import('@/app/tools/resize/page')),
  'crop': lazy(() => import('@/app/tools/crop/page')),
  'flip': lazy(() => import('@/app/tools/flip/page')),
  'convert': lazy(() => import('@/app/tools/convert/page')),
  'image-metadata-viewer': lazy(() => import('@/app/tools/image-metadata-viewer/page')),
  'image-compress': lazy(() => import('@/app/tools/image-compress/page')),
  'base64-to-image': lazy(() => import('@/app/tools/base64-to-image/page')),
  'background-remover': lazy(() => import('@/app/tools/background-remover/page')),
  'word-counter': lazy(() => import('@/app/tools/word-counter/page')),
  'character-counter': lazy(() => import('@/app/tools/character-counter/page')),
  'paragraph-counter': lazy(() => import('@/app/tools/paragraph-counter/page')),
  'sentence-counter': lazy(() => import('@/app/tools/sentence-counter/page')),
  'case-converter': lazy(() => import('@/app/tools/case-converter/page')),
  'lorem-ipsum': lazy(() => import('@/app/tools/lorem-ipsum/page')),
  'remove-duplicates': lazy(() => import('@/app/tools/remove-duplicates/page')),
  'remove-line-breaks': lazy(() => import('@/app/tools/remove-line-breaks/page')),
  'sort-lines': lazy(() => import('@/app/tools/sort-lines/page')),
  'find-and-replace-text': lazy(() => import('@/app/tools/find-and-replace-text/page')),
  'random-text-generator': lazy(() => import('@/app/tools/random-text-generator/page')),
  'password-generator': lazy(() => import('@/app/tools/password-generator/page')),
  'json-formatter': lazy(() => import('@/app/tools/json-formatter/page')),
  'xml-formatter': lazy(() => import('@/app/tools/xml-formatter/page')),
  'base64': lazy(() => import('@/app/tools/base64/page')),
  'hash-generator': lazy(() => import('@/app/tools/hash-generator/page')),
  'md5-generator': lazy(() => import('@/app/tools/md5-generator/page')),
  'sha1-generator': lazy(() => import('@/app/tools/sha1-generator/page')),
  'sha256-generator': lazy(() => import('@/app/tools/sha256-generator/page')),
  'file-hash-generator': lazy(() => import('@/app/tools/file-hash-generator/page')),
  'url-encode-decode': lazy(() => import('@/app/tools/url-encode-decode/page')),
  'html-encode-decode': lazy(() => import('@/app/tools/html-encode-decode/page')),
  'css-minifier': lazy(() => import('@/app/tools/css-minifier/page')),
  'js-minifier': lazy(() => import('@/app/tools/js-minifier/page')),
  'json-to-xml': lazy(() => import('@/app/tools/json-to-xml/page')),
  'xml-to-json': lazy(() => import('@/app/tools/xml-to-json/page')),
  'url-shortener': lazy(() => import('@/app/tools/url-shortener/page')),
  'meta-tags-generator': lazy(() => import('@/app/tools/meta-tags-generator/page')),
  'url-slug-generator': lazy(() => import('@/app/tools/url-slug-generator/page')),
  'keyword-density-checker': lazy(() => import('@/app/tools/keyword-density-checker/page')),
  'serp-preview-tool': lazy(() => import('@/app/tools/serp-preview-tool/page')),
  'robots-txt-generator': lazy(() => import('@/app/tools/robots-txt-generator/page')),
  'robots-txt-tester': lazy(() => import('@/app/tools/robots-txt-tester/page')),
  'xml-sitemap-generator': lazy(() => import('@/app/tools/xml-sitemap-generator/page')),
  'sitemap-validator': lazy(() => import('@/app/tools/sitemap-validator/page')),
  'heading-extractor': lazy(() => import('@/app/tools/heading-extractor/page')),
  'seo-page-analyzer-lite': lazy(() => import('@/app/tools/seo-page-analyzer-lite/page')),
  'zip-file-creator': lazy(() => import('@/app/tools/zip-file-creator/page')),
  'unzip-files': lazy(() => import('@/app/tools/unzip-files/page')),
  'convert-csv-to-excel': lazy(() => import('@/app/tools/convert-csv-to-excel/page')),
  'excel-to-csv': lazy(() => import('@/app/tools/excel-to-csv/page')),
  'txt-to-pdf': lazy(() => import('@/app/tools/txt-to-pdf/page')),
  'generate-qr-code': lazy(() => import('@/app/tools/generate-qr-code/page')),
  'http-status-checker': lazy(() => import('@/app/tools/http-status-checker/page')),
  'url-checker': lazy(() => import('@/app/tools/url-checker/page')),
  'percentage-calculator': lazy(() => import('@/app/tools/percentage-calculator/page')),
  'age-calculator': lazy(() => import('@/app/tools/age-calculator/page')),
  'date-difference-calculator': lazy(() => import('@/app/tools/date-difference-calculator/page')),
  'image-to-pdf': lazy(() => import('@/app/tools/image-to-pdf/page')),
};

export const DynamicToolPage: React.FC<DynamicToolPageProps> = ({ toolId }) => {
  const { getTool } = useApp();
  const tool = getTool(toolId);

  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-8">The tool you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="text-blue-600 hover:underline">Return to homepage</Link>
        </div>
      </div>
    );
  }

  // If we have a component for this tool, render it
  const Component = toolComponents[toolId];
  
  if (Component) {
    return (
      <Suspense fallback={
        <ToolLayout
          title={tool.name}
          description={tool.description}
          toolId={tool.id}
        >
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading tool...</p>
            </div>
          </div>
        </ToolLayout>
      }>
        <Component />
      </Suspense>
    );
  }

  // If no component is found, show coming soon message
  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      toolId={tool.id}
    >
      <div className="text-center py-12">
        <div className="mb-6">
          {tool.icon && <span className="text-6xl">{tool.icon}</span>}
        </div>
        <h2 className="text-2xl font-bold mb-4">{tool.name}</h2>
        <p className="text-gray-600 mb-8">{tool.description}</p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-yellow-800 dark:text-yellow-200">
            This tool is coming soon! We&apos;re working hard to bring you this functionality.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};