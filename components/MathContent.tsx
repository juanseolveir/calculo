"use client";

interface MathContentProps {
  html: string;
  className?: string;
}

/**
 * Renders server-generated KaTeX HTML safely.
 * Requires KaTeX CSS to be loaded globally.
 */
export default function MathContent({ html, className = "" }: MathContentProps) {
  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
