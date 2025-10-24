
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const toHtml = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>') // H3
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-5 border-b pb-2 border-gray-200 dark:border-gray-700">$1</h2>') // H2
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mb-4 mt-6">$1</h1>') // H1
      .replace(/^\s*\n\*/gm, '<ul>\n*')
      .replace(/^(\*.+)\s*\n([^*])/gm, '$1\n</ul>\n\n$2')
      .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc">$1</li>') // li
      .replace(/\n/g, '<br />'); // New lines
  };

  return (
    <div
      className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
      dangerouslySetInnerHTML={{ __html: toHtml(content) }}
    />
  );
};

export default MarkdownRenderer;
