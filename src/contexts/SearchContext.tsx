'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tool, ToolCategory } from '@/types/tool';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredTools: Tool[];
  allCategories: ToolCategory[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

// Mock data for tools - in a real app this would come from a database or API
const mockCategories: ToolCategory[] = [
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    icon: '📄',
    description: 'Merge, compress, convert and edit PDF files',
    tools: [
      { id: 'merge-pdf-files', name: 'Merge PDF', description: 'Combine multiple PDF files into one', path: '/tools/merge' },
      { id: 'compress-pdf-file', name: 'Compress PDF', description: 'Reduce PDF file size', path: '/tools/compress' },
      { id: 'convert-pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to editable Word document', path: '/tools/pdf-to-word' },
      { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word document to PDF', path: '/tools/word-to-pdf' },
      { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Extract images from PDF as JPG', path: '/tools/pdf-to-image' },
      { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF', path: '/tools/image-to-pdf' },
      { id: 'split-pdf', name: 'Split PDF', description: 'Split PDF into multiple files', path: '/tools/split' },
      { id: 'pdf-editor', name: 'PDF Editor', description: 'Edit text and images in PDF', path: '/tools/edit-pdf' },
      { id: 'pdf-password', name: 'PDF Password', description: 'Add password protection to PDF', path: '/tools/pdf-password' },
      { id: 'pdf-unlock', name: 'PDF Unlock', description: 'Remove password from PDF', path: '/tools/unlock' },
    ]
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    icon: '🖼️',
    description: 'Optimize, convert and edit images',
    tools: [
      { id: 'compress-image-file', name: 'Image Compressor', description: 'Reduce image file size' },
      { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images to specific dimensions' },
      { id: 'crop-image', name: 'Crop Image', description: 'Crop images to specific dimensions' },
      { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert between image formats' },
      { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert between image formats' },
      { id: 'webp-converter', name: 'WEBP Converter', description: 'Convert images to/from WEBP format' },
      { id: 'image-watermark', name: 'Add Image Watermark', description: 'Add watermark to images' },
      { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate images' },
      { id: 'flip-image', name: 'Flip Image', description: 'Flip images horizontally/vertically' },
    ]
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    icon: '✍️',
    description: 'Count, format and generate text',
    tools: [
      { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters and sentences' },
      { id: 'character-counter', name: 'Character Counter', description: 'Count characters in text' },
      { id: 'sentence-counter', name: 'Sentence Counter', description: 'Count sentences in text' },
      { id: 'paragraph-counter', name: 'Paragraph Counter', description: 'Count paragraphs in text' },
      { id: 'case-converter', name: 'Case Converter', description: 'Change text case (uppercase/lowercase)' },
      { id: 'remove-line-breaks', name: 'Remove Line Breaks', description: 'Remove line breaks from text' },
      { id: 'text-sorter', name: 'Text Sorter', description: 'Sort text lines alphabetically' },
      { id: 'find-replace', name: 'Find & Replace Text', description: 'Find and replace text' },
      { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text' },
      { id: 'random-text', name: 'Random Text Generator', description: 'Generate random text' },
      { id: 'password-generator', name: 'Password Generator', description: 'Generate secure passwords' },
    ]
  },
  {
    id: 'dev-tools',
    name: 'Developer Tools',
    icon: '💻',
    description: 'Utilities for developers',
    tools: [
      { id: 'base64-encode-decode', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64' },
      { id: 'url-encode-decode', name: 'URL Encoder/Decoder', description: 'Encode and decode URL parameters' },
      { id: 'html-encode-decode', name: 'HTML Encoder/Decoder', description: 'Encode and decode HTML entities' },
      { id: 'json-formatter-validator', name: 'JSON Formatter', description: 'Format and validate JSON' },
      { id: 'xml-formatter', name: 'XML Formatter', description: 'Format XML documents' },
      { id: 'css-minifier', name: 'CSS Minifier', description: 'Minify CSS code' },
      { id: 'js-minifier', name: 'JS Minifier', description: 'Minify JavaScript code' },
      { id: 'md5-generator', name: 'MD5 Generator', description: 'Generate MD5 hash' },
      { id: 'sha1-generator', name: 'SHA-1 Generator', description: 'Generate SHA-1 hash' },
      { id: 'sha256-generator', name: 'SHA-256 Generator', description: 'Generate SHA-256 hash' },
    ]
  },
  {
    id: 'seo-tools',
    name: 'SEO Tools',
    icon: '🔍',
    description: 'Optimize your website for search engines',
    tools: [
      { id: 'meta-tags-generator', name: 'Meta Tags Generator', description: 'Generate SEO meta tags' },
      { id: 'url-slug-generator', name: 'URL Slug Generator', description: 'Generate SEO-friendly URLs' },
      { id: 'keyword-density-checker', name: 'Keyword Density Checker', description: 'Analyze keyword density' },
      { id: 'serp-preview-tool', name: 'SERP Preview Tool', description: 'Preview how pages appear in search results' },
      { id: 'robots-txt-generator', name: 'Robots.txt Generator', description: 'Generate robots.txt file' },
      { id: 'robots-txt-tester', name: 'Robots.txt Tester', description: 'Test robots.txt rules' },
      { id: 'sitemap-generator', name: 'XML Sitemap Generator', description: 'Create XML sitemaps' },
      { id: 'sitemap-validator', name: 'Sitemap Validator', description: 'Validate XML sitemaps' },
      { id: 'heading-extractor', name: 'Heading Extractor', description: 'Extract headings from HTML' },
      { id: 'seo-analyzer', name: 'SEO Page Analyzer', description: 'Analyze page SEO factors' },
    ]
  },
  {
    id: 'web-tools',
    name: 'Web Tools',
    icon: '🌐',
    description: 'Utilities for web development',
    tools: [
      { id: 'generate-qr-code', name: 'QR Code Generator', description: 'Create QR codes' },
      { id: 'url-shortener', name: 'URL Shortener', description: 'Shorten long URLs' },
      { id: 'http-status-checker', name: 'HTTP Status Checker', description: 'Check HTTP status codes' },
      { id: 'url-checker', name: 'URL Checker', description: 'Check if URLs are valid' },
      { id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Calculate percentages' },
      { id: 'age-calculator', name: 'Age Calculator', description: 'Calculate age from birthdate' },
      { id: 'date-calculator', name: 'Date Difference Calculator', description: 'Calculate difference between dates' },
    ]
  },
  {
    id: 'file-tools',
    name: 'File & Converter Tools',
    icon: '📁',
    description: 'Utilities for file conversion',
    tools: [
      { id: 'convert-csv-to-excel', name: 'CSV to Excel', description: 'Convert CSV to Excel format' },
    ]
  }
];

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Flatten all tools from all categories
  const allTools: Tool[] = mockCategories.flatMap(category =>
    category.tools.map(tool => ({
      ...tool,
      category: category.name
    }))
  );

  // Filter tools based on search term
  const filteredTools = allTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      filteredTools,
      allCategories: mockCategories
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};