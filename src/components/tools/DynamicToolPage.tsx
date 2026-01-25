'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { ToolLayout } from '@/components/ui/ToolLayout';

interface DynamicToolPageProps {
  toolId: string;
}

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

  // Dynamic component loading would happen here
  // For now, we'll return a placeholder
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